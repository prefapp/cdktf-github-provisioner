import { Construct } from 'constructs';
import { Entity } from '../base/Entity';
import { provisionMembership } from './helpers/MembershipHelper';

export class FirestartrGithubMembership extends Entity {
  constructor(entity: any) {
    super(entity);
  }

  async loadResources(data: { scope: Construct }): Promise<void> {

    const { scope } = data;

    this.mainResource = provisionMembership(scope, this);

  }
}
