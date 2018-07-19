import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'

module('Acceptance | github blob', hooks => {
  let store, session

  setupApplicationTest(hooks)
  setupMirage(hooks)

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store')
    session = this.owner.lookup('service:github-session')

    server.create('github-branch')
  })

  test('finding a branch without authorization', async (assert) => {
    let branch = await store.findRecord('githubBranch', 'User1/Repository1/branches/branch0')
    assert.githubBranchOk(branch)
    assert.equal(store.peekAll('githubBranch').get('length'), 1)
    assert.equal(server.pretender.handledRequests.length, 1)
    assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, undefined)
  })

  test('finding a branch', async (assert) => {
    session.set('githubAccessToken', 'abc123')

    let branch = await store.findRecord('githubBranch', 'user1/repository1/branches/branch0')
    assert.githubBranchOk(branch)
    assert.equal(store.peekAll('githubBranch').get('length'), 1)
    assert.equal(server.pretender.handledRequests.length, 1)
    assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, 'token abc123')
  })
})
