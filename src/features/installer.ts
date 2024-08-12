import common from "catalog_common"
import Debug from "debug"
import * as fs from "fs"
import github from "github"

const messageLog = Debug('firestartr:provisioner:features:installer')

export async function installFeaturesForComponent(component:any, store:any){

  const componentFeatures: any[] = component.spec?.provisioner?.features || '[]'

  const componentFeaturesToInstall: any[] = componentFeatures.filter(
    (feature: any) => {
      return feature.status.value === common.types.FeatureStatuses.pendingInstallStatus;
    }
  );

  if(componentFeaturesToInstall.length > 0){

    for(const feature of componentFeaturesToInstall){

      messageLog(
        "Installing feature %s for component %s",
        feature.name, component.metadata.name
      );

      // Get feature config
      const featureConfig: any = common.features.features.getFeatureRenderedConfigForComponent(
        component, feature.name,
      )

      // prepare files
      await prepareFilesForInstalling(feature.name, component, featureConfig.files)

      // Apply patch
      for(const patch of featureConfig.patches)
        store.actions.components.patch(component, patch)

      // Mark as installed
      store.actions.components.featureInstalled(component, feature.name, feature.version)

    }

  } else {

    messageLog(
      `No features to install for component ${component.metadata.name}`
    );

  }

  return store

}

async function prepareFilesForInstalling(
  featureName: string,
  component:any,
  featureConfigFiles:Array<any>){

  for(const file of featureConfigFiles){

    if(isFreshInstallation(featureName, component) && file.userManaged){

      await prepareUserManagedFileForInstalling(component, file)

    }

  }

}

async function prepareUserManagedFileForInstalling(component: any, file: any){

  // check if the file already exists
  const fileContent:boolean|string = await getFileContentFromGithubIfExists(

    file.repoPath,

    component.metadata.name,

    component.spec.provisioner.org

  )

  // if exists get the content
  if(fileContent){

    // write down the content of the file such as it exists in the repo
    updateFileContent(

      file.localPath,

      fileContent

    )
  }


}

async function getFileContentFromGithubIfExists(
  path: string,
  repositoryName: string,
  owner: string,
){

  try{

    const  fileContent = await github.repo.getContent(path, repositoryName, owner)

    return fileContent

  } catch(e: any){

    if(e.status === 404){

      messageLog(`File ${path} not found in ${repositoryName}`)

      return false

    }

    throw e
  }

}


function updateFileContent(fileSrc: string, fileContent: string){

  fs.writeFileSync(fileSrc, fileContent)

}


function isFreshInstallation(featureName: any, component: any){

  if(component["metadata"]["annotations"]['fire-starter.dev/features-to-install']){

    const featuresToInstall = JSON.parse(component["metadata"]["annotations"]['fire-starter.dev/features-to-install'])

    const featureToInstall = featuresToInstall.find((feature:any) => feature["name"] === featureName)

    if(featureToInstall){

      return true
    }

  }

  return false

}
