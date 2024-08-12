import { Construct } from 'constructs';
import { provisionFeatureFiles } from '../../features/provisioner';
import { Entity } from '../base/Entity';

export class FirestartrGithubRepositoryFeature extends Entity  {

  constructor(artifact: any, deps: any) {
    super(artifact, deps)
  }

  async loadResources(data: {scope: Construct}): Promise<void> {

    const {scope} = data;

    provisionFeatureFiles(scope, this);
  }
}
