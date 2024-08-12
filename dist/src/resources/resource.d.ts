export declare class Resource {
    data: any;
    output: string;
    logFn: Function;
    setLogger(fn: Function): void;
    constructor(mainCR: any, operation: string, deps?: any[]);
    run(): Promise<void>;
    artifact(): any;
    synth(): Promise<void>;
    log(msg: string): void;
    runTerraform(): Promise<void>;
    preprocess(): Promise<void>;
    crs(): void;
    env(): void;
    set(k: string, v: any): void;
    get(k: string): any;
}
