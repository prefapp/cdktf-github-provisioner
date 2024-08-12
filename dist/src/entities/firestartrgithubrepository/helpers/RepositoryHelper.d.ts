import { Construct } from 'constructs';
import { Repository } from '@cdktf/provider-github/lib/repository';
import { FirestartrGithubRepository } from '../FirestartrGithubRepository';
export declare function provisionRepository(scope: Construct, fsGithubRepository: FirestartrGithubRepository): Repository;
export declare function provisionBranchProtections(scope: Construct, repo: Repository, fsGithubRepository: FirestartrGithubRepository): void;
