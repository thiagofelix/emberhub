import { camelize } from '@ember/string'
import { computed } from '@ember/object'
import { isNone } from '@ember/utils'
import DS from 'ember-data'
import { pluralize } from 'ember-inflector'
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin'

const { RESTAdapter } = DS

export default RESTAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:github',
  host: 'https://api.github.com',

  pathForType(type) {
    return camelize(pluralize(type.replace('github', '')))
  },

  // Parse Link response header out into an object like:
  //   {
  //     first: 'https://api.github.com/resouce?page=1&per_page=5',
  //     next:  'https://api.github.com/resouce?page=3&per_page=5',
  //     prev:  'https://api.github.com/resouce?page=1&per_page=5',
  //     last:  'https://api.github.com/resouce?page=4&per_page=5',
  //   }
  //
  handleResponse(status, headers, payload, requestData) {
    const linkHeader = headers.Link
    const result = this._super(status, headers, payload, requestData)
    if (isNone(linkHeader)) {
      return result
    }

    const links = linkHeader.split(', ').reduce((memo, link) => {
      let [url, rel] = link.split('; ')

      try {
        [, url] = url.match(/<(.+)>/);
        //eslint-disable-next-line no-useless-escape
        [, rel] = rel.match(/rel=\"(.+)\"/)
      } catch(error) {
        // Any error in parsing should not cause the application to error
        return
      }

      memo[rel] = url
      return memo
    }, {})

    result.links = links
    return result
  }
})
