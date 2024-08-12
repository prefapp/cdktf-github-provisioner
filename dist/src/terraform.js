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
exports.terraformDestroy = exports.terraformApply = exports.terraformPlan = exports.terraformInit = exports.runTerraform = void 0;
const catalog_common_1 = __importDefault(require("catalog_common"));
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
const debug_1 = __importDefault(require("debug"));
const node_readline_1 = require("node:readline");
const messageLog = (0, debug_1.default)("firestartr:provisioner:terraform");
async function runTerraform(entity, command) {
    // ! If we are into a compiled environmet, the folder must be set to current dir plus /provisioner because everything is on the same file at projects root
    // ? Is there a better way to check compiled env than look for packages directory in path ?
    let workDir = __dirname.split(path.sep).includes('packages') ? path.join(__dirname, '..') : path.join(__dirname, 'provisioner');
    workDir = workDir.split("/dist")[0];
    workDir = path.join(workDir, 'cdktf.out', 'stacks', `${entity.kind.toLowerCase()}--${entity['spec']['firestartr']['tfStateKey']}`);
    messageLog(`Running terraform with command ${command} in ${workDir}`);
    return new Promise((ok, ko) => {
        const terraformProcess = (0, child_process_1.spawn)("terraform", [...command], {
            cwd: workDir,
            env: {
                PATH: process.env.PATH,
                FIRESTARTR_CDKTF_ENTITY_NAME: entity.metadata.name,
                CATALOG_MAIN_STATE: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.catalogMainSate),
                CATALOG_DESIRED_STATE: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.catalogDesiredState),
                CATALOG_DELETIONS_STATE: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.catalogDeletionsState),
                CDKTF_CONFIG_FILES: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.cdktfConfigFiles),
                EXCLUSIONS_YAML_PATH: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.exclusionsYamlPath),
                FIRESTARTR_CDKTF_ENTITY_KIND: entity.kind,
                GITHUB_APP_ID: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.githubAppId),
                GITHUB_APP_INSTALLATION_ID: catalog_common_1.default.environment.getFromEnvironment(catalog_common_1.default.types.envVars.githubAppInstallationId),
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
                CDKTF_LOG_LEVEL: "DEBUG",
            }
        });
        let output = '';
        terraformProcess.stdout.on("data", (log) => {
            const line = catalog_common_1.default.io.stripAnsi(log.toString());
            output += line;
            console.log(line);
        });
        terraformProcess.stderr.on("data", (log) => {
            const line = catalog_common_1.default.io.stripAnsi(log.toString());
            output += line;
            console.log(line);
        });
        terraformProcess.on("exit", async (code) => {
            console.log(`child process exited with code ${code}`);
            if (code !== 0) {
                console.log(output);
                ko(output);
            }
            else {
                ok(output);
            }
        });
    });
}
exports.runTerraform = runTerraform;
function terraformInit(entity) {
    return runTerraform(entity, ["init", "-no-color"]);
}
exports.terraformInit = terraformInit;
function terraformPlan(entity) {
    return runTerraform(entity, ["plan", "-no-color"]);
}
exports.terraformPlan = terraformPlan;
async function terraformApply(entity, isImport = false, skipPlan = false) {
    let line = false;
    if (isImport && !skipPlan) {
        console.log(`

🚀 Are you sure you want to

import and apply changes from entity ${entity.kind} ${entity.metadata.name} ?

Type 'yes' to continue:`);
        const reader = (0, node_readline_1.createInterface)({ input: process.stdin });
        line = await new Promise((resolve) => {
            reader.on('line', (line) => {
                reader.close();
                resolve(line);
            });
        });
    }
    if (line === 'yes' || skipPlan) {
        return runTerraform(entity, ["apply", "-no-color", "-auto-approve"]);
    }
    else {
        console.log(`🚀 Skipping apply for entity ${entity.kind} ${entity.metadata.name}`);
        return Promise.resolve("");
    }
}
exports.terraformApply = terraformApply;
function terraformDestroy(entity) {
    return runTerraform(entity, ["destroy", "-no-color", "-auto-approve"]);
}
exports.terraformDestroy = terraformDestroy;
