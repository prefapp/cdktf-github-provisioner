import { runProvisioner } from "../../init";
import common from '@prefapp/firestartr-catalog_common';
import * as fs from "fs";
import path from "path";
import { Resource } from "../../src/resources/resource";
import { FirestartrGithubRepositoryFeature } from "../../src/resources/github_feature";


jest.mock("@prefapp/firestartr-github", async () => {
  return {
    getOctokitForOrg(_owner: string) {
      return {
        request(_url: string, _opts: any) {
          return {
            data: "TEST DATA"
          }
        }
      }
    },
  };
});

describe('init', () => {

  let resource: any;

  it('can provision a feature', async () => {

    Resource.prototype.run = jest.fn()

    const artifact = common.io.fromYaml(
      fs.readFileSync(path.join(__dirname, "fixtures", "feature.yaml"), "utf8")
    )

    resource = await runProvisioner(
      {mainCr: artifact, deps:[]}, { create: true }
    )

    expect(resource.constructor.name).toBe("FirestartrGithubRepositoryFeature")

  })

  it.skip('can preprocess a creation and updates userManaged files', async () => {

    FirestartrGithubRepositoryFeature.prototype.__getFileContentFromProvider = jest.fn().mockReturnValue("TEST CONTENT")

    const previousFiles: any[] = JSON.parse(JSON.stringify(
      resource.get("main_artifact").spec.files
    ));

    await resource.preprocess()

    const currentFiles: any[] = resource.get("main_artifact").spec.files;

    expect(currentFiles).not.toEqual(previousFiles);

  })

});
