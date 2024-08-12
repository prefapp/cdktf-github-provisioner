import { Team } from '@cdktf/provider-github/lib/team';
import { Construct } from 'constructs';
import Debug from "debug"
import { FirestartrGithubGroup } from '../FirestartrGithubGroup';
import { TeamMembership, TeamMembershipConfig } from '@cdktf/provider-github/lib/team-membership';
import * as fs from 'fs';
const messageLog = Debug(
  'firestartr:provisioner:entities:component:helpers:teamsmembershiphelper'
)

export function provisionMembers(
  scope: Construct, team: Team, fsGithubGroup: FirestartrGithubGroup,
): void {
  messageLog(
    `provisionMembers of group ${fsGithubGroup.metadata.name} in org ${fsGithubGroup.spec.org}`
  )

  for(const member of fsGithubGroup.spec.members){

    messageLog(
      `Provisioning user ${member.ref.name} for group ${fsGithubGroup.metadata.name}`
    )

    const tfStateKey = `_${fsGithubGroup.getTfStateKey()}-${member.ref.kind}-${member.ref.name}-tr`

    if(member.ref.kind === "FirestartrGithubMembership"){

      const username = fsGithubGroup.resolveRef(member.ref);

      const config: TeamMembershipConfig = {

        dependsOn: [team],

        username,

        teamId: team.id,

        role: member.role

      };

      const membership = new TeamMembership(scope, tfStateKey, config);


      fsGithubGroup.addResourceToStack(

        `${team.id}:${username}`,

        membership

      );

    }
  }
}
