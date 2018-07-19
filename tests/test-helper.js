import Application from '../app'
import config from '../config/environment'
import { setApplication } from '@ember/test-helpers'
import { start } from 'ember-qunit'

import './helpers/custom-helpers/assert-github-branch-ok'
import './helpers/custom-helpers/assert-github-organization-ok'
import './helpers/custom-helpers/assert-github-repository-ok'
import './helpers/custom-helpers/assert-github-user-ok'
import './helpers/custom-helpers/assert-github-release-ok'
import './helpers/custom-helpers/assert-github-blob-ok'
import './helpers/custom-helpers/assert-github-tree-ok'
import './helpers/custom-helpers/assert-github-pull-ok'
import './helpers/custom-helpers/assert-github-member-ok'
import './helpers/custom-helpers/assert-github-compare-ok'
import './helpers/custom-helpers/assert-github-repository-contents-ok'

setApplication(Application.create(config.APP))

start()
