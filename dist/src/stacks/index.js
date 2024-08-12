"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStackByEntity = exports.StackNotFoundError = void 0;
const GithubStack_1 = require("./GithubStack");
const TerraformModuleStack_1 = require("./TerraformModuleStack");
class StackNotFoundError extends Error {
    constructor(kind) {
        super(`Stack not found for kind ${kind}`);
        this.name = 'StackNotFoundError';
    }
}
exports.StackNotFoundError = StackNotFoundError;
function getStackByEntity(entity) {
    switch (entity.kind) {
        case 'FirestartrGithubRepository':
        case 'FirestartrGithubGroup':
        case 'FirestartrGithubMembership':
        case 'FirestartrGithubRepositoryFeature':
            return GithubStack_1.GithubStack;
        case 'FirestartrTerraformModule':
            return TerraformModuleStack_1.TerraformModuleStack;
        default:
            throw new StackNotFoundError(entity.kind);
    }
}
exports.getStackByEntity = getStackByEntity;
