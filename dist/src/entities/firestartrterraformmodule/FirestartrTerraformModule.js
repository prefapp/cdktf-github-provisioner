"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestartrTerraformModuleEntity = void 0;
const Entity_1 = require("../base/Entity");
const terraformModuleHelper_1 = require("./auxiliars/terraformModuleHelper");
class FirestartrTerraformModuleEntity extends Entity_1.Entity {
    provider;
    constructor(artifact, provider, deps) {
        super(artifact, deps);
        this.provider = provider;
    }
    async loadResources(data) {
        const { scope } = data;
        this.mainResource = await (0, terraformModuleHelper_1.provisionTFModule)(scope, this);
    }
}
exports.FirestartrTerraformModuleEntity = FirestartrTerraformModuleEntity;
