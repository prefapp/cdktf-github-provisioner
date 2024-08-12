import {
  TeamConfig,
} from '@cdktf/provider-github/lib/team';
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
 * @description This class is used to extend the TeamConfig interface to add some methods
 * which are used to ignore changes in some properties that are not tracked by Terraform
 * @see https://www.terraform.io/docs/language/meta-arguments/lifecycle.html
 * @see https://www.terraform.io/docs/language/meta-arguments/lifecycle.html#ignore_changes
 * @see https://www.terraform.io/docs/language/meta-arguments/lifecycle.html#ignore_changes_explicitly
 */
export class TeamConfigAux extends ConfigAux implements TeamConfig {
  connection?:
    | SSHProvisionerConnection
    | WinrmProvisionerConnection
    | undefined = undefined;
  count?: number | undefined = undefined;
  dependsOn?: ITerraformDependable[] | undefined = undefined;
  forEach?: ITerraformIterator | undefined = undefined;
  lifecycle?: TerraformResourceLifecycle | undefined = undefined;
  provider?: TerraformProvider | undefined = undefined;
  provisioners?:
    | (FileProvisioner | LocalExecProvisioner | RemoteExecProvisioner)[]
    | undefined = undefined;
  name: string = "";
  createDefaultMaintainer?: boolean | IResolvable | undefined = undefined;
  description?: string | undefined = undefined;
  id?: string | undefined = undefined;
  ldapDn?: string | undefined = undefined;
  parentTeamId?: string | undefined = undefined;
  parentTeamReadId?: string | undefined = undefined;
  parentTeamReadSlug?: string | undefined = undefined;
  privacy?: string | undefined = undefined;

  constructor() {
    super({
      trackableProperties: ['name', 'description', 'id', 'ldap_dn', 'privacy']
    });
  }
}
