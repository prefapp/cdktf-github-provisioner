import { Resource } from "../resource"
import Debug from "debug"
import * as fs from "fs";
import * as path from "path";
import provisioner from "provisioner";

const log = Debug('firestartr:provisioner:terraform_module')

export class FirestartrTerraformModule extends Resource {

    static kind() {

        return 'FirestartrTerraformModule'

    }

    async preprocess() {
        const operation = this.get('operation')
        log(operation)
        switch (operation) {
            case "CREATE":
                break;
            case "UPDATE":
                break;
            case "DELETE":
                break;
            case "IMPORT":
                break;
            case "IMPORT_SKIP_PLAN":
                break;
            default:
                break;

        }
    }
}
