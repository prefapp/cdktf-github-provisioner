"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provisionOIDCSubjectClaim = void 0;
const actions_repository_oidc_subject_claim_customization_template_1 = require("@cdktf/provider-github/lib/actions-repository-oidc-subject-claim-customization-template");
function provisionOIDCSubjectClaim(scope, repo, fsGithubRepository) {
    const tfStateKey = `_${fsGithubRepository.getTfStateKey()}-oidc-subject-claim-template`;
    const claimKeys = fsGithubRepository.spec.actions.oidc.includeClaimKeys;
    let config = {
        repository: repo.name,
        useDefault: claimKeys.length < 1,
    };
    if (claimKeys.length > 0) {
        config["includeClaimKeys"] = claimKeys;
    }
    const actionsClaim = new actions_repository_oidc_subject_claim_customization_template_1.ActionsRepositoryOidcSubjectClaimCustomizationTemplate(scope, tfStateKey, config);
    fsGithubRepository.addResourceToStack(fsGithubRepository.metadata.name, actionsClaim);
    return actionsClaim;
}
exports.provisionOIDCSubjectClaim = provisionOIDCSubjectClaim;
