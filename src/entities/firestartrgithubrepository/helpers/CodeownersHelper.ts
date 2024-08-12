import {Repository} from '@cdktf/provider-github/lib/repository';
import {
  RepositoryFile,
  RepositoryFileConfig,
} from '@cdktf/provider-github/lib/repository-file';
import {Construct} from 'constructs';
import Debug from "debug"
import { FirestartrGithubRepository } from '../FirestartrGithubRepository';
import { BranchDefault, BranchDefaultConfig } from "@cdktf/provider-github/lib/branch-default";
const messageLog = Debug(
  'firestartr:provisioner:entities:component:helpers:codeownerscreator'
)

export function provisionCodeowners(

  scope: Construct,

  repo: Repository,

  branchDefault: BranchDefault,

  fsGithubRepository: FirestartrGithubRepository

): void {

  const config: RepositoryFileConfig = {

    dependsOn: [repo, branchDefault],

    branch: fsGithubRepository.spec.repo.defaultBranch,

    commitMessage: 'feat: provision CODEOWNERS file',

    content: fsGithubRepository.spec.repo.codeowners,

    file: '.github/CODEOWNERS',

    overwriteOnCreate: true,

    repository: repo.name,

  };

  messageLog(`Content of the codeowners:  ${fsGithubRepository.spec.repo.codeowners}`);

  const tfStateKey = `_${fsGithubRepository.getTfStateKey()}-codeowners`;

  new RepositoryFile(

    scope,

    tfStateKey,

    config

  );

}
