import GitHubSerializer from './github'

export default GitHubSerializer.extend({
  extractId(modelClass, resourceHash) {
    return resourceHash.url
  },

  modelNameFromPayloadKey() {
    return 'github-repository-contents'
  }
})
