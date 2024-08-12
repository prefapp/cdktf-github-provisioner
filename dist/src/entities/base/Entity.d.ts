import { Construct } from "constructs";
import { TerraformModule, TerraformResource } from "cdktf";
declare class Metadata {
    _metadata: any;
    constructor(metadata: any);
    get name(): any;
    get annotations(): any;
    get labels(): any;
}
export declare abstract class Entity {
    kind: string;
    apiVersion: string;
    spec: any;
    metadata: Metadata;
    deps?: any;
    mainResource?: TerraformResource | TerraformModule;
    importStack: {
        key: string;
        resource: TerraformResource;
    }[];
    constructor(artifact: any, deps?: any);
    getTfStateKey(): string;
    protected isUUID(uuid: string): boolean;
    resolveRef(ref: {
        kind: string;
        name: string;
        needsSecret: boolean;
    }, propertyRef?: string): any;
    resolveOutputs(scope: Construct): void;
    getKeysFrom(resource: TerraformResource): string[];
    abstract loadResources({ scope }: {
        scope: Construct;
    }): Promise<void>;
    provision({ scope }: {
        scope: Construct;
    }): Promise<void>;
    importResources(): void;
    addResourceToStack(resourceKey: string, resource: TerraformResource): void;
    camelToSnake(camelCaseString: string): string;
}
export {};
