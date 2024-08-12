import 'cdktf/lib/testing/adapters/jest';
import { LocalBackend, TerraformProvider, TerraformOutput, Testing } from 'cdktf';
import {Repository} from '@cdktf/provider-github/lib/repository';
import * as fs from 'fs';
import path from 'path';
import common from '@prefapp/firestartr-catalog_common'
import {loadEntity} from "../../src/loader"
import { GithubStack } from '../../src/stacks/GithubStack';
import { GithubProvider } from '@cdktf/provider-github/lib/provider';
import { BranchProtection } from '@cdktf/provider-github/lib/branch-protection';
import { FirestartrGithubRepository } from '../../src/entities/firestartrgithubrepository/FirestartrGithubRepository';
import { RepositoryFile } from '@cdktf/provider-github/lib/repository-file';
import { ActionsRepositoryOidcSubjectClaimCustomizationTemplate } from '@cdktf/provider-github/lib/actions-repository-oidc-subject-claim-customization-template';
import { TeamRepository } from '@cdktf/provider-github/lib/team-repository';
import { RepositoryCollaborator } from '@cdktf/provider-github/lib/repository-collaborator';
import { BranchProtectionV3 } from '@cdktf/provider-github/lib/branch-protection-v3';


describe('FirestartrGithubRepository', () => {

  it('should provision a repository', async() => {

      mockFunctionPrototypes();

      const {cr, deps} = getMockCrdAndDeps();

      const app = Testing.app();

      const stack = await loadEntity(false, cr, deps, app, {mock: true})

      const synthesizedScope = Testing.synth(stack)

      expect(synthesizedScope).toHaveResourceWithProperties(RepositoryFile, {
        repository: "${github_repository._0a52318a-516a-4c05-b0ff-42ffd7745fee.name}",
        content: cr.spec.repo.codeowners,
        branch: cr.spec.repo.defaultBranch,
        file: ".github/CODEOWNERS",
        commit_message: "feat: provision CODEOWNERS file",
        overwrite_on_create: true
      });

      expect(synthesizedScope).toHaveResourceWithProperties(Repository, {
        name: cr.metadata.name,
        description: cr.spec.repo.description,
        allow_merge_commit: cr.spec.repo.allowMergeCommit,
        allow_squash_merge: cr.spec.repo.allowSquashMerge,
        allow_rebase_merge: cr.spec.repo.allowRebaseMerge,
        allow_auto_merge: cr.spec.repo.allowAutoMerge,
        delete_branch_on_merge: cr.spec.repo.deleteBranchOnMerge,
        auto_init: cr.spec.repo.autoInit,
        archive_on_destroy: true,
        allow_update_branch: cr.spec.repo.allowUpdateBranch,
        has_issues: cr.spec.repo.hasIssues,
        visibility: cr.spec.repo.visibility,
      });

      const bp = cr.spec.branchProtections[0]

      expect(synthesizedScope).toHaveResourceWithProperties(BranchProtectionV3, {
        repository: "${github_repository._0a52318a-516a-4c05-b0ff-42ffd7745fee.name}",
        branch: bp.branch,
        enforce_admins: false,
        require_signed_commits: bp.requireSignedCommits,
        required_pull_request_reviews: {
          required_approving_review_count: bp.requiredReviewersCount,
        },
        required_status_checks: {
          strict: true,
          checks: bp.statusChecks.map((c:any)=>`${c}:`)
        }
      });

      expect(synthesizedScope).toHaveResourceWithProperties(ActionsRepositoryOidcSubjectClaimCustomizationTemplate, {
        repository: "${github_repository._0a52318a-516a-4c05-b0ff-42ffd7745fee.name}",
        use_default: true
      });

      expect(synthesizedScope).not.toHaveResourceWithProperties(ActionsRepositoryOidcSubjectClaimCustomizationTemplate, {
        include_claim_keys: undefined,
      });

      const team1: any = cr.spec.permissions[0]


      // decode the secret
      const team1Id = Buffer.from(deps[`${team1.ref.kind}-${team1.ref.name}`].secret.data.id, 'base64').toString('utf8')

      console.log("team1Id", team1Id)

      expect(synthesizedScope).toHaveResourceWithProperties(TeamRepository, {
        repository: "${github_repository._0a52318a-516a-4c05-b0ff-42ffd7745fee.name}",
        team_id: team1Id,
        permission: team1.role
      });

      const team2: any = cr.spec.permissions[1]

      const team2Id = Buffer.from(deps[`${team2.ref.kind}-${team2.ref.name}`].secret.data.id, 'base64').toString('utf8')

      expect(synthesizedScope).toHaveResourceWithProperties(TeamRepository, {
        repository: "${github_repository._0a52318a-516a-4c05-b0ff-42ffd7745fee.name}",
        team_id: team2Id,
        permission: team2.role
      });

      const user: any = cr.spec.permissions[2]

      expect(synthesizedScope).toHaveResourceWithProperties(RepositoryCollaborator, {
        repository: "${github_repository._0a52318a-516a-4c05-b0ff-42ffd7745fee.name}",
        username: deps[`${user.ref.kind}-${user.ref.name}`].cr.metadata.name,
        permission: user.role
      });

      const outsideCollaborator: any = cr.spec.permissions[3]

      expect(synthesizedScope).toHaveResourceWithProperties(RepositoryCollaborator, {
        repository: "${github_repository._0a52318a-516a-4c05-b0ff-42ffd7745fee.name}",
        username: outsideCollaborator.collaborator,
        permission: outsideCollaborator.role
      });


      const stackNodes = app.node.findAll()

      const nodeIds =stackNodes.map((n: any) => n.node.id)

      for(const nodeId of cr.spec.writeConnectionSecretToRef.outputs){

        expect(nodeIds).toContain(nodeId.key)

      }

      expect(synthesizedScope).toHaveProvider(GithubProvider)

      expect(Testing.fullSynth(stack)).toPlanSuccessfully();

    });

});




function getMockCrdAndDeps(){
   // read the yaml file
   const yamlFileContent = fs.readFileSync(path.join(__dirname, 'fixtures/mock_catalog/githubrepositories/repository_test-demo-a.yaml'), 'utf8');
   const cr: any = common.io.fromYaml(yamlFileContent);

   // prepare the dependencies
   const deps: any = {
     "FirestartrGithubGroup-group-a": {
       cr: {
         "apiVersion": "test/v1",
         "kind": "FirestartrGithubGroup",
         "metadata": {
           "name": "group-a"
         },
         "spec": {
           "context": {
             "backend": {
               "ref": {
                 "kind": "FirestartrProviderConfig",
                 "name": "fixture-provider-config",
                 "needSecret": false,
               }
             },
             "provider": {
               "ref": {
                 "kind": "FirestartrProviderConfig",
                 "name": "fixture-provider-config",
                 "needSecret": false,
               }
             }
           }
         }
       },
       secret: {
         data : {
           id: "MTExMTE="
         }
       }
     },
     "FirestartrGithubGroup-group-b": {
       cr: {
         "apiVersion": "test/v1",
         "kind": "FirestartrGithubMembership",
         "metadata": {
           "name": "group-b",
         },
         "spec": {
           "context": {
             "backend": {
               "ref": {
                 "kind": "FirestartrProviderConfig",
                 "name": "fixture-provider-config",
                 "needSecret": false,
               }
             },
             "provider": {
               "ref": {
                 "kind": "FirestartrProviderConfig",
                 "name": "fixture-provider-config",
                 "needSecret": false,
               }
             }
           }
         }
       },
       secret: {
         data : {
           id: "MTExMTE="
         }
       }
     },
     "FirestartrGithubMembership-arvegadev": {

        cr: {
          "apiVersion": "test/v1",
          "kind": "FirestartrGithubMembership",
          "metadata": {
            "name": "arvegadev",
         },
         "spec": {
           "context": {
             "backend": {
               "ref": {
                 "kind": "FirestartrProviderConfig",
                 "name": "fixture-provider-config",
                 "needSecret": false,
               }
             },
             "provider": {
               "ref": {
                 "kind": "FirestartrProviderConfig",
                 "name": "fixture-provider-config",
                 "needSecret": false,
               }
             }
           }
          }
         },
          secret: {}
        },
     "FirestartrProviderConfig-fixture-provider-config": {
       cr: {
         "apiVersion": "test/v1",
         "kind": "FirestartrProviderConfig",
         "metadata": { "name": "fixture-provider-config" },
         "spec": {
           "config": "{}"
         }
       }
     }
    }


   return {cr, deps}
}


function mockFunctionPrototypes(){

    // mock the orgHasOneOfThesePlans method
    FirestartrGithubRepository.prototype.orgHasOneOfThesePlans = async (org: string, plans: string[]): Promise<boolean> => { return true}

    // mock the initProviders method
  GithubStack.prototype.initProviders = (scope: any, tfStatePath: string, backendConfig: any, providerConfig: any, deps: any) => {
    return (
      {
        backend: new LocalBackend(scope),
        provider: new GithubProvider(scope, 'github', {
          owner: "firestartr-test",
          token: "test-token",
        })
      } as unknown
    ) as TerraformProvider
  }

}
