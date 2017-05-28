import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';

import GithubAdapter from 'ember-data-github/adapters/github';

import UserFactory from './factories/user';
import OrganizationFactory from './factories/organization';
import RepositoryFactory from './factories/repository';
import BranchFactory from './factories/branch';
import ReleaseFactory from './factories/release';
import BlobFactory from './factories/blob';

import './custom-helpers/assert-github-branch-ok';
import './custom-helpers/assert-github-organization-ok';
import './custom-helpers/assert-github-repository-ok';
import './custom-helpers/assert-github-user-ok';
import './custom-helpers/assert-github-release-ok';
import './custom-helpers/assert-github-blob-ok';

const { merge, run } = Ember;

export default function startApp(attrs) {
  let application;

  let attributes = merge({}, config.APP);
  attributes = merge(attributes, attrs); // use defaults, but you can override;

  run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  UserFactory.defineUser();
  OrganizationFactory.defineOrganization();
  RepositoryFactory.defineRepository();
  BranchFactory.defineBranch();
  ReleaseFactory.defineRelease();
  BlobFactory.defineBlob();

  // Pretender doesn't work with fully qualified URLs
  GithubAdapter.reopen({
    // Caution: overriding ember-data private api
    ajax(url, type, options) {
      url = url.replace('https://api.github.com', '');
      return this._super(url, type, options);
    }
  });

  return application;
}
