import Debug from "debug";
import { FirestartrTerraformModuleEntity } from "../entities/firestartrterraformmodule/FirestartrTerraformModule";
import { BaseStack } from "./base";
import { createBackend, createProvider } from "../providers";
import { TerraformProvider } from "cdktf";
import common from '@prefapp/firestartr-catalog_common';

const messageLog = Debug("firestartr:provisioner:stacks:terraformmodulestack");

export class TerraformModuleStack extends BaseStack {

    async provisionEntity(isImport: boolean, entity: FirestartrTerraformModuleEntity, deps: any, tfStatePath: string, orgConfig: any) {

        try {

            const { backendConfig, providerConfig } = this.getRefContextConfigs(entity, deps)

            const provider = this.initProviders(
                this,
                entity.metadata.name,
                tfStatePath,
                backendConfig,
                providerConfig,
                deps
            )

            const instance = new FirestartrTerraformModuleEntity(entity, provider, deps)

            await instance.provision({ scope: this })

            if (isImport) {

                instance.importResources()

            }

        } catch (err: any) {

            messageLog("Error: provisionEntity: %s", err)

            throw err

        }
    }

    initProviders(
        scope: BaseStack,
        name: string,
        tfStatePath: string,
        backendConfig: any,
        providerConfig: any,
        deps: any
    ): TerraformProvider {

        const backendSecrets = this.getRefContextFromCr(backendConfig, deps);
        const providerSecrets = this.getRefContextFromCr(providerConfig, deps);

        const backendConfigData = this.replaceConfigSecrets(
            JSON.parse(backendConfig.spec.config), backendSecrets
        );

        const providerConfigData = this.replaceConfigSecrets(
            JSON.parse(providerConfig.spec.config), providerSecrets
        );

        createBackend(
            scope,
            backendConfig.spec.type,
            tfStatePath,
            backendConfigData,
        )

        return createProvider(
            scope,
            providerConfig.spec.type,
            name,
            providerConfigData,
        )

    }
}
