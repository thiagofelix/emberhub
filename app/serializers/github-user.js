import GithubSerializer from './github'

export default GithubSerializer.extend({
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    if (id === '#') {
      payload.repos_url = payload.repos_url.replace(`users/${payload.login}`, 'user')
    }
    return this._super(store, primaryModelClass, payload, id, requestType)
  },

  normalize(modelClass, resourceHash, prop) {
    resourceHash.id = resourceHash.recordId || resourceHash.login
    resourceHash.links = {
      repositories: resourceHash.repos_url,
      followers: resourceHash.followers_url
    }

    resourceHash.followers_count = resourceHash.followers
    delete resourceHash.followers

    return this._super(modelClass, resourceHash, prop)
  }
})
