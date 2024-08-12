import { Construct } from 'constructs';
import { Entity } from '../base/Entity';
import { provisionGroup } from './helpers/TeamsHelper';
import { provisionMembers } from './helpers/TeamMembersHelper';
import { Team } from '@cdktf/provider-github/lib/team';



export class FirestartrGithubGroup extends Entity  {
  constructor(artifact: any, deps: any) {
    super(artifact, deps)
  }

  async loadResources(data: {scope: Construct}): Promise<void> {

    const { scope } = data;

    this.mainResource = provisionGroup(scope, this);

    provisionMembers(scope, this.mainResource as Team, this);

  }
}
