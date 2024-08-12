import { BranchDefault } from "@cdktf/provider-github/lib/branch-default";
import { Construct } from 'constructs';
import { Repository } from "@cdktf/provider-github/lib/repository";
import { FirestartrGithubRepository } from "../FirestartrGithubRepository";
export declare function provisionDefaultBranch(scope: Construct, fsGithubRepository: FirestartrGithubRepository, repo: Repository): BranchDefault;
