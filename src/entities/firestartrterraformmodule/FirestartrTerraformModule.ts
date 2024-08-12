import { Construct } from 'constructs';
import { Entity } from '../base/Entity';
import { provisionTFModule } from './auxiliars/terraformModuleHelper';
import { TerraformProvider } from 'cdktf';

export class FirestartrTerraformModuleEntity extends Entity {

    provider: TerraformProvider;

    constructor(artifact: any, provider: TerraformProvider, deps?: any) {
        super(artifact, deps);
        this.provider = provider;
    }

    async loadResources(data: { scope: Construct }): Promise<void> {

        const { scope } = data;

        this.mainResource = await provisionTFModule(scope, this);

    }
}
