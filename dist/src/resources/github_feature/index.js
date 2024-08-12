"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestartrGithubRepositoryFeature = void 0;
const features_1 = require("../../features");
const resource_1 = require("../resource");
const github_1 = __importDefault(require("github"));
const debug_1 = __importDefault(require("debug"));
const catalog_common_1 = __importDefault(require("catalog_common"));
const log = (0, debug_1.default)('firestartr:provisioner:github_repository_feature');
class FirestartrGithubRepositoryFeature extends resource_1.Resource {
    static kind() {
        return 'FirestartrGithubRepositoryFeature';
    }
    async preprocess() {
        switch (this.get('operation')) {
            case "CREATE":
                log("CREATED");
                await this._updateManagedFiles();
                break;
            case "UPDATE":
                log("UPDATED");
                break;
            case "DELETE":
                log("DELETE");
                await (0, features_1.untrackManagedFiles)(this.get('main_artifact'), this.get('deps'));
                break;
            default:
                log(`UNKNOWN: ${this.get('operation')}`);
        }
    }
    async _updateManagedFiles() {
        const main = this.get("main_artifact");
        const repoInfo = main.spec.repositoryTarget;
        for (const file of main.spec.files) {
            if (file.userManaged) {
                try {
                    const content = await this.__getFileContentFromProvider(main.spec.org, `/${main.spec.org}/${this.getRepoExternalName(repoInfo.ref)}/${repoInfo.branch}/${file.path}`);
                    const newContent = Buffer.from(content, "binary").toString("base64");
                    file.content = newContent;
                }
                catch (e) {
                    log(`File ${file.path} not found in repo ${repoInfo.ref.name} on branch ${repoInfo.branch}. File content not updated`);
                }
            }
        }
    }
    getRepoExternalName(ref) {
        const deps = this.get('deps');
        const cr = deps[`${ref.kind}-${ref.name}`].cr;
        return cr.metadata.annotations[catalog_common_1.default.generic.getFirestartrAnnotation('external-name')];
    }
    async __getFileContentFromProvider(org, url) {
        const octokit = await github_1.default.getOctokitForOrg(org);
        const response = await octokit.request(`GET ${url}`, { baseUrl: "https://raw.githubusercontent.com" });
        return response.data;
    }
}
exports.FirestartrGithubRepositoryFeature = FirestartrGithubRepositoryFeature;
