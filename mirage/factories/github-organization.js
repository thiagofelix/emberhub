import { Factory, faker, trait } from 'ember-cli-mirage'

export default Factory.extend({
  login       : i => `organization${i}`,
  avatar_url  : i => `organization${i}-avatar.gif`,
  members_url : i => `https://api.github.com/orgs/organization${i}/members{/member}`,
  repos_url   : i => `https://api.github.com/orgs/organization${i}/repos`,
  node_id     : i => 'node'+i,
  name        : i => `Organization ${i}`,

  // Traits
  withRepositories: trait({
    afterCreate(owner) { server.createList('githubRepository', 2, { owner }) }
  }),

  withMembers: trait({
    afterCreate(organization) { server.createList('githubMember', 2, { organization }) }
  })
})
