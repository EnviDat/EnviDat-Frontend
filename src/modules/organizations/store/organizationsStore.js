/**
 * projects store module
 *
 * @summary projects store
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2019-10-23 16:41:03
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import actions from './organizationsActions';
import mutations from './organizationsMutations';

const organizationsState = {
  loading: false,
  organizationIds: [],
  organizations: [],
  error: null,
  organizationsPageBackRoute: null,
  userOrganizationLoading: false,
  userOrganizationIds: [],
  userOrganizations: [],
  userOrganizationError: null,
  organizationsDatasetsLimit: 10,
  userOrgaDatasetTotal: 0,
  userOrgaDatasetOffset: 0,
};

export const organizations = {
  namespaced: true,
  state: organizationsState,
  getters: {},
  mutations,
  actions,
};
