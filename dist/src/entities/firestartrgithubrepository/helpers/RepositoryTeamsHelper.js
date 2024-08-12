"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.provisionPermissions = void 0;
const team_repository_1 = require("@cdktf/provider-github/lib/team-repository");
const debug_1 = __importDefault(require("debug"));
const repository_collaborator_1 = require("@cdktf/provider-github/lib/repository-collaborator");
const messageLog = (0, debug_1.default)('firestartr:provisioner:entities:component:helpers:repositoryteamshelper');
function provisionPermissions(scope, repo, fsGithubRepository) {
    messageLog(`provisionRepositoryTeams with name ${fsGithubRepository.metadata.name} in org ${fsGithubRepository.spec.org}`);
    for (const permission of fsGithubRepository.spec.permissions) {
        if ("ref" in permission) {
            const tfStateKey = `_${fsGithubRepository.getTfStateKey()}-${permission.ref.kind}-${permission.ref.name}-tr`;
            if (permission.ref.kind === "FirestartrGithubGroup") {
                const teamId = fsGithubRepository.resolveRef(permission.ref, "id");
                const config = {
                    repository: repo.name,
                    teamId,
                    permission: permission.role
                };
                const teamsRepository = new team_repository_1.TeamRepository(scope, tfStateKey, config);
                fsGithubRepository.addResourceToStack(`${teamId}:${fsGithubRepository.metadata.name}`, teamsRepository);
            }
            else if (permission.ref.kind === "FirestartrGithubMembership") {
                const username = fsGithubRepository.resolveRef(permission.ref);
                const config = {
                    repository: repo.name,
                    username,
                    permission: permission.role,
                };
                const collaborator = new repository_collaborator_1.RepositoryCollaborator(scope, tfStateKey, config);
                fsGithubRepository.addResourceToStack(`${fsGithubRepository.metadata.name}:${username}`, collaborator);
            }
        }
        else {
            const tfStateKey = `_${fsGithubRepository.getTfStateKey()}-collaborator-${permission.collaborator}-tr`;
            const config = {
                repository: repo.name,
                username: permission.collaborator,
                permission: permission.role,
            };
            const collaborator = new repository_collaborator_1.RepositoryCollaborator(scope, tfStateKey, config);
            fsGithubRepository.addResourceToStack(`${fsGithubRepository.metadata.name}:${permission.collaborator}`, collaborator);
        }
    }
}
exports.provisionPermissions = provisionPermissions;
