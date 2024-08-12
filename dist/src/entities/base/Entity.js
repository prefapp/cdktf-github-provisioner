"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const cdktf_1 = require("cdktf");
const debug_1 = __importDefault(require("debug"));
const log = (0, debug_1.default)('firestartr:provisioner:entity:base');
const EXTERNAL_NAME_ANNOTATION = "firestartr.dev/external-name";
class Metadata {
    _metadata;
    constructor(metadata) {
        this._metadata = metadata;
    }
    get name() {
        if (EXTERNAL_NAME_ANNOTATION in this.annotations) {
            return this.annotations[EXTERNAL_NAME_ANNOTATION];
        }
        else {
            return this._metadata.name;
        }
    }
    get annotations() {
        return this._metadata.annotations || {};
    }
    get labels() {
        return this._metadata.labels || {};
    }
}
class Entity {
    kind;
    apiVersion;
    spec;
    metadata;
    deps;
    mainResource;
    importStack = [];
    constructor(artifact, deps) {
        this.kind = artifact.kind;
        this.apiVersion = artifact.apiVersion;
        this.metadata = new Metadata(artifact.metadata);
        this.spec = artifact.spec;
        if (deps) {
            this.deps = deps;
        }
    }
    getTfStateKey() {
        const uuid = this.spec.firestartr.tfStateKey;
        if (!uuid) {
            throw `getUUID: Entity with kind ${this.kind} ${this.metadata.name} does not have a UUID`;
        }
        if (!this.isUUID(uuid)) {
            throw `getUUID: Entity with kind ${this.kind} ${this.metadata.name} has an invalid UUID`;
        }
        return uuid;
    }
    isUUID(uuid) {
        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4|5][0-9a-fA-F]{3}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        return uuidRegex.test(uuid);
    }
    resolveRef(ref, propertyRef) {
        if (!this.deps) {
            throw `resolveRef:

          Entity with kind ${this.kind} ${this.metadata.name}

          does not have any dependencies`;
        }
        const { kind, name, needsSecret } = ref;
        if (!needsSecret) {
            const cr = this.deps[`${kind}-${name}`].cr;
            return cr.metadata?.annotations?.[EXTERNAL_NAME_ANNOTATION] || cr.metadata.name;
        }
        else {
            if (!propertyRef) {
                throw `resolveRef:

                Entity with kind ${this.kind} ${this.metadata.name}

                needs a propertyRef to resolve the secret`;
            }
            return Buffer.from(this.deps[`${kind}-${name}`].secret.data[propertyRef], 'base64').toString('utf8');
        }
    }
    resolveOutputs(scope) {
        if (this.spec.writeConnectionSecretToRef) {
            if (!this.mainResource) {
                throw `resolveOutputs:

            Entity with kind ${this.kind} ${this.metadata.name}

            does not have a mainResource`;
            }
            /**
             * We don't currently support writing outputs to modules
             */
            if (this.mainResource instanceof cdktf_1.TerraformModule)
                return;
            const keys = this.getKeysFrom(this.mainResource);
            const outputs = this.spec.writeConnectionSecretToRef.outputs;
            for (const o of outputs) {
                log("OUTPUT %s", o.key);
                if (!keys.includes(o.key)) {
                    throw `resolveOutputs:

            Entity with kind ${this.kind} ${this.metadata.name}

            does not have the output ${o.key}`;
                }
                new cdktf_1.TerraformOutput(scope, o.key, {
                    value: this.mainResource
                        .getAnyMapAttribute(this.camelToSnake(o.key))
                });
            }
        }
    }
    getKeysFrom(resource) {
        return Object.entries(Object.getOwnPropertyDescriptors(Reflect.getPrototypeOf(resource))).map(([key]) => key);
    }
    async provision({ scope }) {
        await this.loadResources({ scope });
        this.resolveOutputs(scope);
    }
    importResources() {
        for (const item of this.importStack) {
            item.resource.importFrom(item.key);
        }
    }
    addResourceToStack(resourceKey, resource) {
        this.importStack.push({ key: resourceKey, resource });
    }
    camelToSnake(camelCaseString) {
        return camelCaseString.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
    }
}
exports.Entity = Entity;
