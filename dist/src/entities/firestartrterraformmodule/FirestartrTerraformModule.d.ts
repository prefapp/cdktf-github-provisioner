import { Construct } from 'constructs';
import { Entity } from '../base/Entity';
import { TerraformProvider } from 'cdktf';
export declare class FirestartrTerraformModuleEntity extends Entity {
    provider: TerraformProvider;
    constructor(artifact: any, provider: TerraformProvider, deps?: any);
    loadResources(data: {
        scope: Construct;
    }): Promise<void>;
}
