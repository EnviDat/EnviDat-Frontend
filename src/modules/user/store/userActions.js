/**
 * user store actions
 *
 * @summary user store actions
 * @author Dominik Haas-Artho
 *
 * Created at     : 2020-07-14 16:51:52
 * Last modified  : 2021-08-18 10:48:15
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import axios from 'axios';
import { urlRewrite } from '@/factories/apiFactory';

import {
  convertJSON,
  getBackendJSON,
  getFrontendJSON,
  toSnakeCase,
} from '@/factories/mappingFactory';

import { extractBodyIntoUrl } from '@/factories/stringFactory';

import {
  createDates,
  createLocation,
  enhanceTags,
} from '@/factories/metaDataFactory';

import {
  EDITMETADATA_AUTHOR,
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_CUSTOMFIELDS,
  EDITMETADATA_DATA_GEO,
  EDITMETADATA_DATA_INFO,
  EDITMETADATA_DATA_RESOURCES,
  EDITMETADATA_KEYWORDS,
  EDITMETADATA_MAIN_DESCRIPTION,
  EDITMETADATA_MAIN_HEADER,
  EDITMETADATA_ORGANIZATION,
  EDITMETADATA_PUBLICATION_INFO,
  EDITMETADATA_RELATED_DATASETS,
  EDITMETADATA_RELATED_PUBLICATIONS,
} from '@/factories/eventBus';

import { getDataCredit } from '@/factories/authorFactory';
import {
  LOAD_METADATA_CONTENT_BY_ID,
  METADATA_NAMESPACE,
} from '@/store/metadataMutationsConsts';

import {
  ACTION_METADATA_EDITING_PATCH_DATASET,
  ACTION_METADATA_EDITING_PATCH_DATASET_ORGANIZATION,
  ACTION_USER_ORGANIZATION_IDS,
  ACTION_USER_ORGANIZATIONS,
  ACTION_USER_ORGANIZATIONS_DATASETS, FETCH_USER_DATA,
  METADATA_EDITING_LOAD_DATASET,
  METADATA_EDITING_PATCH_DATASET_OBJECT,
  METADATA_EDITING_PATCH_DATASET_OBJECT_ERROR,
  METADATA_EDITING_PATCH_DATASET_OBJECT_SUCCESS,
  METADATA_EDITING_PATCH_DATASET_ORGANIZATION,
  METADATA_EDITING_PATCH_DATASET_PROPERTY,
  METADATA_EDITING_PATCH_DATASET_PROPERTY_ERROR,
  METADATA_EDITING_PATCH_DATASET_PROPERTY_SUCCESS,
  METADATA_EDITING_SAVE_AUTHOR,
  METADATA_EDITING_SAVE_AUTHOR_SUCCESS,
  METADATA_EDITING_SAVE_RESOURCE,
  METADATA_EDITING_SAVE_RESOURCE_SUCCESS,
  UPDATE_METADATA_EDITING,
  USER_GET_ORGANIZATION_IDS,
  USER_GET_ORGANIZATION_IDS_ERROR,
  USER_GET_ORGANIZATION_IDS_SUCCESS,
  USER_GET_ORGANIZATIONS,
  USER_GET_ORGANIZATIONS_DATASETS,
  USER_GET_ORGANIZATIONS_DATASETS_ERROR,
  USER_GET_ORGANIZATIONS_DATASETS_SUCCESS,
  USER_GET_ORGANIZATIONS_ERROR,
  USER_GET_ORGANIZATIONS_SUCCESS,
  USER_NAMESPACE,
} from './userMutationsConsts';

// don't use an api base url or proxy when using testdata
let API_BASE = '';
let ENVIDAT_PROXY = '';

const useTestdata = process.env.VUE_APP_USE_TESTDATA === 'true';

if (!useTestdata) {
  API_BASE = '/api/action/';
  ENVIDAT_PROXY = process.env.VUE_APP_ENVIDAT_PROXY;
}

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

function commitEditingData(commit, eventName, data) {
  commit(
    `${USER_NAMESPACE}/${UPDATE_METADATA_EDITING}`,
    {
      object: eventName,
      data,
    },
    { root: true },
  );
}

export function populateEditingComponents(commit, metadataRecord, authorsMap, categoryCards) {

  const snakeCaseJSON = convertJSON(metadataRecord, false);

  let stepKey = EDITMETADATA_MAIN_HEADER;
  const headerData = getFrontendJSON(stepKey, snakeCaseJSON);

  stepKey = EDITMETADATA_MAIN_DESCRIPTION;
  const descriptionData = getFrontendJSON(stepKey, snakeCaseJSON);
  commitEditingData(commit, stepKey, descriptionData);

  stepKey = EDITMETADATA_KEYWORDS;
  const enhanceDataset = enhanceTags(snakeCaseJSON, categoryCards);
  const keywordsData = getFrontendJSON(stepKey, enhanceDataset);

  const enhancedKeywords = {
    ...keywordsData,
    metadataCardTitle: headerData.metadataTitle,
    metadataCardSubtitle: descriptionData.description,
  }
  commitEditingData(commit, stepKey, enhancedKeywords);

  stepKey = EDITMETADATA_AUTHOR_LIST;
  // const backendAuthors = getFrontendJSON(stepKey, snakeCaseJSON);

  const authors = []
  snakeCaseJSON.author.forEach((bAuthor) => {

    const author = getFrontendJSON(EDITMETADATA_AUTHOR, bAuthor);
    author.dataCredit = getDataCredit(bAuthor);

    authors.push(author);
  })
  // const authors = createAuthors({ author: backendAuthors.authors });
  // const authors = getFullAuthorsFromDataset(authorsMap,{ author: backendAuthors.authors });

  commitEditingData(commit, stepKey, {
    authors,
  });


  // Stepper 2: Data Resources, Info, Location
  // const resources = createResources(metadataRecord).resources;

  stepKey = EDITMETADATA_DATA_RESOURCES;
  const resourceData = getFrontendJSON(stepKey, snakeCaseJSON);
  commitEditingData(commit, stepKey, resourceData);

  stepKey = EDITMETADATA_DATA_INFO;
  const dateInfoData = getFrontendJSON(stepKey, snakeCaseJSON);

  const metadataDates = createDates({ date: dateInfoData.dates });

  const dataInfo = {
    // for now only use the title, check how to choose it in the
    // edit component
    dataLicenseId: dateInfoData.dataLicenseId,
    ...metadataDates,
  };

  commitEditingData(commit, stepKey, dataInfo);


  stepKey = EDITMETADATA_DATA_GEO;
  const geoData = getFrontendJSON(stepKey, snakeCaseJSON);

  const location = createLocation({
    ...snakeCaseJSON,
    // don't pass location directly as property because it would be
    // returned without the parsing of geo spatial infos
    spatial: geoData.location.geomCollection,
  });

  commitEditingData(commit, stepKey, {
    location,
  });

  stepKey = EDITMETADATA_RELATED_PUBLICATIONS;
  const rPublicationData = getFrontendJSON(stepKey, snakeCaseJSON);
  commitEditingData(commit, stepKey, rPublicationData);

  stepKey = EDITMETADATA_RELATED_DATASETS;
  const rDatasetsData = getFrontendJSON(stepKey, snakeCaseJSON);
  commitEditingData(commit, stepKey, rDatasetsData);

  stepKey = EDITMETADATA_CUSTOMFIELDS;
  const customFieldsData = getFrontendJSON(stepKey, snakeCaseJSON);
  commitEditingData(commit, stepKey, customFieldsData);


  stepKey = EDITMETADATA_PUBLICATION_INFO;
  const publicationData = getFrontendJSON(stepKey, snakeCaseJSON);
  commitEditingData(commit, stepKey, publicationData);

  stepKey = EDITMETADATA_ORGANIZATION;
  const organizationData = getFrontendJSON(stepKey, snakeCaseJSON);
  commitEditingData(commit, stepKey, organizationData);


  stepKey = EDITMETADATA_MAIN_HEADER;

  const enhanceHeader = {
    ...headerData,
    keywords: keywordsData.keywords,
    authors,
    dataLicense: dateInfoData.dataLicenseTitle,
    doi: publicationData.doi,
  };

  commitEditingData(commit, stepKey, enhanceHeader);

}

function cleanAuthorsForBackend(authors) {

  const bAuthors = [];
  for (let i = 0; i < authors.length; i++) {

    // work with local copy here to avoid to changing the vuex state directly
    const author = { ...authors[i] };

    if (author.dataCredit) {
      const keys = Object.keys(author.dataCredit);

      const dataCreditsArray = [];

      for (let j = 0; j < keys.length; j++) {
        const key = keys[j];
        dataCreditsArray.push(key);
      }

      author.dataCredit = dataCreditsArray;
    }

    const bAuthor = getBackendJSON(EDITMETADATA_AUTHOR, author);

    bAuthors.push(bAuthor);
  }

  return bAuthors;
}


const dataNeedsStringify = [
  EDITMETADATA_MAIN_HEADER,
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_DATA_INFO,
  EDITMETADATA_DATA_GEO,
  EDITMETADATA_PUBLICATION_INFO,
];

function mapBackendData(stepKey, frontendData) {

  if (stepKey === EDITMETADATA_AUTHOR_LIST) {
    frontendData.authors = cleanAuthorsForBackend(frontendData.authors);
  }

  let backendData = getBackendJSON(stepKey, frontendData);

  if (dataNeedsStringify.includes(stepKey)) {
    backendData = convertJSON(backendData, true);
  }

  return backendData;
}


/*
function mapFrontendData(stepKey, backendData) {

  const snakeCaseJSON = convertJSON(backendData, false);

 return getFrontendJSON(stepKey, snakeCaseJSON);
}
*/

export default {
  async [FETCH_USER_DATA]({ commit }, payload) {
    commit(payload.mutation);

    const body = payload.body || {};

    // unpack the action because it might be wrapped to provide a test url
    const actionUrl = typeof (payload.action) === 'function' ? payload.action() : payload.action;

    let url = extractBodyIntoUrl(actionUrl, body);
    url = urlRewrite(url, API_BASE, ENVIDAT_PROXY);

    // if the url is directly to a file it has to be a get call
    // const method = url.includes('.json') ? 'get' : 'post';

    await axios.get(url)
      // await axios({ method, url, body })
      .then((response) => {
        if (payload.commit) {
          commit(`${payload.mutation}_SUCCESS`, response.data.result);
        }
      })
      .catch((error) => {
        commit(`${payload.mutation}_ERROR`, error);
      });
  },
  async [USER_GET_ORGANIZATION_IDS]({ dispatch, commit }, userId) {
    commit(USER_GET_ORGANIZATION_IDS);

    const actionUrl = ACTION_USER_ORGANIZATION_IDS();
    let url = extractBodyIntoUrl(actionUrl, { id: userId });
    url = urlRewrite(url, API_BASE, ENVIDAT_PROXY);

    if (useTestdata) {
      // ignore the parameters for testdata, because it's directly a file
      url = urlRewrite(actionUrl, API_BASE, ENVIDAT_PROXY);
    }

    await axios
      .get(url)
      .then((response) => {
        commit(USER_GET_ORGANIZATION_IDS_SUCCESS, response.data.result);

        const organizations = this.state.user.userOrganizationNames;
        if (organizations?.length > 0) {
          dispatch(USER_GET_ORGANIZATIONS_DATASETS, organizations);
        }
      })
      .catch((error) => {
        commit(USER_GET_ORGANIZATION_IDS_ERROR, error);
      });
  },
  async [USER_GET_ORGANIZATIONS]({ commit }, ids) {
    commit(USER_GET_ORGANIZATIONS);

    const actionUrl = ACTION_USER_ORGANIZATIONS();

    const requests = [];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];

      let url = extractBodyIntoUrl(actionUrl, {
        id,
        include_datasets: true,
        include_tags: true,
      });

      url = urlRewrite(url, API_BASE, ENVIDAT_PROXY);

      if (useTestdata) {
        // ignore the parameters for testdata, because it's directly a file
        url = urlRewrite(actionUrl, API_BASE, ENVIDAT_PROXY);
      }

      requests.push(axios.get(url));
    }

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
  async [USER_GET_ORGANIZATIONS_DATASETS]({ commit }, organizations) {
    commit(USER_GET_ORGANIZATIONS_DATASETS);

    const actionUrl = ACTION_USER_ORGANIZATIONS_DATASETS();
    const limit = this.state.user.userRecentOrgaDatasetsLimit;

    const requests = [];
    for (let i = 0; i < organizations.length; i++) {
      const name = organizations[i];

      let url = extractBodyIntoUrl(actionUrl, {
        q: `organization:${name}`,
        include_private: true,
        include_drafts: true,
        rows: limit,
      });

      url = urlRewrite(url, API_BASE, ENVIDAT_PROXY);

      if (useTestdata) {
        // ignore the parameters for testdata, because it's directly a file
        url = urlRewrite(actionUrl, API_BASE, ENVIDAT_PROXY);
      }

      requests.push(axios.get(url));
    }

    await Promise.all(requests)
      .then((responses) => {
        for (let i = 0; i < responses.length; i++) {
          const response = responses[i];
          if (useTestdata && typeof response.data === 'string') {
            response.data = JSON.parse(response.data);
          }
          commit(USER_GET_ORGANIZATIONS_DATASETS_SUCCESS, response.data.result);
        }
      })
      .catch((error) => {
        commit(USER_GET_ORGANIZATIONS_DATASETS_ERROR, error);
      });
  },
  // eslint-disable-next-line no-unused-vars
  async [METADATA_EDITING_SAVE_RESOURCE]({ commit }, resource) {
    commit(METADATA_EDITING_SAVE_RESOURCE, resource);

    await sleep(2000);

    commit(METADATA_EDITING_SAVE_RESOURCE_SUCCESS, resource);
  },
  async [METADATA_EDITING_SAVE_AUTHOR]({ commit }, author) {
    commit(METADATA_EDITING_SAVE_AUTHOR, author);

    await sleep(2000);

    commit(METADATA_EDITING_SAVE_AUTHOR_SUCCESS, author);
  },
  async [METADATA_EDITING_LOAD_DATASET]({ commit, dispatch }, metadataId) {
    await dispatch(
      `${METADATA_NAMESPACE}/${LOAD_METADATA_CONTENT_BY_ID}`,
      metadataId,
      { root: true },
    );

    const currentEntry = this.getters[`${METADATA_NAMESPACE}/currentMetadataContent`];

    if (currentEntry) {
      const authorsMap = this.getters[`${METADATA_NAMESPACE}/authorsMap`];
      const categoryCards = this.state.categoryCards;

      populateEditingComponents(commit, currentEntry, authorsMap, categoryCards);
    }
  },
  async [METADATA_EDITING_PATCH_DATASET_PROPERTY]({ commit }, { stepKey, id, property, value}) {

    commit(METADATA_EDITING_PATCH_DATASET_PROPERTY, stepKey);

    // eslint-disable-next-line no-unreachable
    const apiKey = this.state.userSignIn.user?.apikey || null;

    const actionUrl = ACTION_METADATA_EDITING_PATCH_DATASET();
    let url = actionUrl;
    url = urlRewrite(url, API_BASE, ENVIDAT_PROXY);

    if (useTestdata) {
      // ignore the parameters for testdata, because it's directly a file
      url = urlRewrite(actionUrl, API_BASE, ENVIDAT_PROXY);
    }
    const snakeCaseProperty = toSnakeCase(property);

    await axios.post(url, {
      id,
      [snakeCaseProperty]: value,
      },
      {
        headers: {
          Authorization: apiKey,
        },
      })
      .then((response) => {
        commit(METADATA_EDITING_PATCH_DATASET_PROPERTY_SUCCESS, {
          stepKey,
          message: `${property} saved ${response.data.result[property]}`,
        });
      })
      .catch((reason) => {
        commit(METADATA_EDITING_PATCH_DATASET_PROPERTY_ERROR, {
          stepKey,
          reason,
        });
      });
  },
  async [METADATA_EDITING_PATCH_DATASET_OBJECT]({ commit }, { stepKey, data, id }) {

    commit(METADATA_EDITING_PATCH_DATASET_OBJECT, stepKey);

    const apiKey = this.state.userSignIn.user?.apikey || null;
    const categoryCards = this.state.categoryCards;

    const actionUrl = ACTION_METADATA_EDITING_PATCH_DATASET();
    const url = urlRewrite(actionUrl, API_BASE, ENVIDAT_PROXY);

    const postData = mapBackendData(stepKey, data);
    postData.id = id;

    await axios.post(url, postData,
      {
        headers: {
          Authorization: apiKey,
        },
      })
      .then((response) => {
        commit(METADATA_EDITING_PATCH_DATASET_OBJECT_SUCCESS, {
          stepKey,
          message: 'Changes saved',
          // details: `Changes saved ${stepKey} data for ${id}`,
        });

        populateEditingComponents(commit, response.data.result, null, categoryCards);
      })
      .catch((reason) => {
        commit(METADATA_EDITING_PATCH_DATASET_OBJECT_ERROR, {
          stepKey,
          reason,
        });
      });
  },
  async [METADATA_EDITING_PATCH_DATASET_ORGANIZATION]({ commit }, { stepKey, id, data }) {

    commit(METADATA_EDITING_PATCH_DATASET_OBJECT, stepKey);

    const apiKey = this.state.userSignIn.user?.apikey || null;
    const categoryCards = this.state.categoryCards;

    const actionUrl = ACTION_METADATA_EDITING_PATCH_DATASET_ORGANIZATION();
    const url = urlRewrite(actionUrl, API_BASE, ENVIDAT_PROXY);

    const postData = {
      id,
      organization_id: data.organizationId,
    };

    await axios.post(url, postData,
      {
        headers: {
          Authorization: apiKey,
        },
      })
      .then((response) => {
        commit(METADATA_EDITING_PATCH_DATASET_OBJECT_SUCCESS, {
          stepKey,
          message: 'Organization changed',
          // details: `Changes saved ${stepKey} data for ${id}`,
        });

        populateEditingComponents(commit, response.data.result, null, categoryCards);
      })
      .catch((reason) => {
        commit(METADATA_EDITING_PATCH_DATASET_OBJECT_ERROR, {
          stepKey,
          reason,
        });
      });
  },
};
