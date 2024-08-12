"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestartrTerraformModule = void 0;
const resource_1 = require("../resource");
const debug_1 = __importDefault(require("debug"));
const log = (0, debug_1.default)('firestartr:provisioner:terraform_module');
class FirestartrTerraformModule extends resource_1.Resource {
    static kind() {
        return 'FirestartrTerraformModule';
    }
    async preprocess() {
        const operation = this.get('operation');
        log(operation);
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
exports.FirestartrTerraformModule = FirestartrTerraformModule;
