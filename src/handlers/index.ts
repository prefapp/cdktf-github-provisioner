import {
  installFeaturesForComponent,
  prepareFeaturesForComponent,
} from "../features/";

import common from '@prefapp/firestartr-catalog_common';

export async function prepareFeatures(components: any, storeRef: any) {
  // we prepare ALL the features
  for (const component of components) {
    await prepareFeaturesForComponent(component, storeRef);

    await installFeaturesForComponent(component, storeRef);
  }
}

export function getActionByStatus(status: any) {

  switch (status) {
    case common.types.ArtifactStatuses.provisioningStatus:
    case common.types.ArtifactStatuses.provisionedStatus:
    case common.types.ArtifactStatuses.pendingCreationStatus:
    case common.types.ArtifactStatuses.pendingProvisioningStatus:
    case common.types.ArtifactStatuses.pendingRenameStatus:
    case common.types.ArtifactStatuses.creatingStatus:
      return "deploy";

    case common.types.ArtifactStatuses.pendingDeleteStatus:
    case common.types.ArtifactStatuses.deletingStatus:
      return "destroy";

    default:
      return common.types.ArtifactStatuses.unknownStatus;
  }
}

export function getNextStatus(status: any) {

  switch (status) {
    case common.types.ArtifactStatuses.provisioningStatus:
    case common.types.ArtifactStatuses.creatingStatus:
    case common.types.ArtifactStatuses.renamingStatus:
      return common.types.ArtifactStatuses.provisionedStatus;

    case common.types.ArtifactStatuses.pendingDeleteStatus:
      return common.types.ArtifactStatuses.deletedStatus;

    case common.types.ArtifactStatuses.pendingCreationStatus:
      return common.types.ArtifactStatuses.creatingStatus;

    case common.types.ArtifactStatuses.pendingProvisioningStatus:
      return common.types.ArtifactStatuses.provisioningStatus;

    case common.types.ArtifactStatuses.deletingStatus:
      return common.types.ArtifactStatuses.deletedStatus;

    case common.types.ArtifactStatuses.pendingRenameStatus:
      return common.types.ArtifactStatuses.renamingStatus;
    case common.types.ArtifactStatuses.errorStatus:
      return common.types.ArtifactStatuses.errorStatus;
    default:
      return common.types.ArtifactStatuses.unknownStatus;
  }
}
