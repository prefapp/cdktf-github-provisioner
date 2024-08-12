"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerraformModuleStack = void 0;
const debug_1 = __importDefault(require("debug"));
const FirestartrTerraformModule_1 = require("../entities/firestartrterraformmodule/FirestartrTerraformModule");
const base_1 = require("./base");
const providers_1 = require("../providers");
const messageLog = (0, debug_1.default)("firestartr:provisioner:stacks:terraformmodulestack");
class TerraformModuleStack extends base_1.BaseStack {
    async provisionEntity(isImport, entity, deps, tfStatePath, orgConfig) {
        try {
            const { backendConfig, providerConfig } = this.getRefContextConfigs(entity, deps);
            const provider = this.initProviders(this, entity.metadata.name, tfStatePath, backendConfig, providerConfig, deps);
            const instance = new FirestartrTerraformModule_1.FirestartrTerraformModuleEntity(entity, provider, deps);
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
    initProviders(scope, name, tfStatePath, backendConfig, providerConfig, deps) {
        const backendSecrets = this.getRefContextFromCr(backendConfig, deps);
        const providerSecrets = this.getRefContextFromCr(providerConfig, deps);
        const backendConfigData = this.replaceConfigSecrets(JSON.parse(backendConfig.spec.config), backendSecrets);
        const providerConfigData = this.replaceConfigSecrets(JSON.parse(providerConfig.spec.config), providerSecrets);
        (0, providers_1.createBackend)(scope, backendConfig.spec.type, tfStatePath, backendConfigData);
        return (0, providers_1.createProvider)(scope, providerConfig.spec.type, name, providerConfigData);
    }
}
exports.TerraformModuleStack = TerraformModuleStack;
