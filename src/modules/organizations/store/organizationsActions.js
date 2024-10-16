/**
 * organizations store actions
 *
 * @summary organizations store actions
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-11-03 22:04:06
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import axios from 'axios';

import { urlRewrite } from '@/factories/apiFactory';
import {
  extractBodyIntoUrl,
  getSOLRStringForElements,
} from '@/factories/stringFactory';

import {
  ACTION_GET_ORGANIZATIONS,
  ACTION_USER_ORGANIZATION_IDS,
  ACTION_GET_ORGANIZATION,
  GET_ORGANIZATIONS,
  GET_ORGANIZATIONS_ERROR,
  GET_ORGANIZATIONS_SUCCESS,
  USER_GET_ORGANIZATION_IDS,
  USER_GET_ORGANIZATION_IDS_ERROR,
  USER_GET_ORGANIZATION_IDS_SUCCESS,
  USER_GET_ORGANIZATIONS,
  USER_GET_ORGANIZATIONS_ERROR,
  USER_GET_ORGANIZATIONS_RESET,
  USER_GET_ORGANIZATIONS_SUCCESS,
  GET_ALL_ORGANIZATIONS_IDS,
  GET_ALL_ORGANIZATIONS_IDS_SUCCESS,
  GET_ALL_ORGANIZATIONS_IDS_ERROR,
  GET_ALL_ORGANIZATIONS,
  GET_ALL_ORGANIZATIONS_SUCCESS,
  GET_ALL_ORGANIZATIONS_ERROR,
  USER_GET_ORGANIZATIONS_SEARCH,
  ACTION_USER_GET_ORGANIZATIONS_SEARCH,
  USER_GET_ORGANIZATIONS_SEARCH_SUCCESS,
  USER_GET_ORGANIZATIONS_SEARCH_RECURSIVE,
  USER_GET_ORGANIZATIONS_SEARCH_RECURSIVE_SUCCESS,
} from './organizationsMutationsConsts';


const useTestdata = import.meta.env?.VITE_USE_TESTDATA === 'true';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/action/';
const API_ROOT = import.meta.env.VITE_API_ROOT;

function getOrganizationRequestArray(ids, body = {}) {
  const actionUrl = ACTION_GET_ORGANIZATION();

  const requests = [];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];

    let url = extractBodyIntoUrl(actionUrl, {
      id,
      ...body,
    });

    url = urlRewrite(url, API_BASE, API_ROOT);

    if (useTestdata) {
      // ignore the parameters for testdata, because it's directly a file
      url = urlRewrite(actionUrl, API_BASE, API_ROOT);
    }

    requests.push(axios.get(url));
  }

  return requests;
}

export default {
  async [GET_ALL_ORGANIZATIONS_IDS] ({commit}) {
    commit(GET_ALL_ORGANIZATIONS_IDS);

    const actionUrl = ACTION_GET_ORGANIZATIONS();
    let url = extractBodyIntoUrl(actionUrl, { limit: 1000 });
    url = urlRewrite(url, API_BASE, API_ROOT);

    await axios.get(url)
      .then(response => {
        commit(GET_ALL_ORGANIZATIONS_IDS_SUCCESS, response.data.result);
      })
      .catch(reason => {
        commit(GET_ALL_ORGANIZATIONS_IDS_ERROR, reason);
      });
  },
  async [GET_ALL_ORGANIZATIONS] ({commit}, ids) {
    commit(GET_ALL_ORGANIZATIONS);


    const requests = getOrganizationRequestArray(ids, {
      include_datasets: true,
    });

    await Promise.all(requests)
      .then((responses) => {
        for (let i = 0; i < responses.length; i++) {
          const response = responses[i];
          commit(GET_ALL_ORGANIZATIONS_SUCCESS, response.data.result);
        }
      })
      .catch((error) => {
        commit(GET_ALL_ORGANIZATIONS_ERROR, error);
      });

  },
  async [GET_ORGANIZATIONS] ({ commit, dispatch }) {

    // organization_list has a limitation of returning 25 when using the all_fields=true,
    // even that the CKAN docu says otherwise, it doesn't work
    // therefor we need to get all ids first and them each organization with one call
    commit(GET_ORGANIZATIONS);

    await dispatch(GET_ALL_ORGANIZATIONS_IDS);


    const ids = this.state.organizations.organizationIds;

    // always call the USER_GET_ORGANIZATIONS action because it resolves the store & state also when userOrganizationIds is empty
    await dispatch(GET_ALL_ORGANIZATIONS, ids);

    if (this.state.organizations.error) {
      commit(GET_ORGANIZATIONS_ERROR);
    } else {
      commit(GET_ORGANIZATIONS_SUCCESS);
    }

  },
  async [USER_GET_ORGANIZATION_IDS]({ commit }, userId) {
    commit(USER_GET_ORGANIZATION_IDS);

    const actionUrl = ACTION_USER_ORGANIZATION_IDS();
    let url = extractBodyIntoUrl(actionUrl, { id: userId });
    url = urlRewrite(url, API_BASE, API_ROOT);

    if (useTestdata) {
      // ignore the parameters for testdata, because it's directly a file
      url = urlRewrite(actionUrl, API_BASE, API_ROOT);
    }

    await axios.get(url)
      .then((response) => {
        commit(USER_GET_ORGANIZATION_IDS_SUCCESS, response.data.result);
      })
      .catch((error) => {
        commit(USER_GET_ORGANIZATION_IDS_ERROR, error);

      });
  },
  async [USER_GET_ORGANIZATIONS]({ commit }, ids) {

    commit(USER_GET_ORGANIZATIONS);

    if (!ids || ids.length <= 0) {
      commit(USER_GET_ORGANIZATIONS_RESET);
      return;
    }

    // don't use this.state.organizations.organizations to filter the userOrganizations
    // always call the backend, because unpublished datasets won't be part of the orgaizations list
    // which was loaded from a "public viewpoint"

    const requests = getOrganizationRequestArray(ids, {
      include_datasets: true,
      include_tags: true,
    });

    await Promise.all(requests)
      .then((responses) => {
        for (let i = 0; i < responses.length; i++) {
          const response = responses[i];
          commit(USER_GET_ORGANIZATIONS_SUCCESS, response.data.result);
        }
      })
      .catch((error) => {
        commit(USER_GET_ORGANIZATIONS_ERROR, error);
      });
  },
  async [USER_GET_ORGANIZATIONS_SEARCH]({ commit }, ids) {
    commit(USER_GET_ORGANIZATIONS);

    if (!ids || ids.length <= 0) {
      commit(USER_GET_ORGANIZATIONS_RESET);
      return;
    }

    const actionUrl = ACTION_USER_GET_ORGANIZATIONS_SEARCH();
    const rows = this.state.organizations.organizationsDatasetsLimit;

    const idQuery = getSOLRStringForElements('owner_org', ids);

    let url = extractBodyIntoUrl(actionUrl, {
      q: idQuery,
      include_private: true,
      include_drafts: true,
      rows,
    });

    url = urlRewrite(url, API_BASE, API_ROOT);

    await axios.get(url)
      .then((response) => {
        commit(USER_GET_ORGANIZATIONS_SEARCH_SUCCESS, response.data.result.results);
      })
      .catch((error) => {
        commit(USER_GET_ORGANIZATIONS_ERROR, error);
      });

  },
  async [USER_GET_ORGANIZATIONS_SEARCH_RECURSIVE]({ dispatch, commit }, ids) {
    commit(USER_GET_ORGANIZATIONS);

    const actionUrl = ACTION_USER_GET_ORGANIZATIONS_SEARCH();
    const rows = this.state.organizations.organizationsDatasetsLimit;
    const preOffset = this.state.organizations.userOrgaDatasetOffset;

    const idQuery = getSOLRStringForElements('owner_org', ids);

    let url = extractBodyIntoUrl(actionUrl, {
      q: idQuery,
      include_private: true,
      include_drafts: true,
      rows,
      start: preOffset,
    });

    url = urlRewrite(url, API_BASE, API_ROOT);

    await axios.get(url)
      .then((response) => {
        commit(USER_GET_ORGANIZATIONS_SEARCH_RECURSIVE, response.data.result);
      })
      .catch((error) => {
        commit(USER_GET_ORGANIZATIONS_ERROR, error);
      });

    if (this.state.organizations.userOrganizationError) {
      return;
    }

    const afterOffset = this.state.organizations.userOrgaDatasetOffset;
    const totalAvailable = this.state.organizations.userOrgaDatasetTotal;

    if (afterOffset < totalAvailable) {
      dispatch(USER_GET_ORGANIZATIONS_SEARCH_RECURSIVE, ids);
    } else {
      commit(USER_GET_ORGANIZATIONS_SEARCH_RECURSIVE_SUCCESS);
    }
  },
};
