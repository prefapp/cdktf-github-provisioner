import { Repository } from '@cdktf/provider-github/lib/repository';
import { Construct } from 'constructs';
import { FirestartrGithubRepository } from '../FirestartrGithubRepository';
export declare function provisionPermissions(scope: Construct, repo: Repository, fsGithubRepository: FirestartrGithubRepository): void;
