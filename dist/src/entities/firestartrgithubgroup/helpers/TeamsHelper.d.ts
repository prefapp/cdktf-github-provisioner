import { Construct } from 'constructs';
import { Team } from '@cdktf/provider-github/lib/team';
import { FirestartrGithubGroup } from '../FirestartrGithubGroup';
export declare function provisionGroup(scope: Construct, fsGithubGroup: FirestartrGithubGroup): Team;
