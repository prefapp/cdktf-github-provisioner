import { TerraformStack } from "cdktf";
import { GithubStack } from "./GithubStack";
import { TerraformModuleStack } from "./TerraformModuleStack";
import { BaseStack } from "./base";
import { Construct } from "constructs";

export class StackNotFoundError extends Error {
    constructor(kind: string) {
        super(`Stack not found for kind ${kind}`);
        this.name = 'StackNotFoundError';
    }
}

export function getStackByEntity(
    entity: any
): new (
    // This is done like this so we can return a type that extends an abstract class
    // and we can still create a new instance of it
    app: Construct, tfStatePath: string
) => BaseStack {

    switch (entity.kind) {
        case 'FirestartrGithubRepository':
        case 'FirestartrGithubGroup':
        case 'FirestartrGithubMembership':
        case 'FirestartrGithubRepositoryFeature':
            return GithubStack;
        case 'FirestartrTerraformModule':
            return TerraformModuleStack;
        default:
            throw new StackNotFoundError(entity.kind);
    }

}
