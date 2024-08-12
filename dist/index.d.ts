import { runCDKTF } from "./src/cdktf";
import { untrackManagedFiles } from "./src/features";
import { getActionByStatus, getNextStatus } from "./src/handlers";
import { runTerraform } from "./src/terraform";
import { runProvisioner } from "./init";
export { Resource } from "./src/resources/resource";
declare const _default: {
    runCDKTF: typeof runCDKTF;
    runTerraform: typeof runTerraform;
    getActionByStatus: typeof getActionByStatus;
    getNextStatus: typeof getNextStatus;
    untrackManagedFiles: typeof untrackManagedFiles;
    runProvisioner: typeof runProvisioner;
};
export default _default;
