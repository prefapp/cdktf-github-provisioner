"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.untrackManagedFiles = void 0;
const debug_1 = __importDefault(require("debug"));
const cdktf_1 = require("../cdktf");
const terraform_1 = require("../terraform");
const messageLog = (0, debug_1.default)('firestartr:provisioner:features:uninstaller');
async function untrackManagedFiles(feature, deps) {
    if (!feature.spec.files || feature.spec.files.length < 1)
        return;
    messageLog(`Removing managed files from the Terraform State`);
    messageLog(`Synthing the project...`);
    await (0, cdktf_1.runCDKTF)(feature, "synth", deps);
    await (0, terraform_1.runTerraform)(feature, ['init']);
    for (const file of feature.spec.files.filter((file) => file.userManaged === true)) {
        messageLog(`Removing from the state file ${file.path}`);
        // Terraform replaces / with -- and . with - in the state file names, so we do the same to get the state file name
        let stateFileName = `${feature.spec.type}-${file.path}`.replace(/\//g, '--').replace(/\./g, '');
        await (0, terraform_1.runTerraform)(feature, ['state', 'rm', `github_repository_file.${stateFileName}`]);
    }
    // messageLog(`Removing the files from the state`)
    // let workDir = __dirname.split(path.sep).includes('packages') ? path.join(__dirname, '..', '..') : path.join(__dirname, 'provisioner');
    // workDir = path.join(workDir, 'cdktf.out')
    // fs.rmSync(workDir, {recursive: true})
}
exports.untrackManagedFiles = untrackManagedFiles;
