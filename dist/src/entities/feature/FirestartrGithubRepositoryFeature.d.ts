import { Construct } from 'constructs';
import { Entity } from '../base/Entity';
export declare class FirestartrGithubRepositoryFeature extends Entity {
    constructor(artifact: any, deps: any);
    loadResources(data: {
        scope: Construct;
    }): Promise<void>;
}
