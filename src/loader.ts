

import {App} from 'cdktf';

import { getStackByEntity } from './stacks';

export async function loadEntity(
  isImport:boolean,
  entity:any,
  deps: any,
  app:App,
  orgConfig:any
){

  const tfStatePath = __calculateTFStatePath(entity)

  const stackClass = getStackByEntity(entity);

  const stack = new stackClass(app, tfStatePath);


  await stack.provisionEntity(isImport, entity, deps, tfStatePath, orgConfig)

  return stack;

}

function __calculateTFStatePath(entity:any) {

  return `${entity.kind.toLowerCase()}/${entity.spec.firestartr.tfStateKey}`;

}
