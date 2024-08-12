"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextStatus = exports.getActionByStatus = exports.prepareFeatures = void 0;
const features_1 = require("../features/");
const catalog_common_1 = __importDefault(require("catalog_common"));
async function prepareFeatures(components, storeRef) {
    // we prepare ALL the features
    for (const component of components) {
        await (0, features_1.prepareFeaturesForComponent)(component, storeRef);
        await (0, features_1.installFeaturesForComponent)(component, storeRef);
    }
}
exports.prepareFeatures = prepareFeatures;
function getActionByStatus(status) {
    switch (status) {
        case catalog_common_1.default.types.ArtifactStatuses.provisioningStatus:
        case catalog_common_1.default.types.ArtifactStatuses.provisionedStatus:
        case catalog_common_1.default.types.ArtifactStatuses.pendingCreationStatus:
        case catalog_common_1.default.types.ArtifactStatuses.pendingProvisioningStatus:
        case catalog_common_1.default.types.ArtifactStatuses.pendingRenameStatus:
        case catalog_common_1.default.types.ArtifactStatuses.creatingStatus:
            return "deploy";
        case catalog_common_1.default.types.ArtifactStatuses.pendingDeleteStatus:
        case catalog_common_1.default.types.ArtifactStatuses.deletingStatus:
            return "destroy";
        default:
            return catalog_common_1.default.types.ArtifactStatuses.unknownStatus;
    }
}
exports.getActionByStatus = getActionByStatus;
function getNextStatus(status) {
    switch (status) {
        case catalog_common_1.default.types.ArtifactStatuses.provisioningStatus:
        case catalog_common_1.default.types.ArtifactStatuses.creatingStatus:
        case catalog_common_1.default.types.ArtifactStatuses.renamingStatus:
            return catalog_common_1.default.types.ArtifactStatuses.provisionedStatus;
        case catalog_common_1.default.types.ArtifactStatuses.pendingDeleteStatus:
            return catalog_common_1.default.types.ArtifactStatuses.deletedStatus;
        case catalog_common_1.default.types.ArtifactStatuses.pendingCreationStatus:
            return catalog_common_1.default.types.ArtifactStatuses.creatingStatus;
        case catalog_common_1.default.types.ArtifactStatuses.pendingProvisioningStatus:
            return catalog_common_1.default.types.ArtifactStatuses.provisioningStatus;
        case catalog_common_1.default.types.ArtifactStatuses.deletingStatus:
            return catalog_common_1.default.types.ArtifactStatuses.deletedStatus;
        case catalog_common_1.default.types.ArtifactStatuses.pendingRenameStatus:
            return catalog_common_1.default.types.ArtifactStatuses.renamingStatus;
        case catalog_common_1.default.types.ArtifactStatuses.errorStatus:
            return catalog_common_1.default.types.ArtifactStatuses.errorStatus;
        default:
            return catalog_common_1.default.types.ArtifactStatuses.unknownStatus;
    }
}
exports.getNextStatus = getNextStatus;
