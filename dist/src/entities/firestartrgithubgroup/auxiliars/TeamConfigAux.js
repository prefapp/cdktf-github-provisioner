"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamConfigAux = void 0;
const ConfigAux_1 = require("../../base/auxiliars/ConfigAux");
/**
 * @description This class is used to extend the TeamConfig interface to add some methods
 * which are used to ignore changes in some properties that are not tracked by Terraform
 * @see https://www.terraform.io/docs/language/meta-arguments/lifecycle.html
 * @see https://www.terraform.io/docs/language/meta-arguments/lifecycle.html#ignore_changes
 * @see https://www.terraform.io/docs/language/meta-arguments/lifecycle.html#ignore_changes_explicitly
 */
class TeamConfigAux extends ConfigAux_1.ConfigAux {
    connection = undefined;
    count = undefined;
    dependsOn = undefined;
    forEach = undefined;
    lifecycle = undefined;
    provider = undefined;
    provisioners = undefined;
    name = "";
    createDefaultMaintainer = undefined;
    description = undefined;
    id = undefined;
    ldapDn = undefined;
    parentTeamId = undefined;
    parentTeamReadId = undefined;
    parentTeamReadSlug = undefined;
    privacy = undefined;
    constructor() {
        super({
            trackableProperties: ['name', 'description', 'id', 'ldap_dn', 'privacy']
        });
    }
}
exports.TeamConfigAux = TeamConfigAux;
