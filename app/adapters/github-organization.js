import GithubAdapter from './github'

export default GithubAdapter.extend({
  buildURL(modelName, id, snapshot, requestType) {
    return (requestType === 'findAll')
      ? this._super(...arguments)
      : this._super(...arguments).replace('organizations', 'orgs')
  }
})
