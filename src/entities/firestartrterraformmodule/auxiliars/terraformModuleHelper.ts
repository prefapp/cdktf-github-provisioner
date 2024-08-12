import { Construct } from "constructs";
import { FirestartrTerraformModuleEntity } from "../FirestartrTerraformModule";
import { TerraformModule } from "cdktf";
import common from '@prefapp/firestartr-catalog_common';


export class GenericTerraformModule extends TerraformModule {
    private readonly inputs: { [name: string]: any } = {}
    public constructor(scope: Construct, name: string, inputs: any, source: string) {
        super(scope, name, {
            source: source
        });
        this.inputs = inputs;
    }

    public getOutput(name: string): any {
        return this.getString(name);
    }

    public getInput(name: string): any {
        return this.inputs[name];
    }

    protected synthesizeAttributes() {
        return this.inputs;
    }
}


export async function provisionTFModule(scope: Construct, fsGithubTFModule: FirestartrTerraformModuleEntity): Promise<TerraformModule> {

    const tfStateKey = `_${fsGithubTFModule.getTfStateKey()}`

    const { tf_module, values } = fsGithubTFModule.spec;

    const source = `git::https://${tf_module.repo}.git//modules/${tf_module.name}?ref=${tf_module.version}`;

    const module = new GenericTerraformModule(
        scope,
        tf_module.name,
        common.generic.transformKeysToCamelCase(JSON.parse(values)),
        source
    )

    module.addProvider(fsGithubTFModule.provider)

    return module

}
