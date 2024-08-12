import { Construct } from 'constructs';
import { TerraformResourceLifecycle } from 'cdktf/lib/terraform-resource';
import { RepositoryFile, RepositoryFileConfig } from '@cdktf/provider-github/lib/repository-file';
import Debug from "debug"
import { FirestartrGithubRepositoryFeature } from '../entities/feature/FirestartrGithubRepositoryFeature';
import { Fn } from 'cdktf';
import common from '@prefapp/firestartr-catalog_common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const messageLog = Debug('firestartr:provisioner:features:provisioner')

export function provisionFeatureFiles(
  scope: Construct,
  feature: FirestartrGithubRepositoryFeature
) {

  messageLog(`Provisioning feature ${feature.spec.type} for ${feature.spec.repositoryTarget.name}`);

  messageLog('Feature output json: %O', feature);

  const tmpDir = '/tmp/features_files_provisioning';

  /**
   * Clean up the features files directory
   */
  fs.existsSync(tmpDir) &&

  fs.rmdirSync(tmpDir, { recursive: true });

  /**
   * Create the features files directory
   */
  fs.mkdirSync(tmpDir, { recursive: true });

  const writeFeatureFileToDiskFn = (tmpDir: string, fileName: string, content: string) => {

    const filePath = path.join(tmpDir, fileName);

    messageLog('Writing file %s to %s', fileName, filePath);

    fs.writeFileSync(filePath, Buffer.from(content, 'base64').toString('utf8'), { encoding: 'utf-8' });

    return filePath;
  }

  if(feature.spec.files) {

    for(const file of feature.spec.files) {

      messageLog('Provisioning file %O', file);

      const tmpPathFile = writeFeatureFileToDiskFn(tmpDir, uuidv4(), file.content);

      const lifecycleArg: TerraformResourceLifecycle = file.userManaged ? { ignoreChanges: ['content'] }: {};

      const repoConfig: RepositoryFileConfig = {

        branch: feature.spec.repositoryTarget.branch,

        commitMessage: `feat: ${feature.spec.type} ${feature.spec.version}`,

        content: Fn.file(tmpPathFile),

        file: file.path,

        repository: feature.resolveRef(feature.spec.repositoryTarget.ref),

        overwriteOnCreate: true,

        lifecycle: lifecycleArg
      };

      new RepositoryFile(scope, `${feature.spec.type}-${file.path}`, repoConfig);

    }
  }
}
