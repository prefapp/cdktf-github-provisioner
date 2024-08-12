export declare function runTerraform(entity: any, command: Array<string>): Promise<unknown>;
export declare function terraformInit(entity: any): Promise<unknown>;
export declare function terraformPlan(entity: any): Promise<unknown>;
export declare function terraformApply(entity: any, isImport?: boolean, skipPlan?: boolean): Promise<unknown>;
export declare function terraformDestroy(entity: any): Promise<unknown>;
