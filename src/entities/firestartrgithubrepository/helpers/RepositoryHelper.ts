import { Construct } from 'constructs';
import { Repository, RepositoryConfig } from '@cdktf/provider-github/lib/repository';
import { FirestartrGithubRepository } from '../FirestartrGithubRepository';
import { BranchProtectionV3, BranchProtectionV3Config, BranchProtectionV3RequiredPullRequestReviews, BranchProtectionV3RequiredStatusChecks } from '@cdktf/provider-github/lib/branch-protection-v3';
import Debug from "debug"

const messageLog = Debug('firestartr:provisioner:entities:component:helpers:repositoryhelper')

export function provisionRepository(scope: Construct, fsGithubRepository: FirestartrGithubRepository){

  messageLog(`provisionRepository with name ${fsGithubRepository.metadata.name} in org ${fsGithubRepository.spec.org}`)

  const config: RepositoryConfig = {

    name: fsGithubRepository.metadata.name,

    description: fsGithubRepository.spec.repo.description,

    allowMergeCommit: fsGithubRepository.spec.repo.allowMergeCommit,

    allowSquashMerge: fsGithubRepository.spec.repo.allowSquashMerge,

    allowRebaseMerge: fsGithubRepository.spec.repo.allowRebaseMerge,

    allowAutoMerge: fsGithubRepository.spec.repo.allowAutoMerge,

    deleteBranchOnMerge: fsGithubRepository.spec.repo.deleteBranchOnMerge,

    autoInit: fsGithubRepository.spec.repo.autoInit,

    archiveOnDestroy: true,

    allowUpdateBranch: fsGithubRepository.spec.repo.allowUpdateBranch,

    hasIssues: fsGithubRepository.spec.repo.hasIssues,

    visibility: fsGithubRepository.spec.repo.visibility,

    archived: fsGithubRepository.spec.repo.archived,

    gitignoreTemplate: fsGithubRepository.spec.repo.gitignoreTemplate,

    licenseTemplate: fsGithubRepository.spec.repo.licenseTemplate,

    template: fsGithubRepository.spec.repo.template,

    vulnerabilityAlerts: fsGithubRepository.spec.repo.vulnerabilityAlerts,

    topics: fsGithubRepository.spec.repo.topics,

    securityAndAnalysis: fsGithubRepository.spec.repo.securityAndAnalysis,

    hasProjects: fsGithubRepository.spec.repo.hasProjects,

    hasWiki: fsGithubRepository.spec.repo.hasWiki,

    hasDownloads: fsGithubRepository.spec.repo.hasDownloads,

    hasDiscussions: fsGithubRepository.spec.repo.hasDiscussions,

    mergeCommitMessage: fsGithubRepository.spec.repo.mergeCommitMessage,

    ignoreVulnerabilityAlertsDuringRead: fsGithubRepository.spec.repo.ignoreVulnerabilityAlertsDuringRead,

    mergeCommitTitle: fsGithubRepository.spec.repo.mergeCommitTitle,

    squashMergeCommitMessage: fsGithubRepository.spec.repo.squashMergeCommitMessage,

    pages: fsGithubRepository.spec.pages,

  }

  const tfStateKey = `_${fsGithubRepository.getTfStateKey()}`

  const repo = new Repository(

    scope,

    tfStateKey,

    config

  );

  fsGithubRepository.addResourceToStack(

    fsGithubRepository.metadata.name,

    repo

  );

  return repo;

}

export function provisionBranchProtections(
  scope: Construct,
  repo: Repository,
  fsGithubRepository: FirestartrGithubRepository
): void {

  messageLog(`provisionBranchProtections with name ${fsGithubRepository.metadata.name} in org ${fsGithubRepository.spec.org}`)

  for(const branchProtection of fsGithubRepository.spec.branchProtections){

    const tfStateKey = `_${fsGithubRepository.getTfStateKey()}-${branchProtection.pattern}-bp`

    const statusChecks: BranchProtectionV3RequiredStatusChecks = {
      strict: true,
      checks: branchProtection.statusChecks.map((c:any)=>`${c}:`),
    }

    const requiredPullRequestReviews:  BranchProtectionV3RequiredPullRequestReviews = {
      requiredApprovingReviewCount: branchProtection.requiredReviewersCount,
    }

    const config: BranchProtectionV3Config = {
      repository: repo.name,
      branch: branchProtection.branch,
      enforceAdmins: false,
      requireSignedCommits: branchProtection.requireSignedCommits,
      requiredPullRequestReviews: requiredPullRequestReviews,
      requiredStatusChecks: statusChecks,
    }

    const bpV3 = new BranchProtectionV3(

      scope,

      tfStateKey,

      config

    );

    fsGithubRepository.addResourceToStack(

      `${repo.name}:${branchProtection.branch}`,

      bpV3

    );

  }

}
