"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.provisionBranchProtections = exports.provisionRepository = void 0;
const repository_1 = require("@cdktf/provider-github/lib/repository");
const branch_protection_v3_1 = require("@cdktf/provider-github/lib/branch-protection-v3");
const debug_1 = __importDefault(require("debug"));
const messageLog = (0, debug_1.default)('firestartr:provisioner:entities:component:helpers:repositoryhelper');
function provisionRepository(scope, fsGithubRepository) {
    messageLog(`provisionRepository with name ${fsGithubRepository.metadata.name} in org ${fsGithubRepository.spec.org}`);
    const config = {
        name: fsGithubRepository.metadata.name,
        description: fsGithubRepository.spec.repo.description,
        allowMergeCommit: fsGithubRepository.spec.repo.allowMergeCommit,
        allowSquashMerge: fsGithubRepository.spec.repo.allowSquashMerge,
        allowRebaseMerge: fsGithubRepository.spec.repo.allowRebaseMerge,
        allowAutoMerge: fsGithubRepository.spec.repo.allowAutoMerge,
        deleteBranchOnMerge: fsGithubRepository.spec.repo.deleteBranchOnMerge,
        autoInit: fsGithubRepository.spec.repo.autoInit,
        archiveOnDestroy: true,
        allowUpdateBranch: fsGithubRepository.spec.repo.allowUpdateBranch,
        hasIssues: fsGithubRepository.spec.repo.hasIssues,
        visibility: fsGithubRepository.spec.repo.visibility,
        archived: fsGithubRepository.spec.repo.archived,
        gitignoreTemplate: fsGithubRepository.spec.repo.gitignoreTemplate,
        licenseTemplate: fsGithubRepository.spec.repo.licenseTemplate,
        template: fsGithubRepository.spec.repo.template,
        vulnerabilityAlerts: fsGithubRepository.spec.repo.vulnerabilityAlerts,
        topics: fsGithubRepository.spec.repo.topics,
        securityAndAnalysis: fsGithubRepository.spec.repo.securityAndAnalysis,
        hasProjects: fsGithubRepository.spec.repo.hasProjects,
        hasWiki: fsGithubRepository.spec.repo.hasWiki,
        hasDownloads: fsGithubRepository.spec.repo.hasDownloads,
        hasDiscussions: fsGithubRepository.spec.repo.hasDiscussions,
        mergeCommitMessage: fsGithubRepository.spec.repo.mergeCommitMessage,
        ignoreVulnerabilityAlertsDuringRead: fsGithubRepository.spec.repo.ignoreVulnerabilityAlertsDuringRead,
        mergeCommitTitle: fsGithubRepository.spec.repo.mergeCommitTitle,
        squashMergeCommitMessage: fsGithubRepository.spec.repo.squashMergeCommitMessage,
        pages: fsGithubRepository.spec.pages,
    };
    const tfStateKey = `_${fsGithubRepository.getTfStateKey()}`;
    const repo = new repository_1.Repository(scope, tfStateKey, config);
    fsGithubRepository.addResourceToStack(fsGithubRepository.metadata.name, repo);
    return repo;
}
exports.provisionRepository = provisionRepository;
function provisionBranchProtections(scope, repo, fsGithubRepository) {
    messageLog(`provisionBranchProtections with name ${fsGithubRepository.metadata.name} in org ${fsGithubRepository.spec.org}`);
    for (const branchProtection of fsGithubRepository.spec.branchProtections) {
        const tfStateKey = `_${fsGithubRepository.getTfStateKey()}-${branchProtection.pattern}-bp`;
        const statusChecks = {
            strict: true,
            checks: branchProtection.statusChecks.map((c) => `${c}:`),
        };
        const requiredPullRequestReviews = {
            requiredApprovingReviewCount: branchProtection.requiredReviewersCount,
        };
        const config = {
            repository: repo.name,
            branch: branchProtection.branch,
            enforceAdmins: false,
            requireSignedCommits: branchProtection.requireSignedCommits,
            requiredPullRequestReviews: requiredPullRequestReviews,
            requiredStatusChecks: statusChecks,
        };
        const bpV3 = new branch_protection_v3_1.BranchProtectionV3(scope, tfStateKey, config);
        fsGithubRepository.addResourceToStack(`${repo.name}:${branchProtection.branch}`, bpV3);
    }
}
exports.provisionBranchProtections = provisionBranchProtections;
