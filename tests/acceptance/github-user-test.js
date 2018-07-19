import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'

module('Acceptance | github user', hooks => {
  let store, session

  setupApplicationTest(hooks)
  setupMirage(hooks)

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store')
    session = this.owner.lookup('service:github-session')
  })

  test('finding a user without authorization', function (assert) {
    server.create('github-user')

    return store.findRecord('githubUser', 'User1').then((user) => {
      assert.githubUserOk(user)
      assert.equal(store.peekAll('githubUser').get('length'), 1)
      assert.equal(server.pretender.handledRequests.length, 1)
      assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, undefined)
    })
  })

  test('finding a user by login', function (assert) {
    server.create('github-user')
    session.set('githubAccessToken', 'abc123')

    return store.findRecord('githubUser', 'user1').then((user) => {
      assert.githubUserOk(user)
      assert.equal(store.peekAll('githubUser').get('length'), 1)
      assert.equal(server.pretender.handledRequests.length, 1)
      assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, 'token abc123')
    })
  })

  test('finding a user by id', function (assert) {
    server.create('github-user')
    session.set('githubAccessToken', 'abc123')

    return store.findRecord('githubUser', 1).then((user) => {
      assert.githubUserOk(user)
      assert.equal(store.peekAll('githubUser').get('length'), 1)
      assert.equal(server.pretender.handledRequests.length, 1)
      assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, 'token abc123')
    })
  })

  test('finding all users', async function (assert) {
    server.createList('github-user', 2)
    session.set('githubAccessToken', 'abc123')

    let users = await store.findAll('githubUser')
    assert.equal(users.get('length'), 2)
    assert.githubUserOk(users.toArray()[0])
    assert.equal(server.pretender.handledRequests.length, 1)
    assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, 'token abc123')
  })

  test('finding a user\'s repositories', function (assert) {
    server.create('githubUser', 'withRepositories')
    session.set('githubAccessToken', 'abc123')

    return store.findRecord('githubUser', 'user1').then((user) => {
      return user.get('repositories').then((repositories) => {
        assert.equal(repositories.get('length'), 2)
        assert.githubRepositoryOk(repositories.toArray()[0])
        assert.equal(server.pretender.handledRequests.length, 2)
        assert.equal(server.pretender.handledRequests[1].requestHeaders.Authorization, 'token abc123')
      })
    })
  })
})
