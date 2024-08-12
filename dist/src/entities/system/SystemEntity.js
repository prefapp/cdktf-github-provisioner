"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemEntity = void 0;
const Entity_1 = require("../base/Entity");
const debug_1 = __importDefault(require("debug"));
const messageLog = (0, debug_1.default)('firestartr:provisioner:modules:artifacts:systemartifact');
class SystemEntity extends Entity_1.Entity {
    constructor(entity) {
        super(entity);
    }
    async loadResources(data) {
        messageLog(`This is a system artifact, nothing to provision`);
    }
}
exports.SystemEntity = SystemEntity;
