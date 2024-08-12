import common from "catalog_common"
import Debug from "debug"
import * as fs from "fs"
import * as path from "path"
import { runCDKTF } from "../cdktf";
import { FirestartrGithubRepositoryFeature } from "../entities/feature/FirestartrGithubRepositoryFeature";
import { runTerraform } from "../terraform";

const messageLog = Debug('firestartr:provisioner:features:uninstaller')


export async function untrackManagedFiles(feature: any, deps: any){

  if(!feature.spec.files || feature.spec.files.length < 1) return

  messageLog(`Removing managed files from the Terraform State`)

  messageLog(`Synthing the project...`)

  await runCDKTF(feature, "synth", deps)

  await runTerraform(

    feature,

    ['init']

  )

  for(const file of feature.spec.files.filter((file:any) => file.userManaged === true)){

    messageLog(`Removing from the state file ${file.path}`)

    // Terraform replaces / with -- and . with - in the state file names, so we do the same to get the state file name
    let stateFileName = `${feature.spec.type}-${file.path}`.replace(/\//g, '--').replace(/\./g, '')

    await runTerraform(

      feature,

      ['state', 'rm', `github_repository_file.${stateFileName}`]
    )

  }

  // messageLog(`Removing the files from the state`)

  // let workDir = __dirname.split(path.sep).includes('packages') ? path.join(__dirname, '..', '..') : path.join(__dirname, 'provisioner');

  // workDir = path.join(workDir, 'cdktf.out')

  // fs.rmSync(workDir, {recursive: true})

}
