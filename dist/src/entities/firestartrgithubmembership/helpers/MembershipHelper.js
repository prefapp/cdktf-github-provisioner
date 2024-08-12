"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.provisionMembership = void 0;
const membership_1 = require("@cdktf/provider-github/lib/membership");
const debug_1 = __importDefault(require("debug"));
const messageLog = (0, debug_1.default)('firestartr:provisioner:modules:artifacts:userartifact');
function provisionMembership(scope, fsGithubMembership) {
    const tfStateKey = `_${fsGithubMembership.getTfStateKey()}`;
    const membership = new membership_1.Membership(scope, tfStateKey, {
        username: fsGithubMembership.metadata.name,
        role: fsGithubMembership.spec.role,
    });
    fsGithubMembership.addResourceToStack(`${fsGithubMembership.spec.org}:${fsGithubMembership.metadata.name}`, membership);
    return membership;
}
exports.provisionMembership = provisionMembership;
