import { Resource } from "../resource";
export declare class FirestartrGithubRepositoryFeature extends Resource {
    static kind(): string;
    preprocess(): Promise<void>;
    _updateManagedFiles(): Promise<void>;
    getRepoExternalName(ref: any): any;
    __getFileContentFromProvider(org: string, url: string): Promise<any>;
}
