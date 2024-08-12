"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProvider = void 0;
const provider_1 = require("@cdktf/provider-github/lib/provider");
const provider_2 = require("@cdktf/provider-aws/lib/provider");
const provider_3 = require("@cdktf/provider-azurerm/lib/provider");
const _1 = require(".");
const catalog_common_1 = __importDefault(require("catalog_common"));
function createProvider(scope, provider, id, config) {
    const updatedConfig = catalog_common_1.default.generic.transformKeysToCamelCase(config);
    switch (provider) {
        case _1.FirestartrTerraformProvider.AWS:
            return new provider_2.AwsProvider(scope, id, updatedConfig);
        case _1.FirestartrTerraformProvider.AZURERM:
            return new provider_3.AzurermProvider(scope, id, {
                ...updatedConfig,
                features: {}
            });
        case _1.FirestartrTerraformProvider.GITHUB:
            return new provider_1.GithubProvider(scope, id, updatedConfig);
        default:
            throw new Error(`Provider ${provider} not supported`);
    }
}
exports.createProvider = createProvider;
