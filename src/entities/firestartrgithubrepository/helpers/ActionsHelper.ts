
import { FirestartrGithubRepository } from "../FirestartrGithubRepository";
import { Construct } from 'constructs';
import {
    ActionsRepositoryOidcSubjectClaimCustomizationTemplate,
    ActionsRepositoryOidcSubjectClaimCustomizationTemplateConfig,
} from "@cdktf/provider-github/lib/actions-repository-oidc-subject-claim-customization-template";
import { Repository } from "@cdktf/provider-github/lib/repository";

export function provisionOIDCSubjectClaim(
    scope: Construct,
    repo: Repository,
    fsGithubRepository: FirestartrGithubRepository,
) {

    const tfStateKey = `_${fsGithubRepository.getTfStateKey()}-oidc-subject-claim-template`

    const claimKeys = fsGithubRepository.spec.actions.oidc.includeClaimKeys;

    let config: any = {

        repository: repo.name,

        useDefault: claimKeys.length < 1,

    }

    if(claimKeys.length > 0){

        config["includeClaimKeys"] = claimKeys

    }

    const actionsClaim = new ActionsRepositoryOidcSubjectClaimCustomizationTemplate(

      scope,

      tfStateKey,

      config as ActionsRepositoryOidcSubjectClaimCustomizationTemplateConfig

    );

    fsGithubRepository.addResourceToStack(

        fsGithubRepository.metadata.name,

        actionsClaim

    );

    return actionsClaim;
}
