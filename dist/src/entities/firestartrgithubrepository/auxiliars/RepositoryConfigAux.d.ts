import { RepositoryConfig, RepositoryPages, RepositorySecurityAndAnalysis, RepositoryTemplate } from '@cdktf/provider-github/lib/repository';
import { IResolvable, ITerraformDependable, TerraformProvider, TerraformResourceLifecycle, ITerraformIterator, FileProvisioner, LocalExecProvisioner, RemoteExecProvisioner, SSHProvisionerConnection, WinrmProvisionerConnection } from 'cdktf';
import { ConfigAux } from '../../base/auxiliars/ConfigAux';
/**
 * @description This class is used to extend the RepositoryConfig interface to add some methods
 * which are used to ignore changes in some properties that are not tracked by Terraform
 * @see https://www.terraform.io/docs/language/meta-arguments/lifecycle.html
 * @see https://www.terraform.io/docs/language/meta-arguments/lifecycle.html#ignore_changes
 * @see https://www.terraform.io/docs/language/meta-arguments/lifecycle.html#ignore_changes_explicitly
 */
export declare class RepositoryConfigAux extends ConfigAux implements RepositoryConfig {
    allowAutoMerge?: boolean | IResolvable | undefined;
    allowMergeCommit?: boolean | IResolvable | undefined;
    allowRebaseMerge?: boolean | IResolvable | undefined;
    allowSquashMerge?: boolean | IResolvable | undefined;
    archiveOnDestroy?: boolean | IResolvable | undefined;
    archived?: boolean | IResolvable | undefined;
    autoInit?: boolean | IResolvable | undefined;
    defaultBranch?: string | undefined;
    deleteBranchOnMerge?: boolean | IResolvable | undefined;
    description?: string | undefined;
    gitignoreTemplate?: string | undefined;
    hasDownloads?: boolean | IResolvable | undefined;
    hasIssues?: boolean | IResolvable | undefined;
    hasProjects?: boolean | IResolvable | undefined;
    hasWiki?: boolean | IResolvable | undefined;
    homepageUrl?: string | undefined;
    id?: string | undefined;
    ignoreVulnerabilityAlertsDuringRead?: boolean | IResolvable | undefined;
    isTemplate?: boolean | IResolvable | undefined;
    licenseTemplate?: string | undefined;
    mergeCommitMessage?: string | undefined;
    mergeCommitTitle?: string | undefined;
    name: string;
    private?: boolean | IResolvable | undefined;
    squashMergeCommitMessage?: string | undefined;
    squashMergeCommitTitle?: string | undefined;
    topics?: string[] | undefined;
    visibility?: string | undefined;
    vulnerabilityAlerts?: boolean | IResolvable | undefined;
    pages?: RepositoryPages | undefined;
    template?: RepositoryTemplate | undefined;
    dependsOn?: ITerraformDependable[] | undefined;
    count?: number | undefined;
    provider?: TerraformProvider | undefined;
    lifecycle?: TerraformResourceLifecycle | undefined;
    forEach?: ITerraformIterator | undefined;
    provisioners?: (FileProvisioner | LocalExecProvisioner | RemoteExecProvisioner)[] | undefined;
    connection?: SSHProvisionerConnection | WinrmProvisionerConnection | undefined;
    securityAndAnalysis?: RepositorySecurityAndAnalysis | undefined;
    constructor();
}
