"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.provisionGroup = void 0;
const team_1 = require("@cdktf/provider-github/lib/team");
const debug_1 = __importDefault(require("debug"));
// import { TeamConfigAux } from '../auxiliars/TeamConfigAux';
const messageLog = (0, debug_1.default)('firestartr:provisioner:entities:component:helpers:repositoryhelper');
function provisionGroup(scope, fsGithubGroup) {
    messageLog(`provisionGroup with name ${fsGithubGroup.metadata.name} in org ${fsGithubGroup.spec.org}`);
    const config = {
        name: fsGithubGroup.metadata.name,
        description: fsGithubGroup.spec.description,
        privacy: fsGithubGroup.spec.privacy,
    };
    const tfStateKey = `_${fsGithubGroup.getTfStateKey()}`;
    const group = new team_1.Team(scope, tfStateKey, config);
    fsGithubGroup.addResourceToStack(fsGithubGroup.metadata.name, group);
    return group;
}
exports.provisionGroup = provisionGroup;
