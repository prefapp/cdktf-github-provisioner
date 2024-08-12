import { TeamConfig } from '@cdktf/provider-github/lib/team';
import { IResolvable, ITerraformDependable, TerraformProvider, TerraformResourceLifecycle, ITerraformIterator, FileProvisioner, LocalExecProvisioner, RemoteExecProvisioner, SSHProvisionerConnection, WinrmProvisionerConnection } from 'cdktf';
import { ConfigAux } from '../../base/auxiliars/ConfigAux';
/**
 * @description This class is used to extend the TeamConfig interface to add some methods
 * which are used to ignore changes in some properties that are not tracked by Terraform
 * @see https://www.terraform.io/docs/language/meta-arguments/lifecycle.html
 * @see https://www.terraform.io/docs/language/meta-arguments/lifecycle.html#ignore_changes
 * @see https://www.terraform.io/docs/language/meta-arguments/lifecycle.html#ignore_changes_explicitly
 */
export declare class TeamConfigAux extends ConfigAux implements TeamConfig {
    connection?: SSHProvisionerConnection | WinrmProvisionerConnection | undefined;
    count?: number | undefined;
    dependsOn?: ITerraformDependable[] | undefined;
    forEach?: ITerraformIterator | undefined;
    lifecycle?: TerraformResourceLifecycle | undefined;
    provider?: TerraformProvider | undefined;
    provisioners?: (FileProvisioner | LocalExecProvisioner | RemoteExecProvisioner)[] | undefined;
    name: string;
    createDefaultMaintainer?: boolean | IResolvable | undefined;
    description?: string | undefined;
    id?: string | undefined;
    ldapDn?: string | undefined;
    parentTeamId?: string | undefined;
    parentTeamReadId?: string | undefined;
    parentTeamReadSlug?: string | undefined;
    privacy?: string | undefined;
    constructor();
}
