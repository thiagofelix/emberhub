import Model from 'ember-data/model'
import attr from 'ember-data/attr'
import { belongsTo } from 'ember-data/relationships'
import { deprecate } from '@ember/application/deprecations'
import { computed } from '@ember/object'

export default Model.extend({
  name: attr('string'),
  url: attr('string'),
  htmlUrl: attr('string'),
  assetsUrl: attr('string'),
  uploadUrl: attr('string'),
  tarballUrl: attr('string'),
  zipballUrl: attr('string'),
  tagName: attr('string'),
  targetCommitish: attr('string'),
  body: attr('string'),
  draft: attr('boolean'),
  prerelease: attr('boolean'),
  createdAt: attr('date'),
  publishedAt: attr('date'),

  author: belongsTo('github-user', { inverse: null }),
  repository: belongsTo('github-repository')
})
