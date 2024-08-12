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
exports.prepareFeaturesForComponent = void 0;
const catalog_common_1 = __importDefault(require("catalog_common"));
const debug_1 = __importDefault(require("debug"));
const features_preparer_1 = __importDefault(require("features_preparer"));
const fs = __importStar(require("fs"));
const messageLog = (0, debug_1.default)('firestartr:provisioner:features:installer');
async function prepareFeaturesForComponent(component, store) {
    // those are the features to maintain
    let componentFeatures = component.spec?.provisioner?.features || [];
    // let's include the features to uninstall
    if (component.metadata.annotations["fire-starter.dev/features-to-uninstall"]) {
        componentFeatures = componentFeatures.concat(JSON.parse(component.metadata.annotations["fire-starter.dev/features-to-uninstall"]));
    }
    // let's include the features to install
    if (component.metadata.annotations["fire-starter.dev/features-to-install"]) {
        componentFeatures = componentFeatures.concat(JSON.parse(component.metadata.annotations["fire-starter.dev/features-to-install"]));
    }
    if (componentFeatures.length > 0) {
        const entityPath = dumpArtifactYaml(component);
        for (const feature of componentFeatures) {
            messageLog("Installing feature %s for component %s", feature.name, component.metadata.name);
            await features_preparer_1.default.getFeatureConfig(feature.name, feature.version, entityPath);
            // Get feature config
            const featureConfig = catalog_common_1.default.features.features.getFeatureRenderedConfigForComponent(component, feature.name);
            // Apply unpatch
            for (const patch of featureConfig.patches)
                store.actions.components.patch(component, patch);
        }
    }
}
exports.prepareFeaturesForComponent = prepareFeaturesForComponent;
function dumpArtifactYaml(component) {
    fs.mkdirSync("/tmp/components", { recursive: true });
    catalog_common_1.default.io.writeEntity(component, "/tmp");
    return catalog_common_1.default.io.getEntityPath("components", component.metadata.name, "/tmp");
}
