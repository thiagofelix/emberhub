import Route from '@ember/routing/route'

export default Route.extend({
  beforeModel() {
    if (!this.get('session').get('isAuthenticated')) {
      return this.transitionTo('user.repositories', 'github')
    } else {
      return this.transitionTo('user.repositories', '#')
    }
  }
})
