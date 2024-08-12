import { S3Backend, AzurermBackend } from "cdktf";
import { FirestartrTerraformBackendProvider } from ".";
import common from 'catalog_common';

export class BackendError extends Error {
    backend: FirestartrTerraformBackendProvider;

    constructor(backend: FirestartrTerraformBackendProvider) {
        super(`Backend ${backend} not supported`);
        this.backend = backend;
    }
}

export function createBackend(scope: any, provider: FirestartrTerraformBackendProvider, tfStateKey: string, config: any) {

    const updatedConfig = common.generic.transformKeysToCamelCase(config);

    switch (provider) {

        case FirestartrTerraformBackendProvider.AWS:

            new S3Backend(scope, {
                ...updatedConfig,
                key: tfStateKey
            });

            break;

        case FirestartrTerraformBackendProvider.AZURERM:

            new AzurermBackend(scope, {
                ...updatedConfig,
                key: tfStateKey
            });

            break;

        case FirestartrTerraformBackendProvider.KUBERNETES:

            scope.addOverride("terraform.backend.kubernetes", {
                // In this case we do not need to replace the config keys case
                ...config,
            })

            scope.addOverride("terraform.backend.local", null)

            break;

        default:
            throw new BackendError(provider);
    }
}
