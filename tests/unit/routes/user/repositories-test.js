import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | user/repositories', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:user/repositories');
    assert.ok(route);
  });
});
