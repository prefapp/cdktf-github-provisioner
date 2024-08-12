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
exports.runCDKTF = void 0;
const catalog_common_1 = __importDefault(require("catalog_common"));
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
async function runCDKTF(entity, action, deps, isImport) {
    // ! If we are into a compiled environmet, the folder must be set to current dir plus /provisioner because everything is on the same file at projects root
    // ? Is there a better way to check compiled env than look for packages directory in path ?
    let workDir = __dirname.split(path.sep).includes('packages') ? path.join(__dirname, '..') : path.join(__dirname, 'provisioner');
    workDir = workDir.split("/dist")[0];
    return new Promise((ok, ko) => {
        const cdktfProcess = (0, child_process_1.spawn)("cdktf", [action, "--log-level", "DEBUG", "--auto-approve"], {
            cwd: workDir,
            env: {
                ...process.env,
                PATH: process.env.PATH,
                FIRESTARTR_CDKTF_ENTITY: JSON.stringify(entity),
                FIRESTARTR_CDKTF_DEPS: JSON.stringify(deps),
                CATALOG_MAIN_STATE: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.catalogMainSate),
                CATALOG_DESIRED_STATE: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.catalogDesiredState),
                CATALOG_DELETIONS_STATE: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.catalogDeletionsState),
                CDKTF_CONFIG_FILES: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.cdktfConfigFiles),
                FIRESTARTR_CDKTF_IS_IMPORT: isImport ? "true" : "false",
                EXCLUSIONS_YAML_PATH: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.exclusionsYamlPath),
                FIRESTARTR_CDKTF_ENTITY_KIND: entity.kind,
                GITHUB_APP_ID: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.githubAppId),
                GITHUB_APP_INSTALLATION_ID: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.githubAppInstallationId),
                GITHUB_APP_INSTALLATION_ID_PREFAPP: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.githubAppInstallationIdPrefapp),
                GITHUB_APP_PEM_FILE: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.githubAppPemFile),
                S3_BUCKET: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.s3Bucket),
                S3_REGION: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.s3Region),
                S3_LOCK: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.s3Lock),
                AWS_ACCESS_KEY_ID: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.awsAccesKey),
                AWS_SECRET_ACCESS_KEY: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.awsAccesSecretKey),
                ORG: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.org),
                TOKEN: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.token),
                KUBERNETES_SERVICE_HOST: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.kubernetesServiceHost),
                KUBERNETES_SERVICE_PORT: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.kubernetesServicePort),
                CDKTF_LOG_LEVEL: "OFF",
                FORCE_COLOR: "0",
                DEBUG: process.env.DEBUG,
                DEBUG_DEPTH: "0"
            }
        });
        let output = '';
        cdktfProcess.stdout.on("data", (log) => {
            output += catalog_common_1.default.io.stripAnsi(log.toString());
        });
        cdktfProcess.stderr.on("data", (log) => {
            output += catalog_common_1.default.io.stripAnsi(log.toString());
        });
        cdktfProcess.on("exit", async (code) => {
            if (code !== 0) {
                ko({ mainCommand: action, output });
            }
            else {
                ok({ mainCommand: action, output });
            }
        });
    });
}
exports.runCDKTF = runCDKTF;
