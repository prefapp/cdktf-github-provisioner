"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEntity = void 0;
const stacks_1 = require("./stacks");
async function loadEntity(isImport, entity, deps, app, orgConfig) {
    const tfStatePath = __calculateTFStatePath(entity);
    const stackClass = (0, stacks_1.getStackByEntity)(entity);
    const stack = new stackClass(app, tfStatePath);
    await stack.provisionEntity(isImport, entity, deps, tfStatePath, orgConfig);
    return stack;
}
exports.loadEntity = loadEntity;
function __calculateTFStatePath(entity) {
    return `${entity.kind.toLowerCase()}/${entity.spec.firestartr.tfStateKey}`;
}
