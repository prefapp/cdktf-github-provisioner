"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigAux = void 0;
class ConfigAux {
    trackableProperties;
    constructor({ trackableProperties }) {
        this.trackableProperties = trackableProperties;
    }
    /**
     * @returns Array of properties that are tracked by Terraform
     * @description This method returns an array of properties that are tracked by Terraform
     */
    getTrackeableProperties = () => this.trackableProperties;
    /**
     * @returns Array of properties that are not tracked by Terraform
     * @description This method returns an array of properties that are not tracked by Terraform, it will be included in the lifecycle.ignoreChanges
     * @see https://www.terraform.io/docs/language/meta-arguments/lifecycle.html
     */
    getUntrackedProperties() {
        // Get keys from RepositoryConfig interface
        const allKeys = Object.keys(this);
        // remove terraform related keys
        let untrackedProperties = allKeys.filter(key => !this.discriminateSpecialProperties().includes(key));
        // remove trackeable properties
        untrackedProperties = untrackedProperties.filter(key => !this.getTrackeableProperties().includes(key));
        return this.toSnakeCase(untrackedProperties);
    }
    /**
     * @returns Array of terraform related properties
     * @description This method returns an array of terraform related properties
     */
    discriminateSpecialProperties() {
        return [
            'getTrackeableProperties',
            'trackableProperties',
            'dependsOn',
            'count',
            'provider',
            'lifecycle',
            'forEach',
            'provisioners',
            'connection',
        ];
    }
    /**
     *
     * @param camelCaseStrings Array of strings in camelCase format
     * @returns
     */
    toSnakeCase(camelCaseStrings) {
        return camelCaseStrings.map(str => {
            return str.replace(/[A-Z]/g, match => `_${match.toLowerCase()}`);
        });
    }
}
exports.ConfigAux = ConfigAux;
