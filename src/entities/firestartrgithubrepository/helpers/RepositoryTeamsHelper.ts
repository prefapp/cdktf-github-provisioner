import {Repository} from '@cdktf/provider-github/lib/repository';
import { TeamRepository, TeamRepositoryConfig } from '@cdktf/provider-github/lib/team-repository';
import {Construct} from 'constructs';
import Debug from "debug"
import { FirestartrGithubRepository } from '../FirestartrGithubRepository';
import { RepositoryCollaborator, RepositoryCollaboratorConfig } from '@cdktf/provider-github/lib/repository-collaborator';

const messageLog = Debug(
  'firestartr:provisioner:entities:component:helpers:repositoryteamshelper'
)

export function provisionPermissions(
  scope: Construct,
  repo: Repository,
  fsGithubRepository: FirestartrGithubRepository,
): void {

  messageLog(`provisionRepositoryTeams with name ${fsGithubRepository.metadata.name} in org ${fsGithubRepository.spec.org}`)

  for(const permission of fsGithubRepository.spec.permissions){

    if("ref" in permission) {

      const tfStateKey =
        `_${fsGithubRepository.getTfStateKey()}-${permission.ref.kind}-${permission.ref.name}-tr`

      if(permission.ref.kind === "FirestartrGithubGroup"){

        const teamId = fsGithubRepository.resolveRef(permission.ref, "id");

        const config: TeamRepositoryConfig = {

          repository: repo.name,

          teamId,

          permission: permission.role

        }

        const teamsRepository = new TeamRepository(

          scope,

          tfStateKey,

          config

        );

        fsGithubRepository.addResourceToStack(

          `${teamId}:${fsGithubRepository.metadata.name}`,

          teamsRepository

        );

      }

      else if(permission.ref.kind === "FirestartrGithubMembership") {

        const username = fsGithubRepository.resolveRef(permission.ref);

        const config: RepositoryCollaboratorConfig = {

          repository: repo.name,

          username,

          permission: permission.role,

        };

        const collaborator = new RepositoryCollaborator(

          scope,

          tfStateKey,

          config

        );

        fsGithubRepository.addResourceToStack(

          `${fsGithubRepository.metadata.name}:${username}`,

          collaborator

        );

      }

    } else {

      const tfStateKey =
        `_${fsGithubRepository.getTfStateKey()}-collaborator-${permission.collaborator}-tr`

      const config: RepositoryCollaboratorConfig = {

        repository: repo.name,

        username: permission.collaborator,

        permission: permission.role,

      };

      const collaborator = new RepositoryCollaborator(

        scope,

        tfStateKey,

        config

      );

      fsGithubRepository.addResourceToStack(

        `${fsGithubRepository.metadata.name}:${permission.collaborator}`,

        collaborator

      );

    }

  }

}
