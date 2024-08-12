
import common from '@prefapp/firestartr-catalog_common'
import {App } from 'cdktf';
import {loadEntity} from "./src/loader"
import Debug from "debug"

const messageLog = Debug('firestartr:provisioner:main')

export async function deploy(app:App){

  const entity:any = JSON.parse(common.environment.getFromEnvironment(common.types.envVars.cdktfEntity) as string)

  const deps: any = JSON.parse(common.environment.getFromEnvironment(common.types.envVars.cdktfDeps) as string)

  const isImport = common.environment.getFromEnvironmentAsBoolean(common.types.envVars.cdktfIsImport) as boolean

  messageLog("Entity to provision: %O", entity)

  const orgConfig: any = {
    bucket: common.environment.getFromEnvironment(common.types.envVars.s3Bucket) as string,
    dynamodbTable: common.environment.getFromEnvironment(common.types.envVars.s3Lock) as string,
    region: common.environment.getFromEnvironment(common.types.envVars.s3Region) as string,
    org: common.environment.getFromEnvironment(common.types.envVars.org) as string,
    githubAppId: common.environment.getFromEnvironment(common.types.envVars.githubAppId) as string,
    githubAppInstallationId: common.environment.getFromEnvironment(common.types.envVars.githubAppInstallationId) as string,
    githubAppPemFile: common.environment.getFromEnvironment(common.types.envVars.githubAppPemFile) as string,
    awsAccesKey: common.environment.getFromEnvironment(common.types.envVars.awsAccesKey) as string,
    awsAccesSecretKey: common.environment.getFromEnvironment(common.types.envVars.awsAccesSecretKey) as string,
    token: common.environment.getFromEnvironment(common.types.envVars.token) as string,
  }

  await loadEntity(isImport, entity, deps, app, orgConfig)

  try
  {

    app.synth()

  } catch(e: any){

    messageLog("Error: deploy: %s", e)

    throw e

  }

}

deploy(new App())
