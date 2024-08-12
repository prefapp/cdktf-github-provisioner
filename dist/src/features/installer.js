"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installFeaturesForComponent = void 0;
const catalog_common_1 = __importDefault(require("catalog_common"));
const debug_1 = __importDefault(require("debug"));
const fs = __importStar(require("fs"));
const github_1 = __importDefault(require("github"));
const messageLog = (0, debug_1.default)('firestartr:provisioner:features:installer');
async function installFeaturesForComponent(component, store) {
    const componentFeatures = component.spec?.provisioner?.features || '[]';
    const componentFeaturesToInstall = componentFeatures.filter((feature) => {
        return feature.status.value === catalog_common_1.default.types.FeatureStatuses.pendingInstallStatus;
    });
    if (componentFeaturesToInstall.length > 0) {
        for (const feature of componentFeaturesToInstall) {
            messageLog("Installing feature %s for component %s", feature.name, component.metadata.name);
            // Get feature config
            const featureConfig = catalog_common_1.default.features.features.getFeatureRenderedConfigForComponent(component, feature.name);
            // prepare files
            await prepareFilesForInstalling(feature.name, component, featureConfig.files);
            // Apply patch
            for (const patch of featureConfig.patches)
                store.actions.components.patch(component, patch);
            // Mark as installed
            store.actions.components.featureInstalled(component, feature.name, feature.version);
        }
    }
    else {
        messageLog(`No features to install for component ${component.metadata.name}`);
    }
    return store;
}
exports.installFeaturesForComponent = installFeaturesForComponent;
async function prepareFilesForInstalling(featureName, component, featureConfigFiles) {
    for (const file of featureConfigFiles) {
        if (isFreshInstallation(featureName, component) && file.userManaged) {
            await prepareUserManagedFileForInstalling(component, file);
        }
    }
}
async function prepareUserManagedFileForInstalling(component, file) {
    // check if the file already exists
    const fileContent = await getFileContentFromGithubIfExists(file.repoPath, component.metadata.name, component.spec.provisioner.org);
    // if exists get the content
    if (fileContent) {
        // write down the content of the file such as it exists in the repo
        updateFileContent(file.localPath, fileContent);
    }
}
async function getFileContentFromGithubIfExists(path, repositoryName, owner) {
    try {
        const fileContent = await github_1.default.repo.getContent(path, repositoryName, owner);
        return fileContent;
    }
    catch (e) {
        if (e.status === 404) {
            messageLog(`File ${path} not found in ${repositoryName}`);
            return false;
        }
        throw e;
    }
}
function updateFileContent(fileSrc, fileContent) {
    fs.writeFileSync(fileSrc, fileContent);
}
function isFreshInstallation(featureName, component) {
    if (component["metadata"]["annotations"]['fire-starter.dev/features-to-install']) {
        const featuresToInstall = JSON.parse(component["metadata"]["annotations"]['fire-starter.dev/features-to-install']);
        const featureToInstall = featuresToInstall.find((feature) => feature["name"] === featureName);
        if (featureToInstall) {
            return true;
        }
    }
    return false;
}
