import {Resource} from "../resource"
import Debug from "debug"

const log = Debug('firestartr:provisioner:github_membership')

export class FirestartrGithubMembership extends Resource {

  static kind(){

    return 'FirestartrGithubMembership'

  }

  async preprocess(){

    switch(this.get('operation')){

      case "CREATE":

        log("CREATE")

        break;
      case "UPDATE":

        log("UPDATED")

        break;

      case "DELETE":

        log("DELETED")

        break;

      case "IMPORT":

        log("IMPORT")

        break;

      case "IMPORT_SKIP_PLAN":

        log("IMPORT_SKIP_PLAN")

        break;

      default:
        log("UNKNOWN")

    }

  }

}
