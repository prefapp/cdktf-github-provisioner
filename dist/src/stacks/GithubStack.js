"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubStack = void 0;
const provider_1 = require("@cdktf/provider-github/lib/provider");
const entities_1 = require("../entities");
const debug_1 = __importDefault(require("debug"));
const base_1 = require("./base");
const catalog_common_1 = __importDefault(require("catalog_common"));
const providers_1 = require("../providers");
const messageLog = (0, debug_1.default)('firestartr:provisioner:stacks:githubstack');
class GithubStack extends base_1.BaseStack {
    async provisionEntity(isImport, entity, deps, tfStatePath, orgConfig) {
        try {
            const { backendConfig, providerConfig } = this.getRefContextConfigs(entity, deps);
            this.initProviders(this, tfStatePath, backendConfig, providerConfig, deps);
            const instance = (0, entities_1.getEntityInstance)(entity, deps);
            await instance.provision({ scope: this });
            if (isImport) {
                instance.importResources();
            }
        }
        catch (err) {
            messageLog("Error: provisionEntity: %s", err);
            throw err;
        }
    }
    initProviders(scope, tfStatePath, backendConfig, providerConfig, deps) {
        if (providerConfig.spec.type != providers_1.FirestartrTerraformProvider.GITHUB)
            throw `Provider type ${providerConfig.spec.type} is not supported`;
        const backendSecrets = this.getRefContextFromCr(backendConfig, deps);
        const providerSecrets = this.getRefContextFromCr(providerConfig, deps);
        const backendConfigData = this.replaceConfigSecrets(JSON.parse(backendConfig.spec.config), backendSecrets);
        const providerConfigData = this.replaceConfigSecrets(JSON.parse(providerConfig.spec.config), providerSecrets);
        (0, providers_1.createBackend)(scope, backendConfig.spec.type, tfStatePath, backendConfigData);
        return new provider_1.GithubProvider(scope, tfStatePath, catalog_common_1.default.generic.transformKeysToCamelCase(providerConfigData));
    }
}
exports.GithubStack = GithubStack;
