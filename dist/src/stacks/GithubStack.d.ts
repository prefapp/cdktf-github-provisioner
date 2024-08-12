import { TerraformProvider } from 'cdktf';
import { BaseStack } from './base';
export declare class GithubStack extends BaseStack {
    provisionEntity(isImport: boolean, entity: any, deps: any, tfStatePath: string, orgConfig: any): Promise<void>;
    initProviders(scope: any, tfStatePath: string, backendConfig: any, providerConfig: any, deps: any): TerraformProvider;
}
