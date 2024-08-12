import { BaseStack } from "./base";
import { Construct } from "constructs";
export declare class StackNotFoundError extends Error {
    constructor(kind: string);
}
export declare function getStackByEntity(entity: any): new (app: Construct, tfStatePath: string) => BaseStack;
