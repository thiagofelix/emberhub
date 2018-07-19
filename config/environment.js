'use strict'

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'github-app',
    podModulePrefix: 'github-app/pods',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    'ember-cli-mirage': { trackRequests: true },
    torii: {
      sessionServiceName: 'session',
      providers: {
        'github-oauth2': {
          scope: 'repo user',
          apiKey: 'd8404bc68339e2559e04',
          redirectUri: 'http://localhost:4200',
          tokenExchangeUri: 'https://github-exchange-token.herokuapp.com/api/token/test'
        }
      }
    }
  }

  if (environment === 'development') {
    ENV.APP.LOG_RESOLVER = true
    ENV.APP.LOG_ACTIVE_GENERATION = true
    ENV.APP.LOG_TRANSITIONS = true
    ENV.APP.LOG_TRANSITIONS_INTERNAL = true
    ENV.APP.LOG_VIEW_LOOKUPS = true
    ENV['ember-cli-mirage'] = { enabled: false }
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none'

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false
    ENV.APP.LOG_VIEW_LOOKUPS = false

    ENV.APP.rootElement = '#ember-testing'
    ENV.APP.autoboot = false
  }

  if (environment === 'production') {
    ENV.rootURL = '/emberhub'
    Object.assign(ENV.torii.providers['github-oauth2'], {
      apiKey: '46315f963776b8f2578f',
      redirectUri: 'http://www.thiagofelix.com/emberhub/',
      tokenExchangeUri: 'https://github-exchange-token.herokuapp.com/api/token/production'
    })
  }

  return ENV
}
