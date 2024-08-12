import { RepositoryConfigAux } from '../../src/entities/firestartrgithubrepository/auxiliars/RepositoryConfigAux';

describe('RepositoryConfigAux', () => {
  const repositoryConfigAux = new RepositoryConfigAux();

  it('Should retrieve the ignored properties for terraform', () => {
    const untrackedProps = repositoryConfigAux.getUntrackedProperties();

    expect(untrackedProps).toEqual([
      'archived',
      'description',
      'gitignore_template',
      'has_downloads',
      'has_projects',
      'has_wiki',
      'homepage_url',
      'id',
      'ignore_vulnerability_alerts_during_read',
      'is_template',
      'license_template',
      'merge_commit_message',
      'merge_commit_title',
      'private',
      'squash_merge_commit_message',
      'squash_merge_commit_title',
      'topics',
      'vulnerability_alerts',
      'pages',
      'template',
    ]);
  });
});
