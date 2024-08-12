import { Repository } from '@cdktf/provider-github/lib/repository';
import { Construct } from 'constructs';
import { FirestartrGithubRepository } from '../FirestartrGithubRepository';
import { BranchDefault } from "@cdktf/provider-github/lib/branch-default";
export declare function provisionCodeowners(scope: Construct, repo: Repository, branchDefault: BranchDefault, fsGithubRepository: FirestartrGithubRepository): void;
