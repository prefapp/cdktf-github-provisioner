import { FirestartrGithubMembership } from "../FirestartrGithubMembership";
import { Construct } from "constructs";
import { Membership } from '@cdktf/provider-github/lib/membership';
import Debug from "debug"

const messageLog = Debug(
    'firestartr:provisioner:modules:artifacts:userartifact'
)

export function provisionMembership(scope: Construct, fsGithubMembership: FirestartrGithubMembership) {

    const tfStateKey = `_${fsGithubMembership.getTfStateKey()}`

    const membership = new Membership(scope, tfStateKey, {

        username: fsGithubMembership.metadata.name,

        role: fsGithubMembership.spec.role,

    });

    fsGithubMembership.addResourceToStack(

        `${fsGithubMembership.spec.org}:${fsGithubMembership.metadata.name}`,

        membership
    );

    return membership;
}
