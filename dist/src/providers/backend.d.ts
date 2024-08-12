import { FirestartrTerraformBackendProvider } from ".";
export declare class BackendError extends Error {
    backend: FirestartrTerraformBackendProvider;
    constructor(backend: FirestartrTerraformBackendProvider);
}
export declare function createBackend(scope: any, provider: FirestartrTerraformBackendProvider, tfStateKey: string, config: any): void;
