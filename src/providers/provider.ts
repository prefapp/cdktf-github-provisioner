import { Construct } from "constructs";
import { TerraformProvider } from "cdktf";
import { GithubProvider } from '@cdktf/provider-github/lib/provider';
import { AwsProvider } from '@cdktf/provider-aws/lib/provider';
import { AzurermProvider } from '@cdktf/provider-azurerm/lib/provider';
import { FirestartrTerraformProvider } from ".";
import common from 'catalog_common';

export function createProvider(scope: Construct, provider: FirestartrTerraformProvider, id: string, config: any): TerraformProvider {

    const updatedConfig = common.generic.transformKeysToCamelCase(config);

    switch (provider) {
        case FirestartrTerraformProvider.AWS:
            return new AwsProvider(scope, id, updatedConfig);
        case FirestartrTerraformProvider.AZURERM:
            return new AzurermProvider(scope, id, {
                ...updatedConfig,
                features: {}
            });
        case FirestartrTerraformProvider.GITHUB:
            return new GithubProvider(scope, id, updatedConfig);
        default:
            throw new Error(`Provider ${provider} not supported`);
    }
}
