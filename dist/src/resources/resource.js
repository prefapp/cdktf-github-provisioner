"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
const cdktf_1 = require("../cdktf");
const terraform_1 = require("../terraform");
class Resource {
    data = {};
    output = '';
    logFn = (msg) => console.log(msg);
    setLogger(fn) {
        this.logFn = fn;
    }
    constructor(mainCR, operation, deps = []) {
        this.set('main_artifact', mainCR);
        this.set('operation', operation);
        this.set('deps', deps);
    }
    async run() {
        try {
            await this.preprocess();
            await this.synth();
            await this.runTerraform();
        }
        catch (err) {
            throw `error: ${JSON.stringify(err, null, 4)}`;
        }
    }
    artifact() {
        return this.get('main_artifact');
    }
    async synth() {
        const isImport = this.get('operation') === 'IMPORT' || this.get('operation') === 'IMPORT_SKIP_PLAN';
        await (0, cdktf_1.runCDKTF)(this.get('main_artifact'), "synth", this.get('deps'), isImport);
    }
    log(msg) {
        this.logFn(msg);
    }
    async runTerraform() {
        let output = '';
        output += await (0, terraform_1.terraformInit)(this.get('main_artifact'));
        output += await (0, terraform_1.terraformPlan)(this.get('main_artifact'));
        if (this.get('operation') === 'CREATE' || this.get('operation') === 'UPDATE') {
            output += await (0, terraform_1.terraformApply)(this.get('main_artifact'), false, true);
        }
        else if (this.get('operation') === 'DELETE') {
            output += await (0, terraform_1.terraformDestroy)(this.get('main_artifact'));
        }
        else if (this.get('operation') === 'IMPORT') {
            output += await (0, terraform_1.terraformApply)(this.get('main_artifact'), true, false);
        }
        else if (this.get('operation') === 'IMPORT_SKIP_PLAN') {
            output += await (0, terraform_1.terraformApply)(this.get('main_artifact'), true, true);
        }
        else {
            throw new Error(`unknown operation: ${this.get('operation')}`);
        }
        this.set('output', output);
    }
    async preprocess() { }
    crs() { }
    env() { }
    set(k, v) {
        this.data[k] = v;
    }
    get(k) {
        return this.data[k];
    }
}
exports.Resource = Resource;
