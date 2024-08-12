import { FirestartrTerraformModuleEntity } from "../entities/firestartrterraformmodule/FirestartrTerraformModule";
import { BaseStack } from "./base";
import { TerraformProvider } from "cdktf";
export declare class TerraformModuleStack extends BaseStack {
    provisionEntity(isImport: boolean, entity: FirestartrTerraformModuleEntity, deps: any, tfStatePath: string, orgConfig: any): Promise<void>;
    initProviders(scope: BaseStack, name: string, tfStatePath: string, backendConfig: any, providerConfig: any, deps: any): TerraformProvider;
}
