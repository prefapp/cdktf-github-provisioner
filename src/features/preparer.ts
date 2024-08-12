import common from '@prefapp/firestartr-catalog_common'
import Debug from "debug"
import featuresPreparer from "@prefapp/firestartr-features_preparer"
import * as fs from "fs"

const messageLog = Debug('firestartr:provisioner:features:installer')

export async function prepareFeaturesForComponent(component:any, store:any){

  // those are the features to maintain
  let componentFeatures = component.spec?.provisioner?.features || [];

  // let's include the features to uninstall
  if(component.metadata.annotations["fire-starter.dev/features-to-uninstall"]){

     componentFeatures = componentFeatures.concat(JSON.parse(

       component.metadata.annotations["fire-starter.dev/features-to-uninstall"]

     ))

  }

  // let's include the features to install
  if(component.metadata.annotations["fire-starter.dev/features-to-install"]){

     componentFeatures = componentFeatures.concat(JSON.parse(

       component.metadata.annotations["fire-starter.dev/features-to-install"]

     ))
  }


  if(componentFeatures.length > 0){

    const entityPath:string = dumpArtifactYaml(component);

    for(const feature of componentFeatures){

      messageLog("Installing feature %s for component %s", feature.name, component.metadata.name);

      await featuresPreparer.getFeatureConfig(
        feature.name,
        feature.version,
        entityPath,
      );

      // Get feature config
      const featureConfig: any = common.features.features.getFeatureRenderedConfigForComponent(
        component, feature.name,
      )

      // Apply unpatch
      for(const patch of featureConfig.patches)
        store.actions.components.patch(component, patch)
    }
  }
}


function dumpArtifactYaml(component:any) : string{

  fs.mkdirSync("/tmp/components", {recursive: true});

  common.io.writeEntity(

    component,

    "/tmp"

  )

  return common.io.getEntityPath("components", component.metadata.name, "/tmp")

}
