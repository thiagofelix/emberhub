import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'

module('Acceptance | github blob', hooks => {
  let store

  setupApplicationTest(hooks)
  setupMirage(hooks)

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store')
    server.create('github-blob')
  })

  test('#queryRecord', async function(assert) {
    let blob = await store.queryRecord('github-blob', { repo: 'user1/repo1', sha: '1' })

    assert.githubBlobOk(blob)
    assert.equal(store.peekAll('githubBlob').get('length'), 1)
    assert.equal(server.pretender.handledRequests.length, 1)
    assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, undefined)
  })
})
