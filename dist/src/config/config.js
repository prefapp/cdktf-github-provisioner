"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orgHasOneOfThesePlans = void 0;
const github_1 = __importDefault(require("github"));
const debug_1 = __importDefault(require("debug"));
const messageLog = (0, debug_1.default)('firestartr:provisioner:config');
/**
 * @description Valid plans for the account
 * @type {Set<string>}
 */
const VALID_PLANS = new Set(["free", "team", "enterprise"]);
/**
 * @description Check if the account has one of the plans in the input
 * @param plans
 * @returns boolean
 */
async function orgHasOneOfThesePlans(org, plans) {
    try {
        if (plans.some(plan => !VALID_PLANS.has(plan))) {
            throw `One or more plans in the input are not valid.`;
        }
        const accountSubscriptionPlan = await getAccountPlan(org);
        if (plans.includes(accountSubscriptionPlan)) {
            return true;
        }
        return false;
    }
    catch (error) {
        throw `Error: accountHasSubscriptionPlan ${error}`;
    }
}
exports.orgHasOneOfThesePlans = orgHasOneOfThesePlans;
/**
 * @description Get the plan from the config file
 * @returns string
 */
async function getAccountPlan(org) {
    try {
        return github_1.default.org.getOrgPlanName(org);
    }
    catch (e) {
        throw `getPlanFromConfig ${e}`;
    }
}
