"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.provisionCodeowners = void 0;
const repository_file_1 = require("@cdktf/provider-github/lib/repository-file");
const debug_1 = __importDefault(require("debug"));
const messageLog = (0, debug_1.default)('firestartr:provisioner:entities:component:helpers:codeownerscreator');
function provisionCodeowners(scope, repo, branchDefault, fsGithubRepository) {
    const config = {
        dependsOn: [repo, branchDefault],
        branch: fsGithubRepository.spec.repo.defaultBranch,
        commitMessage: 'feat: provision CODEOWNERS file',
        content: fsGithubRepository.spec.repo.codeowners,
        file: '.github/CODEOWNERS',
        overwriteOnCreate: true,
        repository: repo.name,
    };
    messageLog(`Content of the codeowners:  ${fsGithubRepository.spec.repo.codeowners}`);
    const tfStateKey = `_${fsGithubRepository.getTfStateKey()}-codeowners`;
    new repository_file_1.RepositoryFile(scope, tfStateKey, config);
}
exports.provisionCodeowners = provisionCodeowners;
