export enum FirestartrTerraformBackendProvider {
    AWS = "aws",
    AZURERM = "azurerm",
    KUBERNETES = "kubernetes",
}

export enum FirestartrTerraformProvider {
    AWS = "aws",
    AZURERM = "azurerm",
    GITHUB = "github",
}

export { createBackend } from './backend';
export { createProvider } from './provider';
