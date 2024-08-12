"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestartrGithubMembership = void 0;
const Entity_1 = require("../base/Entity");
const MembershipHelper_1 = require("./helpers/MembershipHelper");
class FirestartrGithubMembership extends Entity_1.Entity {
    constructor(entity) {
        super(entity);
    }
    async loadResources(data) {
        const { scope } = data;
        this.mainResource = (0, MembershipHelper_1.provisionMembership)(scope, this);
    }
}
exports.FirestartrGithubMembership = FirestartrGithubMembership;
