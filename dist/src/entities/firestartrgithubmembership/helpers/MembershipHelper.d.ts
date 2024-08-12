import { FirestartrGithubMembership } from "../FirestartrGithubMembership";
import { Construct } from "constructs";
import { Membership } from '@cdktf/provider-github/lib/membership';
export declare function provisionMembership(scope: Construct, fsGithubMembership: FirestartrGithubMembership): Membership;
