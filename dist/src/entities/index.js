"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntityInstance = void 0;
const FirestartrGithubRepository_1 = require("./firestartrgithubrepository/FirestartrGithubRepository");
const FirestartrGithubRepositoryFeature_1 = require("./feature/FirestartrGithubRepositoryFeature");
const FirestartrGithubMembership_1 = require("./firestartrgithubmembership/FirestartrGithubMembership");
const FirestartrGithubGroup_1 = require("./firestartrgithubgroup/FirestartrGithubGroup");
const FirestartrTerraformModule_1 = require("./firestartrterraformmodule/FirestartrTerraformModule");
function getEntityInstance(entity, deps) {
    let instance = null;
    switch (entity.kind) {
        case 'FirestartrGithubRepository':
            instance = new FirestartrGithubRepository_1.FirestartrGithubRepository(entity, deps);
            break;
        case 'FirestartrGithubGroup':
            instance = new FirestartrGithubGroup_1.FirestartrGithubGroup(entity, deps);
            break;
        case 'FirestartrGithubMembership':
            instance = new FirestartrGithubMembership_1.FirestartrGithubMembership(entity);
            break;
        case 'FirestartrGithubRepositoryFeature':
            instance = new FirestartrGithubRepositoryFeature_1.FirestartrGithubRepositoryFeature(entity, deps);
            break;
        case 'FirestartrTerraformModule':
            instance = new FirestartrTerraformModule_1.FirestartrTerraformModuleEntity(entity, deps);
            break;
        default:
            break;
    }
    return instance;
}
exports.getEntityInstance = getEntityInstance;
