import Model from 'ember-data/model'
import attr from 'ember-data/attr'
import { hasMany } from 'ember-data/relationships'

export default Model.extend({
  login: attr('string'),
  avatarUrl: attr('string'),
  nodeId: attr('string'),
  url: attr('string'),
  description: attr('string'),

  members: hasMany('github-member'),
  repositories: hasMany('github-repository'),
  //TODO: Org Relations public-members, issues, hooks, events
})
