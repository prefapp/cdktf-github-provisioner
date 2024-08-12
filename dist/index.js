"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
const cdktf_1 = require("./src/cdktf");
const features_1 = require("./src/features");
const handlers_1 = require("./src/handlers");
const terraform_1 = require("./src/terraform");
const init_1 = require("./init");
var resource_1 = require("./src/resources/resource");
Object.defineProperty(exports, "Resource", { enumerable: true, get: function () { return resource_1.Resource; } });
exports.default = {
    runCDKTF: cdktf_1.runCDKTF,
    runTerraform: terraform_1.runTerraform,
    getActionByStatus: handlers_1.getActionByStatus,
    getNextStatus: handlers_1.getNextStatus,
    untrackManagedFiles: features_1.untrackManagedFiles,
    runProvisioner: init_1.runProvisioner,
};
