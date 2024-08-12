"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestartrGithubRepositoryFeature = void 0;
const provisioner_1 = require("../../features/provisioner");
const Entity_1 = require("../base/Entity");
class FirestartrGithubRepositoryFeature extends Entity_1.Entity {
    constructor(artifact, deps) {
        super(artifact, deps);
    }
    async loadResources(data) {
        const { scope } = data;
        (0, provisioner_1.provisionFeatureFiles)(scope, this);
    }
}
exports.FirestartrGithubRepositoryFeature = FirestartrGithubRepositoryFeature;
