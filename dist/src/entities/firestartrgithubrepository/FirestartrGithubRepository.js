"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestartrGithubRepository = void 0;
const Entity_1 = require("../base/Entity");
const CodeownersHelper_1 = require("./helpers/CodeownersHelper");
const RepositoryTeamsHelper_1 = require("./helpers/RepositoryTeamsHelper");
const RepositoryHelper_1 = require("./helpers/RepositoryHelper");
const config_1 = require("../../config/config");
const ActionsHelper_1 = require("./helpers/ActionsHelper");
const DefaultBranchHelper_1 = require("./helpers/DefaultBranchHelper");
class FirestartrGithubRepository extends Entity_1.Entity {
    constructor(artifact, deps) {
        super(artifact, deps);
    }
    async loadResources(data) {
        const { scope } = data;
        this.mainResource = (0, RepositoryHelper_1.provisionRepository)(scope, this);
        const branchDefault = (0, DefaultBranchHelper_1.provisionDefaultBranch)(scope, this, this.mainResource);
        (0, ActionsHelper_1.provisionOIDCSubjectClaim)(scope, this.mainResource, this);
        if (await this.orgHasOneOfThesePlans(this.spec.org, ["team", "enterprise"])) {
            (0, RepositoryHelper_1.provisionBranchProtections)(scope, this.mainResource, this);
        }
        (0, CodeownersHelper_1.provisionCodeowners)(scope, this.mainResource, branchDefault, this);
        (0, RepositoryTeamsHelper_1.provisionPermissions)(scope, this.mainResource, this);
    }
    async orgHasOneOfThesePlans(org, plans) {
        return (0, config_1.orgHasOneOfThesePlans)(org, plans);
    }
}
exports.FirestartrGithubRepository = FirestartrGithubRepository;
