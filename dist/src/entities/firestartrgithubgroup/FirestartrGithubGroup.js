"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestartrGithubGroup = void 0;
const Entity_1 = require("../base/Entity");
const TeamsHelper_1 = require("./helpers/TeamsHelper");
const TeamMembersHelper_1 = require("./helpers/TeamMembersHelper");
class FirestartrGithubGroup extends Entity_1.Entity {
    constructor(artifact, deps) {
        super(artifact, deps);
    }
    async loadResources(data) {
        const { scope } = data;
        this.mainResource = (0, TeamsHelper_1.provisionGroup)(scope, this);
        (0, TeamMembersHelper_1.provisionMembers)(scope, this.mainResource, this);
    }
}
exports.FirestartrGithubGroup = FirestartrGithubGroup;
