import {FirestartrGithubRepositoryFeature} from "./index"

export async function create(resource:FirestartrGithubRepositoryFeature){

  // it has files?
  for(const file of resource.get("main_artifact").spec.files){

    await onFileCreation(resource, file)

  }


}

function onFileCreation(resource:FirestartrGithubRepositoryFeature, file:any){

  if(file.userManaged){

    // d

    // status
    //  FAILED
    //  reason:

  }
}
