import 'cdktf/lib/testing/adapters/jest';
import { Testing } from 'cdktf';
import { Membership } from '@cdktf/provider-github/lib/membership';
import { FirestartrGithubMembership } from '../../src/entities/firestartrgithubmembership/FirestartrGithubMembership';
import { TeamMembership } from '@cdktf/provider-github/lib/team-membership';

const testUser = new FirestartrGithubMembership({
  apiVersion: 'firestartr.dev/v1',
  kind: 'FirestartrGithubMembership',
  metadata: {
    name: 'juanjosevazquezgil',
  },
  spec: {
    context: {
      backend: {},
      provider: {}
    },
    org: 'prefapp',
    firestartr: {
      tfStateKey: 'd6f46062-8ce2-4ad9-b9e5-680dbf3e99e1',
      profile: {
        displayName: 'jvazquezgil',
        email: 'jvazquezgil@example.com',
        picture: 'https://example.com/picture.jpg',
      },
    },
    role: 'admin',
    writeConnectionSecretToRef: {
      name: 'FirestartrGithubMembership-juanjosevazquezgil-outputs',
      outputs: [],
    }

  },
})

describe('Test that user is being invited to the team', () => {
  it('should contain a valid membership for a team', () => {

    const testScope = Testing.synthScope(scope => {
      testUser.provision({ scope });
    })

    // It should contain a membership
    expect(testScope).toHaveResourceWithProperties(Membership, {
      role: testUser.spec.role,
      username: testUser.metadata.name
    });

    // It should not contain a team membership
    expect(testScope).not.toHaveResource(TeamMembership);

  });
});
