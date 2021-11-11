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
  getObjectInOtherCase,
  toSnakeCase,
} from '@/factories/userEditingFactory';
import { extractBodyIntoUrl } from '@/factories/stringFactory';

import {
  createBody,
  createDates,
  createFunding,
  createHeader,
  createLocation,
  createPublications,
  createPublishingInfo,
  createResources,
} from '@/factories/metaDataFactory';

import {
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_CUSTOMFIELDS,
  EDITMETADATA_DATA_GEO,
  EDITMETADATA_DATA_INFO,
  EDITMETADATA_DATA_RESOURCES,
  EDITMETADATA_KEYWORDS,
  EDITMETADATA_MAIN_DESCRIPTION,
  EDITMETADATA_MAIN_HEADER,
  EDITMETADATA_PUBLICATION_INFO,
  EDITMETADATA_RELATED_PUBLICATIONS,
} from '@/factories/eventBus';

import { createAuthors } from '@/factories/authorFactory';
import {
  LOAD_METADATA_CONTENT_BY_ID,
  METADATA_NAMESPACE,
} from '@/store/metadataMutationsConsts';

import {
  USER_NAMESPACE,
  USER_GET_ORGANIZATION_IDS,
  USER_GET_ORGANIZATION_IDS_SUCCESS,
  USER_GET_ORGANIZATION_IDS_ERROR,
  ACTION_USER_ORGANIZATION_IDS,
  USER_GET_ORGANIZATIONS,
  USER_GET_ORGANIZATIONS_SUCCESS,
  USER_GET_ORGANIZATIONS_ERROR,
  ACTION_USER_ORGANIZATIONS,
  USER_GET_ORGANIZATIONS_DATASETS,
  USER_GET_ORGANIZATIONS_DATASETS_SUCCESS,
  USER_GET_ORGANIZATIONS_DATASETS_ERROR,
  METADATA_EDITING_SAVE_RESOURCE,
  METADATA_EDITING_SAVE_RESOURCE_SUCCESS,
  ACTION_USER_ORGANIZATIONS_DATASETS,
  METADATA_EDITING_SAVE_AUTHOR,
  METADATA_EDITING_SAVE_AUTHOR_SUCCESS,
  ACTION_METADATA_EDITING_PATCH_DATASET,
  METADATA_EDITING_PATCH_DATASET,
  METADATA_EDITING_PATCH_DATASET_SUCCESS,
  METADATA_EDITING_PATCH_DATASET_ERROR,
  METADATA_EDITING_LOAD_DATASET,
  UPDATE_METADATA_EDITING,
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

function populateEditingComponents(commit, metadataRecord) {
  // ** Populate the editing form with existing metadata **

  // Stepper 1: Header, Description, Keywords, Authors
  const headerFull = createHeader(metadataRecord);
  const splitName = headerFull.contactName.split(' ');
  // headerFull.fullName = headerFull.contactName;
  const basicInfo = {
    metadataTitle: headerFull.metadataTitle,
    contactAuthor: {
      contactEmail: headerFull.contactEmail,
      contactGivenName: splitName[0],
      contactSurname: splitName[1],
    },
  };

  commitEditingData(commit, EDITMETADATA_MAIN_HEADER, basicInfo);

  const descriptionFull = createBody(metadataRecord);
  commitEditingData(commit, EDITMETADATA_MAIN_DESCRIPTION, {
    description: descriptionFull.text,
  });

  commitEditingData(commit, EDITMETADATA_KEYWORDS, {
    keywords: headerFull.tags,
  });

  const authors = createAuthors(metadataRecord);

  commitEditingData(commit, EDITMETADATA_AUTHOR_LIST, {
    authors,
  });

  // Stepper 2: Data Resources, Info, Location
  const resourcesFull = createResources(metadataRecord);

  commitEditingData(
    commit,
    EDITMETADATA_DATA_RESOURCES,
    resourcesFull.resources,
  );

  const metadataDates = createDates(metadataRecord);

  const dataInfo = {
    dates: metadataDates.dates,
    dataLicense: metadataRecord.license_title,
  };

  commitEditingData(commit, EDITMETADATA_DATA_INFO, dataInfo);

  const location = createLocation(metadataRecord);

  commitEditingData(commit, EDITMETADATA_DATA_GEO, {
    location,
  });

  // Stepper 3: Related Info, Custom Fields
  const relatedPublications = createPublications(metadataRecord);
  // To extract publication IDs from text use:
  // this.$store.dispatch(`${METADATA_NAMESPACE}/${EXTRACT_IDS_FROM_TEXT}`, {
  //   text: this.publications?.text,
  //   idDelimiter: this.publicationsConfig?.idDelimiter,
  //   idPrefix: this.publicationsConfig?.idPrefix,
  // });
  commitEditingData(commit, EDITMETADATA_RELATED_PUBLICATIONS, {
    relatedPublicationsText: relatedPublications.text,
  });

  commitEditingData(commit, EDITMETADATA_CUSTOMFIELDS, {
    customFields: metadataRecord.extras,
  });

  // Stepper 4: Publication Info, Organization
  const publicationInfoFull = createPublishingInfo(metadataRecord);
  const funding = createFunding(metadataRecord);
  const publicationInfo = {
    ...publicationInfoFull,
    funders: funding,
  };

  commitEditingData(commit, EDITMETADATA_PUBLICATION_INFO, {
    ...publicationInfo,
  });

  // // // Failing in EditPublicationInfo?
  // // // "Cannot read property 'institution' of undefined"
  // this.emitEditObjUpdateEvent(
  //   "EDITMETADATA_PUBLICATION_INFO",
  //   publicationInfo
  // );
  // this.emitEditObjUpdateEvent("EDITMETADATA_ORGANIZATION",
  //   {organization: metadataRecord.organization.name}
  // );
}

export default {
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

    const currentEntry =
      this.getters[`${METADATA_NAMESPACE}/currentMetadataContent`];

    populateEditingComponents(commit, currentEntry);
  },
  /*
    async [METADATA_EDITING_PATCH_DATASET_PROPERTY]({ commit }, { stepKey, id, property, value}) {

      commit(METADATA_EDITING_PATCH_DATASET, stepKey);

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
          commit(METADATA_EDITING_PATCH_DATASET_SUCCESS, {
            stepKey,
            message: `${property} saved ${response.data.result[property]}`,
          });
          // commit(METADATA_EDITING_PATCH_DATASET_SUCCESS, stepKey, response.data.result);
        })
        .catch((reason) => {
          commit(METADATA_EDITING_PATCH_DATASET_ERROR, {
            stepKey,
            reason,
          });
        });
    },
  */
  async [METADATA_EDITING_PATCH_DATASET]({ commit }, { stepKey, id }) {
    commit(METADATA_EDITING_PATCH_DATASET, stepKey);

    const stepData =
      this.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](stepKey);

    /*    commit(METADATA_EDITING_PATCH_DATASET_SUCCESS, {
          stepKey,
          message: `${property} saved`,
        });

    return;
    */

    // eslint-disable-next-line no-unreachable
    const apiKey = this.state.userSignIn.user?.apikey || null;

    /*
        if (apiKey === null) {
          commit(METADATA_EDITING_PATCH_DATASET_ERROR, { stepKey,
            reason: {
              response: {
                status: 'Not SignedIn',
                statusText:'Make sure you are signed in',
              },
            },
          });
          return;
        }
    */

    /*
        commit(METADATA_EDITING_PATCH_DATASET, stepKey);

        const data = this.getters[`${METADATA_NAMESPACE}/allMetadatas`];
    */

    /*
        const metadataConfig = config.metadataConfig || {};

        let url = urlRewrite('package_patch?limit=1000&offset=0',
            API_BASE, PROXY);

        if (process.env.NODE_ENV === 'development' && useTestdata) {
          url = './testdata/packagelist.json';
        }
    */

    const actionUrl = ACTION_METADATA_EDITING_PATCH_DATASET();
    let url = actionUrl;
    url = urlRewrite(url, API_BASE, ENVIDAT_PROXY);

    if (useTestdata) {
      // ignore the parameters for testdata, because it's directly a file
      url = urlRewrite(actionUrl, API_BASE, ENVIDAT_PROXY);
    }

    const postData = getObjectInOtherCase(stepData, toSnakeCase);
    postData.id = id;

    /*
    console.log('step to post');
    console.log(postData);

    const camelData = getObjectInOtherCase(postData, toCamelCase);

    console.log('post to camelData');
    console.log(camelData);
*/

    await axios
      .post(url, postData, {
        headers: {
          Authorization: apiKey,
        },
      })
      .then(() => {
        commit(METADATA_EDITING_PATCH_DATASET_SUCCESS, {
          stepKey,
          message: `Saved ${stepKey} data for ${id}`,
        });
        // commit(METADATA_EDITING_PATCH_DATASET_SUCCESS, stepKey, response.data.result);
      })
      .catch((reason) => {
        commit(METADATA_EDITING_PATCH_DATASET_ERROR, {
          stepKey,
          reason,
        });
      });
  },
};
