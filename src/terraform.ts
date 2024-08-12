import common from "catalog_common"
import { spawn } from "child_process"
import * as path from "path"
import Debug from "debug"
import { createInterface } from "node:readline"

const messageLog = Debug("firestartr:provisioner:terraform")

export async function runTerraform(entity: any, command: Array<string>) {

    // ! If we are into a compiled environmet, the folder must be set to current dir plus /provisioner because everything is on the same file at projects root
    // ? Is there a better way to check compiled env than look for packages directory in path ?
    let workDir = __dirname.split(path.sep).includes('packages') ? path.join(__dirname, '..') : path.join(__dirname, 'provisioner');

    workDir = workDir.split("/dist")[0]

    workDir = path.join(workDir, 'cdktf.out', 'stacks', `${entity.kind.toLowerCase()}--${entity['spec']['firestartr']['tfStateKey']}`)

    messageLog(`Running terraform with command ${command} in ${workDir}`)

    return new Promise((ok, ko) => {

        const terraformProcess:any = spawn(

            "terraform",

            [...command],

            {
              cwd: workDir,

              env: {

                PATH: process.env.PATH,

                FIRESTARTR_CDKTF_ENTITY_NAME: entity.metadata.name,

                CATALOG_MAIN_STATE: common.environment.getFromEnvironment(common.types.envVars.catalogMainSate),

                CATALOG_DESIRED_STATE: common.environment.getFromEnvironment(common.types.envVars.catalogDesiredState),

                CATALOG_DELETIONS_STATE: common.environment.getFromEnvironment(common.types.envVars.catalogDeletionsState),

                CDKTF_CONFIG_FILES: common.environment.getFromEnvironment(common.types.envVars.cdktfConfigFiles),

                EXCLUSIONS_YAML_PATH: common.environment.getFromEnvironment(common.types.envVars.exclusionsYamlPath),

                FIRESTARTR_CDKTF_ENTITY_KIND: entity.kind,

                GITHUB_APP_ID: common.environment.getFromEnvironment(common.types.envVars.githubAppId),

                GITHUB_APP_INSTALLATION_ID: common.environment.getFromEnvironment(common.types.envVars.githubAppInstallationId),

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

                CDKTF_LOG_LEVEL: "DEBUG",
              }
            }
        )

        let output = ''

        terraformProcess.stdout.on("data", (log: any) => {

            const line = common.io.stripAnsi(log.toString())

            output += line

            console.log(line)
        })

        terraformProcess.stderr.on("data", (log: any) => {

            const line = common.io.stripAnsi(log.toString())

            output += line

            console.log(line)
        })

        terraformProcess.on("exit", async(code:any) => {

            console.log(`child process exited with code ${code}`)

            if(code !== 0){

                console.log(output)

                ko(output)

            } else {

                ok(output)

            }

        })
    })
  }


export function terraformInit(entity: any) {

  return runTerraform(entity, ["init", "-no-color"])

}

export function terraformPlan(entity: any) {

  return runTerraform(entity, ["plan", "-no-color"])

}

export async function terraformApply(entity: any, isImport: boolean = false, skipPlan: boolean = false) {

  let line: any = false

  if(isImport && !skipPlan) {

    console.log(`

🚀 Are you sure you want to

import and apply changes from entity ${entity.kind} ${entity.metadata.name} ?

Type 'yes' to continue:`

    )

    const reader = createInterface({ input: process.stdin })

    line = await new Promise<string>((resolve) => {

      reader.on('line', (line) => {

        reader.close();

        resolve(line);

      });

    });

  }

  if(line === 'yes' || skipPlan){

    return runTerraform(entity, ["apply", "-no-color", "-auto-approve"])

  } else {

    console.log(`🚀 Skipping apply for entity ${entity.kind} ${entity.metadata.name}`)

    return Promise.resolve("")

  }

}

export function terraformDestroy(entity: any) {

  return runTerraform(entity, ["destroy", "-no-color", "-auto-approve"])

}
