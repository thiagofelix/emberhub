import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'

module('Acceptance | github repository', hooks => {
  let store, session

  setupApplicationTest(hooks)
  setupMirage(hooks)

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store')
    session = this.owner.lookup('service:github-session')
    server.create('github-repository', {
      owner: server.create('github-user')
    }, 'withBranches')
  })

  test('finding a repository without authorization',  async (assert) => {
    return store.findRecord('githubRepository', 'user0/repository0').then((repository) => {
      assert.githubRepositoryOk(repository)
      assert.equal(store.peekAll('githubRepository').get('length'), 1, 'loads 1 repository')
      assert.equal(server.pretender.handledRequests.length, 1, 'handles 1 request')
      assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, undefined, 'has no authorization token')
    })
  })

  test('finding a repository by name',  async (assert) => {
    session.set('githubAccessToken', 'abc123')

    return store.findRecord('githubRepository', 'user0/repository0').then((repository) => {
      assert.githubRepositoryOk(repository)
      assert.equal(store.peekAll('githubRepository').get('length'), 1, 'loads 1 repository')
      assert.equal(server.pretender.handledRequests.length, 1, 'handles 1 request')
      assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, 'token abc123', 'has the authorization token')
    })
  })

  test('finding a repository by id',  async (assert) => {
    session.set('githubAccessToken', 'abc123')

    return store.findRecord('githubRepository', 1).then((repository) => {
      assert.githubRepositoryOk(repository)
      assert.equal(store.peekAll('githubRepository').get('length'), 1, 'loads 1 repository')
      assert.equal(server.pretender.handledRequests.length, 1, 'handles 1 request')
      assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, 'token abc123', 'has the authorization token')
    })
  })

  test('finding all repositories',  async (assert) => {
    let owner = server.create('github-user')
    server.create('github-repository', { owner })
    session.set('githubAccessToken', 'abc123')

    return store.findAll('githubRepository').then(function (repositories) {
      assert.equal(repositories.get('length'), 2, 'loads 2 repositories')
      assert.githubRepositoryOk(repositories.toArray()[0])
      assert.equal(server.pretender.handledRequests.length, 1, 'handles 1 request')
      assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, 'token abc123', 'has the authorization token')
    })
  })

  test('getting a repository\'s owner',  async (assert) => {
    session.set('githubAccessToken', 'abc123')

    return store.findRecord('githubRepository', 'user0/repository0').then((repository) => {
      return repository.get('owner').then(function (owner) {
        assert.githubUserOk(owner)
        assert.equal(server.pretender.handledRequests.length, 1, 'handles 1 request1')
        assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, 'token abc123', 'has the authorization token')
      })
    })
  })

  test('getting a repository\'s default branch',  async (assert) => {
    session.set('githubAccessToken', 'abc123')

    return store.findRecord('githubRepository', 'user0/repository0').then((repository) => {
      return repository.get('defaultBranch').then(function (branch) {
        assert.githubBranchOk(branch)
        assert.equal(server.pretender.handledRequests.length, 2, 'handles 2 requests')
        assert.equal(server.pretender.handledRequests[0].requestHeaders.Authorization, 'token abc123', 'has the authorization token')
      })
    })
  })

  test('finding a repository\'s branches',  async (assert) => {
    session.set('githubAccessToken', 'abc123')

    return store.findRecord('githubRepository', 'user0/repository0').then((repository) => {
      return repository.get('branches').then(function (branches) {
        assert.equal(branches.get('length'), 2, 'loads 2 branches')
        assert.githubBranchOk(branches.toArray()[0])
        assert.equal(server.pretender.handledRequests.length, 2, 'handles 2 requests')
        assert.equal(server.pretender.handledRequests[1].requestHeaders.Authorization, 'token abc123', 'has the authorization token')
      })
    })
  })

  test('finding a repository\'s releases',  async (assert) => {
    session.set('githubAccessToken', 'abc123')
    server.create('github-repository', {
      owner: server.create('github-user')
    }, 'withReleases')

    return store.findRecord('githubRepository', 'user1/repository1').then((repository) => {
      return repository.get('releases').then(function (releases) {
        assert.equal(releases.get('length'), 2, 'loads 2 releases')
        assert.githubReleaseOk(releases.toArray()[0])
        assert.equal(server.pretender.handledRequests.length, 2, 'handles 2 requests')
        assert.equal(server.pretender.handledRequests[1].requestHeaders.Authorization, 'token abc123', 'has the authorization token')
      })
    })
  })

  test('finding a repository\'s pull requests',  async (assert) => {
    session.set('githubAccessToken', 'abc123')
    server.create('github-repository', {
      owner: server.create('github-user')
    }, 'withPulls')

    return store.findRecord('githubRepository', 'user1/repository1').then((repository) => {
      return repository.get('pulls').then(function (pulls) {
        assert.equal(pulls.get('length'), 2, 'loads 2 pull requests')
        assert.githubPullOk(pulls.toArray()[0])
        assert.equal(server.pretender.handledRequests.length, 2, 'handles 2 requests')
        assert.equal(server.pretender.handledRequests[1].requestHeaders.Authorization, 'token abc123', 'has the authorization token')
      })
    })
  })
})
