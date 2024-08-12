"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBackend = exports.BackendError = void 0;
const cdktf_1 = require("cdktf");
const _1 = require(".");
const catalog_common_1 = __importDefault(require("catalog_common"));
class BackendError extends Error {
    backend;
    constructor(backend) {
        super(`Backend ${backend} not supported`);
        this.backend = backend;
    }
}
exports.BackendError = BackendError;
function createBackend(scope, provider, tfStateKey, config) {
    const updatedConfig = catalog_common_1.default.generic.transformKeysToCamelCase(config);
    switch (provider) {
        case _1.FirestartrTerraformBackendProvider.AWS:
            new cdktf_1.S3Backend(scope, {
                ...updatedConfig,
                key: tfStateKey
            });
            break;
        case _1.FirestartrTerraformBackendProvider.AZURERM:
            new cdktf_1.AzurermBackend(scope, {
                ...updatedConfig,
                key: tfStateKey
            });
            break;
        case _1.FirestartrTerraformBackendProvider.KUBERNETES:
            scope.addOverride("terraform.backend.kubernetes", {
                // In this case we do not need to replace the config keys case
                ...config,
            });
            scope.addOverride("terraform.backend.local", null);
            break;
        default:
            throw new BackendError(provider);
    }
}
exports.createBackend = createBackend;
