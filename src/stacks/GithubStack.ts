import { GithubProvider } from '@cdktf/provider-github/lib/provider';
import { TerraformBackend, TerraformProvider } from 'cdktf';
import { getEntityInstance } from "../entities"
import { Entity } from '../entities/base/Entity';
import Debug from "debug"
import { BaseStack } from './base';
import common from '@prefapp/firestartr-catalog_common';
import { FirestartrTerraformProvider, createBackend } from '../providers';

const messageLog = Debug('firestartr:provisioner:stacks:githubstack')


export class GithubStack extends BaseStack {

  async provisionEntity(isImport: boolean, entity: any, deps: any, tfStatePath: string, orgConfig: any) {

    try {

      const { backendConfig, providerConfig } = this.getRefContextConfigs(entity, deps)

      this.initProviders(
        this,
        tfStatePath,
        backendConfig,
        providerConfig,
        deps
      )

      const instance: Entity = getEntityInstance(entity, deps)

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
    scope: any,
    tfStatePath: string,
    backendConfig: any,
    providerConfig: any,
    deps: any
  ): TerraformProvider {

    if (providerConfig.spec.type != FirestartrTerraformProvider.GITHUB) throw `Provider type ${providerConfig.spec.type} is not supported`

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
        backendConfigData
    )

    return new GithubProvider(
        scope,
        tfStatePath,
        common.generic.transformKeysToCamelCase(providerConfigData)
    )

  }


}
