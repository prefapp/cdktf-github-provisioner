"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProvider = exports.createBackend = exports.FirestartrTerraformProvider = exports.FirestartrTerraformBackendProvider = void 0;
var FirestartrTerraformBackendProvider;
(function (FirestartrTerraformBackendProvider) {
    FirestartrTerraformBackendProvider["AWS"] = "aws";
    FirestartrTerraformBackendProvider["AZURERM"] = "azurerm";
    FirestartrTerraformBackendProvider["KUBERNETES"] = "kubernetes";
})(FirestartrTerraformBackendProvider = exports.FirestartrTerraformBackendProvider || (exports.FirestartrTerraformBackendProvider = {}));
var FirestartrTerraformProvider;
(function (FirestartrTerraformProvider) {
    FirestartrTerraformProvider["AWS"] = "aws";
    FirestartrTerraformProvider["AZURERM"] = "azurerm";
    FirestartrTerraformProvider["GITHUB"] = "github";
})(FirestartrTerraformProvider = exports.FirestartrTerraformProvider || (exports.FirestartrTerraformProvider = {}));
var backend_1 = require("./backend");
Object.defineProperty(exports, "createBackend", { enumerable: true, get: function () { return backend_1.createBackend; } });
var provider_1 = require("./provider");
Object.defineProperty(exports, "createProvider", { enumerable: true, get: function () { return provider_1.createProvider; } });
