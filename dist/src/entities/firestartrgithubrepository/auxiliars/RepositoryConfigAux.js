"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryConfigAux = void 0;
const ConfigAux_1 = require("../../base/auxiliars/ConfigAux");
/**
 * @description This class is used to extend the RepositoryConfig interface to add some methods
 * which are used to ignore changes in some properties that are not tracked by Terraform
 * @see https://www.terraform.io/docs/language/meta-arguments/lifecycle.html
 * @see https://www.terraform.io/docs/language/meta-arguments/lifecycle.html#ignore_changes
 * @see https://www.terraform.io/docs/language/meta-arguments/lifecycle.html#ignore_changes_explicitly
 */
class RepositoryConfigAux extends ConfigAux_1.ConfigAux {
    allowAutoMerge = undefined;
    allowMergeCommit = undefined;
    allowRebaseMerge = undefined;
    allowSquashMerge = undefined;
    archiveOnDestroy = undefined;
    archived = undefined;
    autoInit = undefined;
    defaultBranch = undefined;
    deleteBranchOnMerge = undefined;
    description = undefined;
    gitignoreTemplate = undefined;
    hasDownloads = undefined;
    hasIssues = undefined;
    hasProjects = undefined;
    hasWiki = undefined;
    homepageUrl = undefined;
    id = undefined;
    ignoreVulnerabilityAlertsDuringRead = undefined;
    isTemplate = undefined;
    licenseTemplate = undefined;
    mergeCommitMessage = undefined;
    mergeCommitTitle = undefined;
    name = "";
    private = undefined;
    squashMergeCommitMessage = undefined;
    squashMergeCommitTitle = undefined;
    topics = undefined;
    visibility = undefined;
    vulnerabilityAlerts = undefined;
    pages = undefined;
    template = undefined;
    dependsOn = undefined;
    count = undefined;
    provider = undefined;
    lifecycle = undefined;
    forEach = undefined;
    provisioners = undefined;
    connection = undefined;
    securityAndAnalysis = undefined;
    constructor() {
        super({
            trackableProperties: [
                'name',
                'visibility',
                'autoInit',
                'defaultBranch',
                'allowAutoMerge',
                'allowMergeCommit',
                'allowRebaseMerge',
                'allowSquashMerge',
                'allowUpdateBranch',
                'archiveOnDestroy',
                'deleteBranchOnMerge',
                'hasIssues',
                'securityAndAnalysis',
            ]
        });
    }
}
exports.RepositoryConfigAux = RepositoryConfigAux;
