import { Construct } from "constructs";
import { TerraformModule, TerraformOutput, TerraformResource } from "cdktf";
import Debug from "debug";

const log = Debug('firestartr:provisioner:entity:base')
const EXTERNAL_NAME_ANNOTATION = "firestartr.dev/external-name"

class Metadata {

  _metadata: any

  constructor(metadata: any){

    this._metadata = metadata

  }

  get name(){

    if(EXTERNAL_NAME_ANNOTATION in this.annotations){

      return this.annotations[EXTERNAL_NAME_ANNOTATION]

    } else {

      return this._metadata.name
    }
  }

  get annotations(){

    return this._metadata.annotations || {}
  }

  get labels(){

    return this._metadata.labels || {}

  }

}

export abstract class Entity {

    kind: string

    apiVersion: string

    spec: any

    metadata: Metadata

    deps?: any

    mainResource?: TerraformResource | TerraformModule

    importStack: {key: string, resource: TerraformResource}[] = []

    constructor(artifact: any, deps?: any) {
      this.kind = artifact.kind;
      this.apiVersion = artifact.apiVersion;
      this.metadata = new Metadata(artifact.metadata);
      this.spec = artifact.spec;

      if(deps){

        this.deps = deps;

      }
    }

    getTfStateKey(): string {

      const uuid = this.spec.firestartr.tfStateKey;

      if (!uuid) {

        throw `getUUID: Entity with kind ${this.kind} ${this.metadata.name} does not have a UUID`;

      }

      if (!this.isUUID(uuid)) {

        throw `getUUID: Entity with kind ${this.kind} ${this.metadata.name} has an invalid UUID`;

      }

      return uuid;
    }

    protected isUUID(uuid: string): boolean {

      const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4|5][0-9a-fA-F]{3}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

      return uuidRegex.test(uuid);
    }

    resolveRef(ref: {kind: string, name: string, needsSecret: boolean}, propertyRef?: string): any {

        if(!this.deps) {

          throw `resolveRef:

          Entity with kind ${this.kind} ${this.metadata.name}

          does not have any dependencies`;

        }

        const {kind, name, needsSecret} = ref;

        if(!needsSecret){

          const cr = this.deps[`${kind}-${name}`].cr;

          return cr.metadata?.annotations?.[EXTERNAL_NAME_ANNOTATION] || cr.metadata.name;

        } else {

            if(!propertyRef){

              throw `resolveRef:

                Entity with kind ${this.kind} ${this.metadata.name}

                needs a propertyRef to resolve the secret`;

            }

          return Buffer.from(this.deps[`${kind}-${name}`].secret.data[propertyRef], 'base64').toString('utf8');

        }

    }

    resolveOutputs(scope: Construct){

      if(this.spec.writeConnectionSecretToRef){

        if(!this.mainResource){

            throw `resolveOutputs:

            Entity with kind ${this.kind} ${this.metadata.name}

            does not have a mainResource`

        }

        /**
         * We don't currently support writing outputs to modules
         */
        if (this.mainResource instanceof TerraformModule) return;

        const keys = this.getKeysFrom(this.mainResource);

        const outputs: { key: string }[] = this.spec.writeConnectionSecretToRef.outputs

        for(const o of outputs){

          log("OUTPUT %s", o.key)

          if(!keys.includes(o.key)){

            throw `resolveOutputs:

            Entity with kind ${this.kind} ${this.metadata.name}

            does not have the output ${o.key}`

          }

          new TerraformOutput(scope, o.key, {

            value: this.mainResource

              .getAnyMapAttribute(

                this.camelToSnake(o.key)

              )

            }

          );

        }

      }


    }

    getKeysFrom(resource: TerraformResource){

      return Object.entries(

        Object.getOwnPropertyDescriptors(

          Reflect.getPrototypeOf(resource)

        )

      ).map(([key]) => key)

    }

    abstract loadResources({scope}:{scope: Construct}): Promise<void>;

    async provision({scope}:{scope: Construct}): Promise<void> {

      await this.loadResources({scope});

      this.resolveOutputs(scope);

    }

    importResources(): void {

      for(const item of this.importStack){

        item.resource.importFrom(item.key);

      }
    }

    addResourceToStack(resourceKey: string, resource: TerraformResource): void {

      this.importStack.push({key: resourceKey, resource});

    }

    camelToSnake(camelCaseString: string): string {

      return camelCaseString.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);

    }



}
