import common from '@prefapp/firestartr-catalog_common'
import { spawn } from "child_process"
import * as path from "path"

export async function runCDKTF(entity:any, action: string, deps?: any, isImport?: boolean) {

    // ! If we are into a compiled environmet, the folder must be set to current dir plus /provisioner because everything is on the same file at projects root
    // ? Is there a better way to check compiled env than look for packages directory in path ?
    let workDir = __dirname.split(path.sep).includes('packages') ? path.join(__dirname, '..') : path.join(__dirname, 'provisioner');

    workDir = workDir.split("/dist")[0]

    return new Promise((ok, ko) => {

        const cdktfProcess:any = spawn(

            "cdktf",

            [action, "--log-level", "DEBUG", "--auto-approve"],

            {
              cwd: workDir,
              env: {

                ...process.env,
                PATH: process.env.PATH,
                FIRESTARTR_CDKTF_ENTITY: JSON.stringify(entity),
                FIRESTARTR_CDKTF_DEPS: JSON.stringify(deps),
                CATALOG_MAIN_STATE: common.environment.getFromEnvironment(common.types.envVars.catalogMainSate),
                CATALOG_DESIRED_STATE: common.environment.getFromEnvironment(common.types.envVars.catalogDesiredState),
                CATALOG_DELETIONS_STATE: common.environment.getFromEnvironment(common.types.envVars.catalogDeletionsState),
                CDKTF_CONFIG_FILES: common.environment.getFromEnvironment(common.types.envVars.cdktfConfigFiles),
                FIRESTARTR_CDKTF_IS_IMPORT: isImport ? "true" : "false",
                EXCLUSIONS_YAML_PATH: common.environment.getFromEnvironment(common.types.envVars.exclusionsYamlPath),
                FIRESTARTR_CDKTF_ENTITY_KIND: entity.kind,
                GITHUB_APP_ID: common.environment.getFromEnvironment(common.types.envVars.githubAppId),
                GITHUB_APP_INSTALLATION_ID: common.environment.getFromEnvironment(common.types.envVars.githubAppInstallationId),
                GITHUB_APP_INSTALLATION_ID_PREFAPP: common.environment.getFromEnvironment(common.types.envVars.githubAppInstallationIdPrefapp),
                GITHUB_APP_PEM_FILE: common.environment.getFromEnvironment(common.types.envVars.githubAppPemFile),
                S3_BUCKET: common.environment.getFromEnvironment(common.types.envVars.s3Bucket),
                S3_REGION: common.environment.getFromEnvironment(common.types.envVars.s3Region),
                S3_LOCK: common.environment.getFromEnvironment(common.types.envVars.s3Lock),
                AWS_ACCESS_KEY_ID: common.environment.getFromEnvironment(common.types.envVars.awsAccesKey),
                AWS_SECRET_ACCESS_KEY: common.environment.getFromEnvironment(common.types.envVars.awsAccesSecretKey),
                ORG: common.environment.getFromEnvironment(common.types.envVars.org),
                TOKEN: common.environment.getFromEnvironment(common.types.envVars.token),
                KUBERNETES_SERVICE_HOST: common.environment.getFromEnvironment(common.types.envVars.kubernetesServiceHost),
                KUBERNETES_SERVICE_PORT: common.environment.getFromEnvironment(common.types.envVars.kubernetesServicePort),
                CDKTF_LOG_LEVEL: "OFF",
                FORCE_COLOR: "0",
                DEBUG: process.env.DEBUG,
                DEBUG_DEPTH: "0"
              }
            }
        )

        let output = ''

        cdktfProcess.stdout.on("data", (log:any) => {

            output += common.io.stripAnsi(log.toString())

        })

        cdktfProcess.stderr.on("data", (log:any) => {

            output += common.io.stripAnsi(log.toString())
        })

        cdktfProcess.on("exit", async(code:any) => {

            if(code !== 0){

                ko({mainCommand: action, output})

            } else {

                ok({mainCommand: action, output})

            }

        })
    })
  }
