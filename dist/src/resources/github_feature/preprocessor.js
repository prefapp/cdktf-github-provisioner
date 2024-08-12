"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
async function create(resource) {
    // it has files?
    for (const file of resource.get("main_artifact").spec.files) {
        await onFileCreation(resource, file);
    }
}
exports.create = create;
function onFileCreation(resource, file) {
    if (file.userManaged) {
        // d
        // status
        //  FAILED
        //  reason:
    }
}
