import { Team } from '@cdktf/provider-github/lib/team';
import { Construct } from 'constructs';
import { FirestartrGithubGroup } from '../FirestartrGithubGroup';
export declare function provisionMembers(scope: Construct, team: Team, fsGithubGroup: FirestartrGithubGroup): void;
