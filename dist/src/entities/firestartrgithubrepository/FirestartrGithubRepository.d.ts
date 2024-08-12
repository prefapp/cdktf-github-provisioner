import { Construct } from 'constructs';
import { Entity } from '../base/Entity';
export declare class FirestartrGithubRepository extends Entity {
    constructor(artifact: any, deps: any);
    loadResources(data: {
        scope: Construct;
    }): Promise<void>;
    orgHasOneOfThesePlans(org: string, plans: string[]): Promise<boolean>;
}
