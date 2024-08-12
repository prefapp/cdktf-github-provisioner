"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestartrGithubGroup = void 0;
const resource_1 = require("../resource");
const debug_1 = __importDefault(require("debug"));
const log = (0, debug_1.default)('firestartr:provisioner:github_group');
class FirestartrGithubGroup extends resource_1.Resource {
    static kind() {
        return 'FirestartrGithubGroup';
    }
    async preprocess() {
        switch (this.get('operation')) {
            case "CREATE":
                log("CREATE");
                break;
            case "UPDATE":
                log("UPDATED");
                break;
            case "DELETE":
                log("DELETED");
                break;
            case "IMPORT":
                log("IMPORT");
                break;
            case "IMPORT_SKIP_PLAN":
                log("IMPORT_SKIP_PLAN");
                break;
            default:
                log("UNKNOWN");
        }
    }
}
exports.FirestartrGithubGroup = FirestartrGithubGroup;
