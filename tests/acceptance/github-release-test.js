import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'

module('Acceptance | github release', hooks => {
  let store, session

  setupApplicationTest(hooks)
  setupMirage(hooks)

  hooks.beforeEach(async function () {
    store = this.owner.lookup('service:store')
    session = this.owner.lookup('service:github-session')
  })

  test('finding a release without authorization',  async (assert) => {
    server.create('github-release')

    return store.queryRecord('githubRelease', { repo: 'user1/repository1', releaseId: '1' }).then((release) => {
      assert.githubReleaseOk(release)
      assert.equal(store.peekAll('githubRelease').get('length'), 1, 'loads 1 release')
      assert.equal(server.pretender.handledRequests.length, 1, 'handles 1 request')
      assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, undefined, 'has no authorization token')
    })
  })

  test('finding a release',  async (assert) => {
    session.set('githubAccessToken', 'abc123')
    server.create('github-release')

    return store.queryRecord('githubRelease', { repo: 'user1/repository0', releaseId: '1' }).then((release) => {
      assert.githubReleaseOk(release)
      assert.equal(store.peekAll('githubRelease').get('length'), 1, 'loads 1 release')
      assert.equal(server.pretender.handledRequests.length, 1, 'handles 1 request')
      assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, 'token abc123', 'has the authorization token')
    })
  })

  test('finding all releases',  async (assert) => {
    session.set('githubAccessToken', 'abc123')
    let repository = server.create('githubRepository')
    server.createList('github-release', 2, { repository })

    return store.query('githubRelease', { repo: 'user1/repository0' }).then((releases) => {
      assert.githubReleaseOk(releases.toArray()[0])
      assert.equal(store.peekAll('githubRelease').get('length'), 2, 'loads 2 releases')
      assert.equal(server.pretender.handledRequests.length, 1, 'handles 1 request')
      assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, 'token abc123', 'has the authorization token')
    })
  })

  test('getting a releases\' author',  async (assert) => {
    session.set('githubAccessToken', 'abc123')
    server.create('github-release')

    return store.queryRecord('githubRelease', { repo: 'user1/repository0', releaseId: '1' }).then((release) => {
      return release.get('author').then(function (user) {
        assert.githubUserOk(user)
        assert.equal(store.peekAll('githubUser').get('length'), 1, 'loads 1 user')
        assert.equal(server.pretender.handledRequests.length, 1, 'handles 1 requests')
        assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, 'token abc123', 'has the authorization token')
      })
    })
  })
})
