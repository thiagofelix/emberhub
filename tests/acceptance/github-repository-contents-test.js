import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'

module('Acceptance | github content', hooks => {
  setupApplicationTest(hooks)
  setupMirage(hooks)

  test('retrieving github repository contents',  async function (assert) {
    server.create('githubRepositoryContents', { name: 'app.json' })

    let store = this.owner.lookup('service:store')
    let content = await store.queryRecord('github-repository-contents', { repo: 'jmar910/test-repo-yay', file: 'app.json' })
    assert.githubRepositoryContentsOk(content)
    assert.equal(store.peekAll('githubRepositoryContents').get('length'), 1, 'loads 1 repository contents')
    assert.equal(server.pretender.handledRequests.length, 1)
    assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, undefined)
  })
})
