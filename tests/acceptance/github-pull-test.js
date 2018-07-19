import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'

module('Acceptance | github pull', hooks => {
  let store, session

  setupApplicationTest(hooks)
  setupMirage(hooks)

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store')
    session = this.owner.lookup('service:github-session')
  })

  module('Unauthorized', () => {
    test('#queryRecord finds one PR', async (assert) => {
      server.create('github-pull')
      assert.githubPullOk(await store.queryRecord('githubPull', { repo: 'user1/repository1', pullId: '1' }))
      assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, undefined, 'has no authorization token')
    })
  })

  module('Authorized', hooks => {
    hooks.beforeEach(function () {
      session.set('githubAccessToken', 'abc123')
      server.createList('github-pull', 2, {
        repository: server.create('githubRepository')
      })
    })

    test('#queryRecord finds one PR', async (assert) => {
      assert.githubPullOk(await store.queryRecord('githubPull', { repo: 'user1/repository0', pullId: '1' }))
      assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, 'token abc123', 'has the authorization token')
    })

    test('#query finds all PRs', async (assert) => {
      let pulls = await store.query('githubPull', { repo: 'user1/repository0' })

      assert.equal(pulls.get('length'), 2, 'loads 2 pulls')
      assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, 'token abc123', 'has the authorization token')
    })

    test('getting a pull request\'s author', async (assert) => {
      let user = await store
        .queryRecord('githubPull', { repo: 'user1/repository0', pullId: '1' })
        .then(pull => pull.get('user'))

      assert.githubUserOk(user)
      assert.equal(store.peekAll('githubUser').get('length'), 1, 'loads 1 user')
      assert.equal(server.pretender.handledRequests.length, 1, 'handles 1 requests')
      assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, 'token abc123', 'has the authorization token')
    })
  })
})
