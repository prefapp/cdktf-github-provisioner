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
exports.provisionFeatureFiles = void 0;
const repository_file_1 = require("@cdktf/provider-github/lib/repository-file");
const debug_1 = __importDefault(require("debug"));
const cdktf_1 = require("cdktf");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
const messageLog = (0, debug_1.default)('firestartr:provisioner:features:provisioner');
function provisionFeatureFiles(scope, feature) {
    messageLog(`Provisioning feature ${feature.spec.type} for ${feature.spec.repositoryTarget.name}`);
    messageLog('Feature output json: %O', feature);
    const tmpDir = '/tmp/features_files_provisioning';
    /**
     * Clean up the features files directory
     */
    fs.existsSync(tmpDir) &&
        fs.rmdirSync(tmpDir, { recursive: true });
    /**
     * Create the features files directory
     */
    fs.mkdirSync(tmpDir, { recursive: true });
    const writeFeatureFileToDiskFn = (tmpDir, fileName, content) => {
        const filePath = path.join(tmpDir, fileName);
        messageLog('Writing file %s to %s', fileName, filePath);
        fs.writeFileSync(filePath, Buffer.from(content, 'base64').toString('utf8'), { encoding: 'utf-8' });
        return filePath;
    };
    if (feature.spec.files) {
        for (const file of feature.spec.files) {
            messageLog('Provisioning file %O', file);
            const tmpPathFile = writeFeatureFileToDiskFn(tmpDir, (0, uuid_1.v4)(), file.content);
            const lifecycleArg = file.userManaged ? { ignoreChanges: ['content'] } : {};
            const repoConfig = {
                branch: feature.spec.repositoryTarget.branch,
                commitMessage: `feat: ${feature.spec.type} ${feature.spec.version}`,
                content: cdktf_1.Fn.file(tmpPathFile),
                file: file.path,
                repository: feature.resolveRef(feature.spec.repositoryTarget.ref),
                overwriteOnCreate: true,
                lifecycle: lifecycleArg
            };
            new repository_file_1.RepositoryFile(scope, `${feature.spec.type}-${file.path}`, repoConfig);
        }
    }
}
exports.provisionFeatureFiles = provisionFeatureFiles;
