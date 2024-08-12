"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseStack = exports.SecretKeyNotFound = exports.SecretNotFound = void 0;
const cdktf_1 = require("cdktf");
class SecretNotFound extends Error {
    constructor(secretName) {
        super(`Secret ${secretName} not found`);
        this.name = "SecretNotFound";
    }
}
exports.SecretNotFound = SecretNotFound;
class SecretKeyNotFound extends Error {
    constructor(secretName, keyName) {
        super(`Secret ${secretName} does not have key ${keyName}`);
        this.name = "SecretKeyNotFound";
    }
}
exports.SecretKeyNotFound = SecretKeyNotFound;
class BaseStack extends cdktf_1.TerraformStack {
    getRefContextConfigs(entity, deps) {
        const backendRef = entity.spec.context.backend.ref;
        if (deps[`${backendRef.kind}-${backendRef.name}`] === undefined)
            console.error(`Could not find backend ${backendRef.kind}-${backendRef.name}`);
        const backendConfig = deps[`${backendRef.kind}-${backendRef.name}`].cr;
        const providerRef = entity.spec.context.provider.ref;
        if (deps[`${providerRef.kind}-${providerRef.name}`] === undefined)
            console.error(`Could not find provider ${providerRef.kind}-${providerRef.name}`);
        const providerConfig = deps[`${providerRef.kind}-${providerRef.name}`].cr;
        return {
            backendConfig,
            providerConfig
        };
    }
    getRefContextFromCr(cr, deps) {
        const secrets = {};
        // check first there are any secrets to resolve
        if (cr.spec.secrets === undefined)
            return secrets;
        for (const i of Object.entries(cr.spec.secrets)) {
            const [objectKey, value] = i;
            const { key, name } = value.secretRef;
            const secretDepKeyName = `Secret-${name}`;
            const secret = deps[secretDepKeyName];
            if (secret.cr.data[key] === undefined)
                throw new SecretKeyNotFound(name, key);
            secrets[objectKey] = Buffer.from(secret.cr.data[key], 'base64');
        }
        return secrets;
    }
    replaceConfigSecrets(config, secrets) {
        for (let key in config) {
            if (typeof config[key] === 'object' && config[key] !== null) {
                // If the property is an object, call this function recursively
                this.replaceConfigSecrets(config[key], secrets);
            }
            else if (typeof config[key] === 'string') {
                // If the property is a string and its value is equal to secrets.something,
                // replace the value with the value of the 'something' key in the secrets object
                config[key] = config[key].replace(/\$\{\{ secrets\.(.*?) \}\}/g, function (_, group1) {
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
exports.BaseStack = BaseStack;
