import { Construct } from 'constructs';
import { Entity } from '../base/Entity';
export declare class FirestartrGithubMembership extends Entity {
    constructor(entity: any);
    loadResources(data: {
        scope: Construct;
    }): Promise<void>;
}
