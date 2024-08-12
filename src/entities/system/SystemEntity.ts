import { Construct } from "constructs";
import { Entity } from "../base/Entity";
import Debug from "debug"

const messageLog = Debug(
  'firestartr:provisioner:modules:artifacts:systemartifact'
)


export class SystemEntity extends Entity {
  constructor(entity: any) {
    super(entity);
  }


  async loadResources(data: {scope: Construct, options?: any}): Promise<void> {

    messageLog(`This is a system artifact, nothing to provision`)

  }
}
