import Model from 'ember-data/model'
import attr from 'ember-data/attr'
import { hasMany } from 'ember-data/relationships'
import { deprecate } from '@ember/application/deprecations'
import { computed } from '@ember/object'

export default Model.extend({
  avatarUrl: attr('string'),
  bio: attr('string'),
  blog: attr('string'),
  company: attr('string'),
  email: attr('string'),
  gravatarId: attr('string'),
  location: attr('string'),
  login: attr('string'),
  name: attr('string'),
  type: attr('string'),

  followersCount: attr('number'),
  following: attr('number'),
  publicGists: attr('number'),
  publicRepos: attr('number'),

  createdAt: attr('date'),
  updatedAt: attr('date'),

  hireable: attr('boolean'),
  siteAdmin: attr('boolean'),

  // Urls
  eventsUrl: attr('string'),
  followersUrl: attr('string'),
  followingUrl: attr('string'),
  gistsUrl: attr('string'),
  htmlUrl: attr('string'),
  organizationsUrl: attr('string'),
  receivedEventsUrl: attr('string'),
  reposUrl: attr('string'),
  starredUrl: attr('string'),
  subscriptionsUrl: attr('string'),
  url: attr('string'),

  // Embedded Objects
  followers: hasMany('github-user'),
  repositories: hasMany('github-repository'),
})
