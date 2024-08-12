import { Construct } from "constructs";
import { FirestartrTerraformModuleEntity } from "../FirestartrTerraformModule";
import { TerraformModule } from "cdktf";
export declare class GenericTerraformModule extends TerraformModule {
    private readonly inputs;
    constructor(scope: Construct, name: string, inputs: any, source: string);
    getOutput(name: string): any;
    getInput(name: string): any;
    protected synthesizeAttributes(): {
        [name: string]: any;
    };
}
export declare function provisionTFModule(scope: Construct, fsGithubTFModule: FirestartrTerraformModuleEntity): Promise<TerraformModule>;
