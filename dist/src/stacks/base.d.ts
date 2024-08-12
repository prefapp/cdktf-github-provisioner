import { TerraformProvider, TerraformStack } from "cdktf";
export declare class SecretNotFound extends Error {
    constructor(secretName: string);
}
export declare class SecretKeyNotFound extends Error {
    constructor(secretName: string, keyName: string);
}
export declare abstract class BaseStack extends TerraformStack {
    abstract provisionEntity(isImport: boolean, entity: any, deps: any, tfStatePath: string, orgConfig: any): Promise<void>;
    abstract initProviders(scope: any, name: string, tfStatePath: string, backend: any, provider: any, deps: any): TerraformProvider;
    protected getRefContextConfigs(entity: any, deps: any): {
        backendConfig: any;
        providerConfig: any;
    };
    protected getRefContextFromCr(cr: any, deps: any): any;
    protected replaceConfigSecrets(config: any, secrets: any): any;
}
