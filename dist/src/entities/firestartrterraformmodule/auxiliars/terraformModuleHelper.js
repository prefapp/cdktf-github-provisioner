"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.provisionTFModule = exports.GenericTerraformModule = void 0;
const cdktf_1 = require("cdktf");
const catalog_common_1 = __importDefault(require("catalog_common"));
class GenericTerraformModule extends cdktf_1.TerraformModule {
    inputs = {};
    constructor(scope, name, inputs, source) {
        super(scope, name, {
            source: source
        });
        this.inputs = inputs;
    }
    getOutput(name) {
        return this.getString(name);
    }
    getInput(name) {
        return this.inputs[name];
    }
    synthesizeAttributes() {
        return this.inputs;
    }
}
exports.GenericTerraformModule = GenericTerraformModule;
async function provisionTFModule(scope, fsGithubTFModule) {
    const tfStateKey = `_${fsGithubTFModule.getTfStateKey()}`;
    const { tf_module, values } = fsGithubTFModule.spec;
    const source = `git::https://${tf_module.repo}.git//modules/${tf_module.name}?ref=${tf_module.version}`;
    const module = new GenericTerraformModule(scope, tf_module.name, catalog_common_1.default.generic.transformKeysToCamelCase(JSON.parse(values)), source);
    module.addProvider(fsGithubTFModule.provider);
    return module;
}
exports.provisionTFModule = provisionTFModule;
