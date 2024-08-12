import { Construct } from "constructs";
import { TerraformProvider } from "cdktf";
import { FirestartrTerraformProvider } from ".";
export declare function createProvider(scope: Construct, provider: FirestartrTerraformProvider, id: string, config: any): TerraformProvider;
