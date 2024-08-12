import { TerraformProvider, TerraformStack } from "cdktf";
import common from '@prefapp/firestartr-catalog_common';

export class SecretNotFound extends Error {
    constructor(secretName: string) {
        super(`Secret ${secretName} not found`);
        this.name = "SecretNotFound";
    }
}

export class SecretKeyNotFound extends Error {
    constructor(secretName: string, keyName: string) {
        super(`Secret ${secretName} does not have key ${keyName}`);
        this.name = "SecretKeyNotFound";
    }
}

export abstract class BaseStack extends TerraformStack {

    abstract provisionEntity(isImport: boolean, entity: any, deps: any, tfStatePath: string, orgConfig: any): Promise<void>;

    abstract initProviders(scope: any, name: string, tfStatePath: string, backend: any, provider: any, deps: any): TerraformProvider;

    protected getRefContextConfigs(entity: any, deps: any) {

        const backendRef = entity.spec.context.backend.ref

        if (deps[`${backendRef.kind}-${backendRef.name}`] === undefined) console.error(`Could not find backend ${backendRef.kind}-${backendRef.name}`)

        const backendConfig = deps[`${backendRef.kind}-${backendRef.name}`].cr

        const providerRef = entity.spec.context.provider.ref

        if (deps[`${providerRef.kind}-${providerRef.name}`] === undefined) console.error(`Could not find provider ${providerRef.kind}-${providerRef.name}`)

        const providerConfig = deps[`${providerRef.kind}-${providerRef.name}`].cr

        return {
            backendConfig,
            providerConfig
        }

    }

    protected getRefContextFromCr(cr: any, deps: any) {
        const secrets: any = {}

        // check first there are any secrets to resolve
        if (cr.spec.secrets === undefined) return secrets;

        for (const i of Object.entries(cr.spec.secrets)) {

            const [objectKey, value]: [string, any] = i;

            const { key, name } = value.secretRef;

            const secretDepKeyName = `Secret-${name}`;
            const secret: any = deps[secretDepKeyName as keyof typeof deps];

            if (secret.cr.data[key] === undefined) throw new SecretKeyNotFound(name, key);

            secrets[objectKey] = Buffer.from(secret.cr.data[key], 'base64')

        }

        return secrets;
    }

    protected replaceConfigSecrets(config: any, secrets: any) {
        for (let key in config) {
            if (typeof config[key] === 'object' && config[key] !== null) {
                // If the property is an object, call this function recursively
                this.replaceConfigSecrets(config[key], secrets);
            } else if (typeof config[key] === 'string') {
                // If the property is a string and its value is equal to secrets.something,
                // replace the value with the value of the 'something' key in the secrets object
                config[key] = config[key].replace(/\$\{\{ secrets\.(.*?) \}\}/g, function (_: any, group1: string) {
                    if (!secrets[group1]) {
                        throw new SecretNotFound(group1);
                    }
                    return secrets[group1];
                });
            }
        }
        return config;
    }

}
