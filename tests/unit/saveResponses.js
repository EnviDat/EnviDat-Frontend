/* eslint-disable import/extensions */
// noinspection ES6PreferShortImport

// console.log(process.argv.length);

import {
  ACTION_API_TOKEN,
  ACTION_COLLABORATOR_DATASET_IDS,
  ACTION_GET_USER_CONTEXT,
  ACTION_GET_USER_CONTEXT_TOKEN,
  ACTION_GET_USER_LIST,
  ACTION_METADATA_CREATION_DATASET,
  ACTION_METADATA_CREATION_RESOURCE,
  ACTION_METADATA_DELETE_RESOURCE,
  ACTION_METADATA_EDITING_PATCH_DATASET,
  ACTION_METADATA_EDITING_PATCH_DATASET_ORGANIZATION,
  ACTION_METADATA_EDITING_PATCH_RESOURCE,
  ACTION_REQUEST_TOKEN,
  ACTION_REQUEST_TOKEN_RESET,
  ACTION_USER_COLLABORATOR_DATASETS,
  ACTION_USER_EDITING_UPDATE,
  ACTION_USER_SHOW,
  ACTION_USER_SIGNIN,
  ACTION_USER_SIGNOUT,
  ACTION_USER_SIGNOUT_REVOKE_TOKEN,
} from '@/modules/user/store/userMutationsConsts.js';

import {
  ACTION_GET_ORGANIZATION,
  ACTION_GET_ORGANIZATIONS,
  ACTION_USER_GET_ORGANIZATIONS_SEARCH,
  ACTION_USER_ORGANIZATION_IDS,
} from '@/modules/organizations/store/organizationsMutationsConsts.js';

import { ACTION_DOI_PUBLISH, ACTION_DOI_REQUEST, ACTION_DOI_RESERVE } from '@/modules/user/store/doiMutationsConsts.js';
import { ACTION_GET_PROJECTS } from '@/modules/projects/store/projectsMutationsConsts.js';
import {
  ACTION_BULK_LOAD_METADATAS_CONTENT,
  ACTION_LOAD_METADATA_CONTENT_BY_ID,
  ACTION_METADATA_UPDATE_EXISTING_KEYWORDS,
  ACTION_SEARCH_METADATA,
} from '@/store/metadataMutationsConsts.js';
import { urlRewrite } from '@/factories/apiFactory.js';



/*
if (process.argv.length <= 2) {
  console.error('Expected at least the version (-v number) argument!');
  process.exit(1);
}

if (process?.argv[2] !== '-v' || !process?.argv[3]) {
  console.log('Make sure to set the version (-v number).');
  process.exit(1);
}

const version = process.argv[3];
console.log(`Starting tests for version ${version}`);
*/

export const getEndpoints = () => {
  const endpoints = [];

  endpoints.push(ACTION_BULK_LOAD_METADATAS_CONTENT());

/*
  endpoints.push(ACTION_USER_SHOW());
  endpoints.push(ACTION_API_TOKEN());
  endpoints.push(ACTION_GET_USER_CONTEXT());
  endpoints.push(ACTION_GET_USER_CONTEXT_TOKEN());
  endpoints.push(ACTION_GET_USER_LIST());

  endpoints.push(ACTION_GET_ORGANIZATION());
  endpoints.push(ACTION_GET_ORGANIZATIONS());
  endpoints.push(ACTION_COLLABORATOR_DATASET_IDS());


  endpoints.push(ACTION_METADATA_CREATION_DATASET());
  endpoints.push(ACTION_METADATA_CREATION_RESOURCE());

  endpoints.push(ACTION_METADATA_DELETE_RESOURCE());

  endpoints.push(ACTION_METADATA_EDITING_PATCH_DATASET());
  endpoints.push(ACTION_METADATA_EDITING_PATCH_RESOURCE());
  endpoints.push(ACTION_METADATA_EDITING_PATCH_DATASET_ORGANIZATION());

  endpoints.push(ACTION_REQUEST_TOKEN());
  endpoints.push(ACTION_REQUEST_TOKEN_RESET());

  endpoints.push(ACTION_USER_SIGNIN());
  endpoints.push(ACTION_GET_PROJECTS())

  endpoints.push(ACTION_USER_COLLABORATOR_DATASETS());
  endpoints.push(ACTION_USER_EDITING_UPDATE());
  endpoints.push(ACTION_USER_GET_ORGANIZATIONS_SEARCH());

  endpoints.push(ACTION_USER_ORGANIZATION_IDS());
  endpoints.push(ACTION_USER_SIGNOUT_REVOKE_TOKEN());
  endpoints.push(ACTION_USER_SIGNOUT());

  endpoints.push(ACTION_METADATA_UPDATE_EXISTING_KEYWORDS());
  endpoints.push(ACTION_SEARCH_METADATA());
  endpoints.push(ACTION_LOAD_METADATA_CONTENT_BY_ID());
*/

  const fullUrls = [];

  endpoints.forEach(actionUrl => {
    const url = urlRewrite(actionUrl, '/api/action/', 'https://envidat04.wsl.ch');
    fullUrls.push(url)
  });

  const doiActions = [ACTION_DOI_RESERVE(), ACTION_DOI_REQUEST(), ACTION_DOI_PUBLISH()];

  doiActions.forEach(actionUrl => {
    const url = urlRewrite(actionUrl, '/doi-api/datacite/', 'https://envidat04.wsl.ch');
    fullUrls.push(url)
  });


  return fullUrls;
}

console.log(getEndpoints());
