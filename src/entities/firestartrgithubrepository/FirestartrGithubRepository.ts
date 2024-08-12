import { Construct } from 'constructs';
import { Entity } from '../base/Entity';
import { provisionCodeowners as provisionCodeowners } from './helpers/CodeownersHelper';
import { provisionPermissions as provisionPermissions } from './helpers/RepositoryTeamsHelper';
import { provisionBranchProtections, provisionRepository } from './helpers/RepositoryHelper';
import { orgHasOneOfThesePlans } from '../../config/config';
import { provisionOIDCSubjectClaim } from './helpers/ActionsHelper';
import { Repository } from '@cdktf/provider-github/lib/repository';
import { provisionDefaultBranch } from './helpers/DefaultBranchHelper';

export class FirestartrGithubRepository extends Entity  {

  constructor(artifact: any, deps: any) {

    super(artifact, deps)

  }

  async loadResources(data: {scope: Construct}): Promise<void> {

    const {scope} = data;

    this.mainResource = provisionRepository(scope, this);

    const branchDefault = provisionDefaultBranch(scope, this, this.mainResource as Repository)

    provisionOIDCSubjectClaim(scope, this.mainResource as Repository, this);

    if(await this.orgHasOneOfThesePlans(this.spec.org, ["team", "enterprise"])){

      provisionBranchProtections(scope, this.mainResource as Repository, this);

    }

    provisionCodeowners(
      scope,
      this.mainResource as Repository,
      branchDefault,
      this
    );

    provisionPermissions(scope, this.mainResource as Repository, this);

  }

  async orgHasOneOfThesePlans(org: string, plans: string[]): Promise<boolean> {

    return orgHasOneOfThesePlans(org, plans);
  }
}
