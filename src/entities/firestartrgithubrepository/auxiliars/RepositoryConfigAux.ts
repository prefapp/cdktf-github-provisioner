import {
  RepositoryConfig,
  RepositoryPages,
  RepositorySecurityAndAnalysis,
  RepositoryTemplate,
} from '@cdktf/provider-github/lib/repository';
import {
  IResolvable,
  ITerraformDependable,
  TerraformProvider,
  TerraformResourceLifecycle,
  ITerraformIterator,
  FileProvisioner,
  LocalExecProvisioner,
  RemoteExecProvisioner,
  SSHProvisionerConnection,
  WinrmProvisionerConnection,
} from 'cdktf';
import { ConfigAux } from '../../base/auxiliars/ConfigAux';

/**
 * @description This class is used to extend the RepositoryConfig interface to add some methods
 * which are used to ignore changes in some properties that are not tracked by Terraform
 * @see https://www.terraform.io/docs/language/meta-arguments/lifecycle.html
 * @see https://www.terraform.io/docs/language/meta-arguments/lifecycle.html#ignore_changes
 * @see https://www.terraform.io/docs/language/meta-arguments/lifecycle.html#ignore_changes_explicitly
 */
export class RepositoryConfigAux extends ConfigAux implements RepositoryConfig {
  allowAutoMerge?: boolean | IResolvable | undefined = undefined;
  allowMergeCommit?: boolean | IResolvable | undefined = undefined;
  allowRebaseMerge?: boolean | IResolvable | undefined = undefined;
  allowSquashMerge?: boolean | IResolvable | undefined  = undefined;
  archiveOnDestroy?: boolean | IResolvable | undefined = undefined;
  archived?: boolean | IResolvable | undefined = undefined;
  autoInit?: boolean | IResolvable | undefined = undefined;
  defaultBranch?: string | undefined = undefined;
  deleteBranchOnMerge?: boolean | IResolvable | undefined = undefined;
  description?: string | undefined = undefined;
  gitignoreTemplate?: string | undefined = undefined;
  hasDownloads?: boolean | IResolvable | undefined = undefined;
  hasIssues?: boolean | IResolvable | undefined = undefined;
  hasProjects?: boolean | IResolvable | undefined = undefined;
  hasWiki?: boolean | IResolvable | undefined = undefined;
  homepageUrl?: string | undefined = undefined;
  id?: string | undefined = undefined;
  ignoreVulnerabilityAlertsDuringRead?: boolean | IResolvable | undefined = undefined;
  isTemplate?: boolean | IResolvable | undefined = undefined;
  licenseTemplate?: string | undefined = undefined;
  mergeCommitMessage?: string | undefined = undefined;
  mergeCommitTitle?: string | undefined = undefined;
  name: string = "";
  private?: boolean | IResolvable | undefined = undefined;
  squashMergeCommitMessage?: string | undefined = undefined;
  squashMergeCommitTitle?: string | undefined = undefined;
  topics?: string[] | undefined = undefined;
  visibility?: string | undefined = undefined;
  vulnerabilityAlerts?: boolean | IResolvable | undefined = undefined;
  pages?: RepositoryPages | undefined = undefined;
  template?: RepositoryTemplate | undefined = undefined;
  dependsOn?: ITerraformDependable[] | undefined = undefined;
  count?: number | undefined = undefined;
  provider?: TerraformProvider | undefined = undefined;
  lifecycle?: TerraformResourceLifecycle | undefined = undefined;
  forEach?: ITerraformIterator | undefined = undefined;
  provisioners?:
    | (FileProvisioner | LocalExecProvisioner | RemoteExecProvisioner)[]
    | undefined = undefined;
  connection?:
    | SSHProvisionerConnection
    | WinrmProvisionerConnection
    | undefined = undefined;
  securityAndAnalysis?: RepositorySecurityAndAnalysis | undefined = undefined;

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
