import Route from '@ember/routing/route'
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin'

export default Route.extend(ApplicationRouteMixin, {
  model() {
    if (this.get('session').get('isAuthenticated')) {
      return this.store.findRecord('github-user', '#')
    }
  },

  sessionAuthenticated() {
    this._super(...arguments)
    this.refresh()
  }
})

