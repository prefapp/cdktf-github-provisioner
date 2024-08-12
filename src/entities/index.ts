import { FirestartrGithubRepository } from "./firestartrgithubrepository/FirestartrGithubRepository";
import { FirestartrGithubRepositoryFeature } from "./feature/FirestartrGithubRepositoryFeature";
import { FirestartrGithubMembership } from "./firestartrgithubmembership/FirestartrGithubMembership";
import { FirestartrGithubGroup } from "./firestartrgithubgroup/FirestartrGithubGroup";
import { FirestartrTerraformModuleEntity } from "./firestartrterraformmodule/FirestartrTerraformModule";
import { Entity } from "./base/Entity";

export function getEntityInstance(entity: any, deps: any): Entity {

  let instance: any = null;

  switch (entity.kind) {
    case 'FirestartrGithubRepository':
      instance = new FirestartrGithubRepository(entity, deps);
      break;
    case 'FirestartrGithubGroup':
      instance = new FirestartrGithubGroup(entity, deps);
      break;
    case 'FirestartrGithubMembership':
      instance = new FirestartrGithubMembership(entity);
      break;
    case 'FirestartrGithubRepositoryFeature':
      instance = new FirestartrGithubRepositoryFeature(entity, deps);
      break;
    case 'FirestartrTerraformModule':
      instance = new FirestartrTerraformModuleEntity(entity, deps);
      break;
    default:
      break;
  }

  return instance;
}
