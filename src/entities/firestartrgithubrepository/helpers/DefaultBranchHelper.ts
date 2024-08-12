import { BranchDefault, BranchDefaultConfig } from "@cdktf/provider-github/lib/branch-default";
import {Construct} from 'constructs';
import { Repository } from "@cdktf/provider-github/lib/repository";
import { FirestartrGithubRepository } from "../FirestartrGithubRepository";

export function provisionDefaultBranch(

    scope: Construct,

    fsGithubRepository: FirestartrGithubRepository,

    repo: Repository

): BranchDefault {

    const tfStateKey = `_${fsGithubRepository.getTfStateKey()}-bd`;

    const repoConfig: BranchDefaultConfig = {

        dependsOn: [repo],

        branch: fsGithubRepository.spec.repo.defaultBranch,

        rename: false,

        repository: repo.name,
    }

    const branchDefault = new BranchDefault(

        scope,

        tfStateKey,

        repoConfig

    );

    fsGithubRepository.addResourceToStack(

        fsGithubRepository.metadata.name,

        branchDefault
    );

    return branchDefault;
}
