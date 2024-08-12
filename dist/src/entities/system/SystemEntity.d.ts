import { Construct } from "constructs";
import { Entity } from "../base/Entity";
export declare class SystemEntity extends Entity {
    constructor(entity: any);
    loadResources(data: {
        scope: Construct;
        options?: any;
    }): Promise<void>;
}
