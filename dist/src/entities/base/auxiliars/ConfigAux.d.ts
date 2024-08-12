export declare class ConfigAux {
    trackableProperties: string[];
    constructor({ trackableProperties }: {
        trackableProperties: string[];
    });
    /**
     * @returns Array of properties that are tracked by Terraform
     * @description This method returns an array of properties that are tracked by Terraform
     */
    getTrackeableProperties: () => string[];
    /**
     * @returns Array of properties that are not tracked by Terraform
     * @description This method returns an array of properties that are not tracked by Terraform, it will be included in the lifecycle.ignoreChanges
     * @see https://www.terraform.io/docs/language/meta-arguments/lifecycle.html
     */
    getUntrackedProperties(): string[];
    /**
     * @returns Array of terraform related properties
     * @description This method returns an array of terraform related properties
     */
    discriminateSpecialProperties(): string[];
    /**
     *
     * @param camelCaseStrings Array of strings in camelCase format
     * @returns
     */
    toSnakeCase(camelCaseStrings: string[]): string[];
}
