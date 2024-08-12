import { untrackManagedFiles } from "../../features";
import {Resource} from "../resource"
import gh from "github"
import Debug from "debug";
import common from "catalog_common";

const log = Debug('firestartr:provisioner:github_repository_feature')

export class FirestartrGithubRepositoryFeature extends Resource {

  static kind(){

    return 'FirestartrGithubRepositoryFeature'

  }

  async preprocess(){

    switch(this.get('operation')){

      case "CREATE":
        log("CREATED")
        await this._updateManagedFiles();
        break;

      case "UPDATE":

        log("UPDATED")
        break;

      case "DELETE":

        log("DELETE")
        await untrackManagedFiles(this.get('main_artifact'), this.get('deps'))

        break;
      default:
        log(`UNKNOWN: ${this.get('operation')}`)

    }

  }

  async _updateManagedFiles() {

    const main: any = this.get("main_artifact");

    const repoInfo: any = main.spec.repositoryTarget;

    for(const file of main.spec.files) {

      if(file.userManaged) {

        try {

          const content = await this.__getFileContentFromProvider(
            main.spec.org,
            `/${main.spec.org}/${this.getRepoExternalName(repoInfo.ref)}/${repoInfo.branch}/${file.path}`
          )

          const newContent: string = Buffer.from(content, "binary").toString("base64");

          file.content = newContent;

        } catch(e: any) {

          log(

            `File ${file.path} not found in repo ${repoInfo.ref.name} on branch ${repoInfo.branch}. File content not updated`

          );

        }
      }
    }
  }


  getRepoExternalName(ref: any){

    const deps = this.get('deps')

    const cr = deps[`${ref.kind}-${ref.name}`].cr

    return cr.metadata.annotations[common.generic.getFirestartrAnnotation('external-name')]

  }


  async __getFileContentFromProvider(org: string, url: string){

    const octokit = await gh.getOctokitForOrg(org);

    const response: any = await octokit.request(
      `GET ${url}`,
      { baseUrl: "https://raw.githubusercontent.com" }
    );

    return response.data;
  }

}
