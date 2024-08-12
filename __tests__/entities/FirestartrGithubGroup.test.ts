import 'cdktf/lib/testing/adapters/jest';
import { LocalBackend, TerraformProvider, Testing } from 'cdktf';
import { Team } from '@cdktf/provider-github/lib/team';
import * as fs from 'fs';
import path from 'path';
import common from '@prefapp/firestartr-catalog_common'
import { loadEntity } from "../../src/loader"
import { GithubStack } from '../../src/stacks/GithubStack';
import { GithubProvider } from '@cdktf/provider-github/lib/provider';
import { TeamMembership } from '@cdktf/provider-github/lib/team-membership';


GithubStack.prototype.initProviders = (
  scope: any, tfStatePath: string, backendConfig: any, providerConfig, deps
) => {
  return (
    {
      backend: new LocalBackend(scope),
      provider: new GithubProvider(scope, 'github', {
        owner: "firestartr-test",
        token: "test-token",
      })
    } as unknown
  ) as TerraformProvider
};
const yamlArtifact = fs.readFileSync(path.join(
  __dirname, 'fixtures/mock_catalog/githubgroups/group_a.yaml'
), 'utf8');
const groupArtifact: any = common.io.fromYaml(yamlArtifact);


describe('FirestartrGithubGroup', () => {
  it('should provision a group', async () => {
    const deps = {
      "FirestartrGithubMembership-user_a": {
        cr: {
          "apiVersion": "test/v1",
          "kind": "FirestartrGithubMembership",
          "metadata": { "name": "user_a" },
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
          data: { id: "aaaaa" },
        },
      },
      "FirestartrGithubMembership-user_b": {
        cr: {
          "apiVersion": "test/v1",
          "kind": "FirestartrGithubMembership",
          "metadata": { "name": "user_b" },
          "spec": {
            "context": {
              "backend": {},
              "provider": {}
            }
          }
        },
        secret: {
          data: { id: "bbbbb" },
        },
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
    };

    const stack = await loadEntity(false, groupArtifact, deps, Testing.app(), {mock: true});
    const synthesizedScope = Testing.synth(stack);

    expect(synthesizedScope).toHaveResourceWithProperties(Team, {
      name: groupArtifact.metadata.name,
      description: groupArtifact.spec.description,
      privacy: groupArtifact.spec.privacy,
    });

    const user_a: any = groupArtifact.spec.members[0].ref;
    const user_b: any = groupArtifact.spec.members[1].ref;
    expect(synthesizedScope).toHaveResourceWithProperties(TeamMembership, {
      username: user_a.name,
    });
    expect(synthesizedScope).toHaveResourceWithProperties(TeamMembership, {
      username: user_b.name,
    });
  });

  it("should throw an exception when a ref is not found", async () => {
    const deps = {
      "FirestartrGithubMembership-user_c": {
        cr: {
          "apiVersion": "test/v1",
          "kind": "FirestartrGithubMembership",
          "metadata": { "name": "user_c" },
          "spec": {
            "context": {
              "backend": {},
              "provider": {}
            }
          }
        },
        secret: {
          data: { id: "ccccc" },
        },
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
    };

    expect(
      loadEntity(false, groupArtifact, deps, Testing.app(), {mock: true})
    ).rejects.toThrow();
  });
});
