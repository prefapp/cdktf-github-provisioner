import { FirestartrGithubRepository } from "../FirestartrGithubRepository";
import { Construct } from 'constructs';
import { ActionsRepositoryOidcSubjectClaimCustomizationTemplate } from "@cdktf/provider-github/lib/actions-repository-oidc-subject-claim-customization-template";
import { Repository } from "@cdktf/provider-github/lib/repository";
export declare function provisionOIDCSubjectClaim(scope: Construct, repo: Repository, fsGithubRepository: FirestartrGithubRepository): ActionsRepositoryOidcSubjectClaimCustomizationTemplate;
