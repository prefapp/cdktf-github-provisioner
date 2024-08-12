import { RepositoryConfigAux } from '../entities/firestartrgithubrepository/auxiliars/RepositoryConfigAux';
import { Repository } from '@cdktf/provider-github/lib/repository';
import * as fs from 'fs';
import common from 'catalog_common';
import gh from 'github'
import Debug from "debug";

const messageLog = Debug('firestartr:provisioner:config')

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
export async function orgHasOneOfThesePlans(org: string, plans: string[]): Promise<boolean> {

  try {

    if (plans.some(plan => !VALID_PLANS.has(plan))) {

      throw `One or more plans in the input are not valid.`;

    }

    const accountSubscriptionPlan = await getAccountPlan(org);

    if(plans.includes(accountSubscriptionPlan)) {

      return true;

    }

    return false;

  } catch (error) {

    throw `Error: accountHasSubscriptionPlan ${error}`;

  }

}


/**
 * @description Get the plan from the config file
 * @returns string
 */
async function getAccountPlan(org: string) {

  try {

    return  gh.org.getOrgPlanName(org);

  } catch(e: any){

    throw `getPlanFromConfig ${e}`

  }
}
