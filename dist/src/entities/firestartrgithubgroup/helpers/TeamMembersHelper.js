"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.provisionMembers = void 0;
const debug_1 = __importDefault(require("debug"));
const team_membership_1 = require("@cdktf/provider-github/lib/team-membership");
const messageLog = (0, debug_1.default)('firestartr:provisioner:entities:component:helpers:teamsmembershiphelper');
function provisionMembers(scope, team, fsGithubGroup) {
    messageLog(`provisionMembers of group ${fsGithubGroup.metadata.name} in org ${fsGithubGroup.spec.org}`);
    for (const member of fsGithubGroup.spec.members) {
        messageLog(`Provisioning user ${member.ref.name} for group ${fsGithubGroup.metadata.name}`);
        const tfStateKey = `_${fsGithubGroup.getTfStateKey()}-${member.ref.kind}-${member.ref.name}-tr`;
        if (member.ref.kind === "FirestartrGithubMembership") {
            const username = fsGithubGroup.resolveRef(member.ref);
            const config = {
                dependsOn: [team],
                username,
                teamId: team.id,
                role: member.role
            };
            const membership = new team_membership_1.TeamMembership(scope, tfStateKey, config);
            fsGithubGroup.addResourceToStack(`${team.id}:${username}`, membership);
        }
    }
}
exports.provisionMembers = provisionMembers;
