import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    let user = this.modelFor('user')
    this.replaceWith('user.repositories', user.get('login'))
  }
});
