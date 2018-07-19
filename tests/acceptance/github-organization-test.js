import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'

module('Acceptance | github organization', hooks => {
  let store, session, organization

  setupApplicationTest(hooks)
  setupMirage(hooks)

  hooks.beforeEach(async function () {
    store = this.owner.lookup('service:store')
    session = this.owner.lookup('service:github-session')
  })

  module('Unauthorized', () => {
    test('finding an organization without authorization',  async (assert) => {
      server.create('github-organization')
      organization = await store.findRecord('githubOrganization', 'organization0')

      assert.githubOrganizationOk(organization)
      assert.equal(store.peekAll('githubOrganization').get('length'), 1)
      assert.equal(server.pretender.handledRequests.length, 1)
      assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, undefined)
    })
  })

  module('Authorized', hooks => {
    hooks.beforeEach(async () => {
      session.set('githubAccessToken', 'abc123')
    })

    test('#findRecord finds a org',  async (assert) => {
      server.create('github-organization')
      organization = await store.findRecord('githubOrganization', 'organization0')

      assert.githubOrganizationOk(organization)
      assert.equal(store.peekAll('githubOrganization').get('length'), 1)
      assert.equal(server.pretender.handledRequests.length, 1)
      assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, 'token abc123')
    })

    test('#findRecord.repositories finds the repositories',  async (assert) => {
      server.create('github-organization', 'withRepositories')
      organization = await store.findRecord('githubOrganization', 'organization0')

      let repositories = await organization.get('repositories')

      assert.equal(repositories.get('length'), 2)
      assert.githubRepositoryOk(repositories.toArray()[0])
      assert.equal(server.pretender.handledRequests.length, 2)
      assert.equal(server.pretender.handledRequests[1].requestHeaders.Authorization, 'token abc123')
    })

    test('#findRecord.members finds the members',  async (assert) => {
      server.create('github-organization', 'withMembers')
      organization = await store.findRecord('githubOrganization', 'organization0')

      let members = await organization.get('members')

      assert.equal(members.get('length'), 2)
      assert.githubMemberOk(members.toArray()[0])
      assert.equal(server.pretender.handledRequests.length, 2)
      assert.equal(server.pretender.handledRequests[1].requestHeaders.Authorization, 'token abc123')
    })
  })
})
