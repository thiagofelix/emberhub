import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'

module('Acceptance | github tree', hooks => {
  let store

  setupApplicationTest(hooks)
  setupMirage(hooks)

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store')
  })

  test('retrieving a tree', function (assert) {
    server.create('githubTree')

    return store
      .queryRecord('github-tree', { repo: 'user1/repo1', sha: '1' })
      .then(tree => {
        assert.githubTreeOk(tree)
        assert.equal(store.peekAll('githubTree').get('length'), 1)
        assert.equal(server.pretender.handledRequests.length, 1)
        assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, undefined)
      })
  })

  test('retrieving a tree recursively', function (assert) {
    server.create('githubTree')

    return store
      .queryRecord('github-tree', { repo: 'user1/repo1', sha: '1', recursive: true })
      .then(tree => {
        assert.githubTreeOk(tree)
        assert.equal(store.peekAll('githubTree').get('length'), 1)
        assert.equal(server.pretender.handledRequests.length, 1)
        assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, undefined)
        assert.ok(server.pretender.handledRequests[0].queryParams)
        assert.ok(server.pretender.handledRequests[0].queryParams.recursive)
        assert.equal(server.pretender.handledRequests[0].queryParams.recursive, 1)
      })
  })
})
