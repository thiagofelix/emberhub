import GithubSerializer from './github'
import DS from 'ember-data'

const { EmbeddedRecordsMixin } = DS

export default GithubSerializer.extend(EmbeddedRecordsMixin, {
  attrs: {
    author: { embedded: 'always' }
  }
})
