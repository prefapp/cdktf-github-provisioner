"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provisionDefaultBranch = void 0;
const branch_default_1 = require("@cdktf/provider-github/lib/branch-default");
function provisionDefaultBranch(scope, fsGithubRepository, repo) {
    const tfStateKey = `_${fsGithubRepository.getTfStateKey()}-bd`;
    const repoConfig = {
        dependsOn: [repo],
        branch: fsGithubRepository.spec.repo.defaultBranch,
        rename: false,
        repository: repo.name,
    };
    const branchDefault = new branch_default_1.BranchDefault(scope, tfStateKey, repoConfig);
    fsGithubRepository.addResourceToStack(fsGithubRepository.metadata.name, branchDefault);
    return branchDefault;
}
exports.provisionDefaultBranch = provisionDefaultBranch;
