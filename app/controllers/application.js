import Controller from '@ember/controller'
import { inject as service } from '@ember/service'
import config from '../config/environment'

export default Controller.extend({
  session: service(),
  config: config.torii.providers['github-oauth2'],

  actions: {
    login() {
      this.get('session').authenticate('authenticator:torii', 'github')
    },
    logout() {
      this.get('session').invalidate()
    }
  }
})
