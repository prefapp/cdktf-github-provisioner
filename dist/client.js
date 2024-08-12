"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploy = void 0;
const catalog_common_1 = __importDefault(require("catalog_common"));
const cdktf_1 = require("cdktf");
const loader_1 = require("./src/loader");
const debug_1 = __importDefault(require("debug"));
const messageLog = (0, debug_1.default)('firestartr:provisioner:main');
async function deploy(app) {
    const entity = JSON.parse(catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.cdktfEntity));
    const deps = JSON.parse(catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.cdktfDeps));
    const isImport = catalog_common_1.default.environment.getFromEnvironmentAsBoolean(catalog_common_1.default.types.envVars.cdktfIsImport);
    messageLog("Entity to provision: %O", entity);
    const orgConfig = {
        bucket: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.s3Bucket),
        dynamodbTable: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.s3Lock),
        region: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.s3Region),
        org: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.org),
        githubAppId: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.githubAppId),
        githubAppInstallationId: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.githubAppInstallationId),
        githubAppPemFile: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.githubAppPemFile),
        awsAccesKey: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.awsAccesKey),
        awsAccesSecretKey: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.awsAccesSecretKey),
        token: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.token),
    };
    await (0, loader_1.loadEntity)(isImport, entity, deps, app, orgConfig);
    try {
        app.synth();
    }
    catch (e) {
        messageLog("Error: deploy: %s", e);
        throw e;
    }
}
exports.deploy = deploy;
deploy(new cdktf_1.App());
