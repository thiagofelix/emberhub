import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'

module('Acceptance | github compare', hooks => {
  let store, session

  setupApplicationTest(hooks)
  setupMirage(hooks)

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store')
    session = this.owner.lookup('service:github-session')
  })

  test('finding a comparison without authorization',  async (assert) => {
    server.create('github-compare')

    return store.queryRecord('githubCompare', { repo: 'user1/repository1', base: '1234', 'head': '1234' }).then((compare) => {
      assert.githubCompareOk(compare)
      assert.equal(store.peekAll('githubCompare').get('length'), 1, 'loads 1 compare')
      assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, undefined, 'has no authorization token')
    })
  })

  test('finding a comparison',  async (assert) => {
    server.create('github-compare')
    session.set('githubAccessToken', 'abc123')

    return store.queryRecord('githubCompare', { repo: 'user1/repository1', base: '1234', 'head': '1234' }).then((compare) => {
      assert.githubCompareOk(compare)
      assert.equal(store.peekAll('githubCompare').get('length'), 1, 'loads 1 compare')
      assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, 'token abc123')
    })
  })
})
