import { LocalBackend, Testing, TerraformProvider } from 'cdktf';
import 'cdktf/lib/testing/adapters/jest';
import * as path from 'path';
import * as fs from 'fs';
import common from 'catalog_common';
import { FirestartrGithubRepositoryFeature } from '../../src/entities/feature/FirestartrGithubRepositoryFeature';
import { RepositoryFile } from '@cdktf/provider-github/lib/repository-file';
import { DataGithubRepository } from '@cdktf/provider-github/lib/data-github-repository';
import { GithubStack } from '../../src/stacks/GithubStack';
import { GithubProvider } from '@cdktf/provider-github/lib/provider';
import { loadEntity } from '../../src/loader';

describe('Features Entity', () => {

  it('can be provisioned',async () => {

    mockFunctionPrototypes();

    const {cr, deps} = getMockCrdAndDeps();

    const app = Testing.app();

    const stack = await loadEntity(false, cr, deps, app, {mock: true})

    const synthesizedScope = Testing.synth(stack)

    expect(synthesizedScope).toHaveResource(RepositoryFile);

    expect(synthesizedScope).toHaveResourceWithProperties(RepositoryFile, {
        branch: "experimental",
        commit_message: "feat: feature_a v1.0.0",
        file: "/my/repo/path/hello.yaml",
        lifecycle: { ignore_changes: ["content" ]},
        overwrite_on_create: true,
        repository: "test-demo-a",
    });

  });

});

function getMockCrdAndDeps(){

  const yamlFeatureFile = fs.readFileSync(path.join(__dirname, 'fixtures', 'mock_catalog',  'features','feature_a.yaml'), 'utf8');

  const featureAconfig = common.io.fromYaml(yamlFeatureFile);

  const deps ={
    "FirestartrGithubRepository-test-demo-a": {
      cr: {
        "apiVersion": "firestartr/v1",
        "kind": "FirestartrGithubRepository",
        "metadata": {
          "name": "test-demo-a"
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
    },
  }


  return {cr: featureAconfig, deps: deps}

}



function mockFunctionPrototypes(){

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
