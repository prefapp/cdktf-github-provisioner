import {Construct} from 'constructs';
import { Team, TeamConfig } from '@cdktf/provider-github/lib/team';
import Debug from "debug"
import { FirestartrGithubGroup } from '../FirestartrGithubGroup';
// import { TeamConfigAux } from '../auxiliars/TeamConfigAux';

const messageLog = Debug('firestartr:provisioner:entities:component:helpers:repositoryhelper')

export function provisionGroup(
  scope: Construct, fsGithubGroup: FirestartrGithubGroup
){
  messageLog(
    `provisionGroup with name ${fsGithubGroup.metadata.name} in org ${fsGithubGroup.spec.org}`
  )

  const config: TeamConfig = {
    name: fsGithubGroup.metadata.name,
    description: fsGithubGroup.spec.description,
    privacy: fsGithubGroup.spec.privacy,
  }

  const tfStateKey = `_${fsGithubGroup.getTfStateKey()}`

  const group = new Team(scope, tfStateKey, config);

  fsGithubGroup.addResourceToStack(

    fsGithubGroup.metadata.name,

    group

  );

  return group;
}
