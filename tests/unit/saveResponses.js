/* eslint-disable import/extensions */
// noinspection ES6PreferShortImport

// console.log(process.argv.length);

import fs from 'node:fs';

import {
  ACTION_USER_SIGNIN_TOKEN,
  ACTION_COLLABORATOR_DATASET_IDS,
  ACTION_OLD_GET_USER_CONTEXT,
  ACTION_GET_USER_CONTEXT_TOKEN,
  ACTION_GET_USER_LIST,
  ACTION_METADATA_CREATION_DATASET,
  ACTION_METADATA_CREATION_RESOURCE,
  ACTION_METADATA_DELETE_RESOURCE,
  ACTION_METADATA_EDITING_PATCH_DATASET,
  ACTION_METADATA_EDITING_PATCH_DATASET_ORGANIZATION,
  ACTION_METADATA_EDITING_PATCH_RESOURCE,
  ACTION_OLD_REQUEST_TOKEN,
  ACTION_RESET_TOKEN,
  ACTION_USER_COLLABORATOR_DATASETS,
  ACTION_USER_EDITING_UPDATE,
  ACTION_USER_SHOW,
  ACTION_OLD_USER_SIGNIN,
  ACTION_OLD_USER_SIGNOUT,
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
import { extractBodyIntoUrl } from '@/factories/stringFactory';



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

const ckanRequests = {
  [ACTION_GET_ORGANIZATION()]: {
    method: 'GET',
    body: {
      id: 'alpine-remote-sensing',
      'include_datasets': true,
    },
  },
  [ACTION_GET_ORGANIZATIONS()]: {
    method: 'GET',
  },
  [ACTION_METADATA_EDITING_PATCH_DATASET()]: {
    method: 'POST',
    body: {
      id: '',
      maintainer: '{"affiliation": "WSL", "email": "yi.liu@wsl.ch", "given_name": "Yi", "identifier": "0000-0002-0839-2518", "name": "Liu"}',
    },
  },
  [ACTION_METADATA_EDITING_PATCH_RESOURCE()]: {
    method: 'POST',
    body: { 
      id: 'b2aad61d-11f6-48ca-94d3-056c95916c7c',
      description: 'This upload contains the data (species checklist, species range maps, time-calibrated phylogenies, topographic change, etc.)  generated, analyzed, and presented in the paper "Escarpment evolution drives the diversification of the Madagascar flora".',
    },
  },
  [ACTION_METADATA_EDITING_PATCH_DATASET_ORGANIZATION()]: {
    method: 'POST',
    body: {
      'id': '94beec87-58ce-4c49-a876-dbb4b192f074', // package_id
      'organization_id': 'a5d8660c-7635-4620-8289-fb6181c34e0c', // org id
    },
  },
  [ACTION_GET_PROJECTS()]: {
    method: 'GET',
    body: {
      'all_fields': true,
      'include_groups': true,
      'include_extras': true,
      'include_datasets': true,
    },
  },
  [ACTION_USER_EDITING_UPDATE()]: {
    method: 'GET',
    body: {

    },
  },
/*
  [ACTION_USER_COLLABORATOR_DATASETS()]: {
    method: 'POST',
    params: ['id', 'organization_id'],
  },
*/
}

const ckanRequestsSignedIn = {
  [ACTION_COLLABORATOR_DATASET_IDS()]: {
    method: 'GET',
    body: {
      id: '',
      'include_datasets': true,
    },
  },
  [ACTION_METADATA_CREATION_DATASET()]: {
    method: 'POST',
    body: {
      id: '',
    }, // many more params
  },
  [ACTION_METADATA_CREATION_RESOURCE()]: {
    method: 'POST',
    body: {
      'package_id': '',
      'url': '',
    },
  },
  [ACTION_METADATA_DELETE_RESOURCE()]: {
    method: 'POST',
    params: ['id'],
  },
}

export const getEndpoints = (body = {}) => {
  const endpoints = [];

  // endpoints.push(ACTION_BULK_LOAD_METADATAS_CONTENT());

  endpoints.push(ACTION_GET_ORGANIZATION());
  endpoints.push(ACTION_GET_ORGANIZATIONS());
  endpoints.push(ACTION_COLLABORATOR_DATASET_IDS());

/*
  endpoints.push(ACTION_METADATA_CREATION_DATASET());
  endpoints.push(ACTION_METADATA_CREATION_RESOURCE());

  endpoints.push(ACTION_METADATA_DELETE_RESOURCE());

  endpoints.push(ACTION_METADATA_EDITING_PATCH_DATASET());
  endpoints.push(ACTION_METADATA_EDITING_PATCH_RESOURCE());
  endpoints.push(ACTION_METADATA_EDITING_PATCH_DATASET_ORGANIZATION());

  endpoints.push(ACTION_GET_PROJECTS())

  endpoints.push(ACTION_USER_COLLABORATOR_DATASETS());
  endpoints.push(ACTION_USER_EDITING_UPDATE());
  endpoints.push(ACTION_USER_GET_ORGANIZATIONS_SEARCH());

  endpoints.push(ACTION_USER_ORGANIZATION_IDS());

  endpoints.push(ACTION_METADATA_UPDATE_EXISTING_KEYWORDS());
  endpoints.push(ACTION_SEARCH_METADATA());
  endpoints.push(ACTION_LOAD_METADATA_CONTENT_BY_ID());
  endpoints.push(ACTION_GET_USER_LIST());
*/


  const fullUrls = [];

  endpoints.forEach(actionUrl => {
    let url = extractBodyIntoUrl(actionUrl, body);
    url = urlRewrite(url, '/api/action/', 'http://localhost:8989');
    fullUrls.push(url)
  });

  const doiActions = [ACTION_DOI_RESERVE(), ACTION_DOI_REQUEST(), ACTION_DOI_PUBLISH()];

  doiActions.forEach(actionUrl => {
    let url = extractBodyIntoUrl(actionUrl, body);
    url = urlRewrite(url, '/doi-api/datacite/', 'http://localhost:8989');
    fullUrls.push(url)
  });


  return fullUrls;
}

export const getSigninEndpoints = (useTokenSignin) => {
  const endpoints = [];

  if (useTokenSignin) {
    endpoints.push(ACTION_GET_USER_CONTEXT_TOKEN());
    endpoints.push(ACTION_RESET_TOKEN());
    endpoints.push(ACTION_USER_SIGNIN_TOKEN());

    endpoints.push(ACTION_GET_USER_CONTEXT_TOKEN());

    endpoints.push(ACTION_USER_SHOW());
    endpoints.push(ACTION_USER_SIGNOUT_REVOKE_TOKEN());

  } else {
    endpoints.push(ACTION_OLD_GET_USER_CONTEXT());
    endpoints.push(ACTION_OLD_REQUEST_TOKEN());
    endpoints.push(ACTION_OLD_USER_SIGNIN());

    endpoints.push(ACTION_OLD_GET_USER_CONTEXT());

    endpoints.push(ACTION_USER_SHOW());
    endpoints.push(ACTION_OLD_USER_SIGNOUT());
  }

  return endpoints;
}

export const getFileFromUrl = (url, version) => {

  const slashSplits = url.split('/');
  url = slashSplits[slashSplits.length - 1];
//  console.log(`url after slashSplits ${url}`);

  const querySplits = url.split('?');
  let fileName = querySplits.length >= 2 ? querySplits[0] : url;
//  console.log(`fileName after querySplits ${fileName}`);

  fileName = `${fileName}_${version}`;

  return fileName;
}

export const saveResponseToFile = (filePath, fileName, dataAsString) => {

  const absoluteFilePath = `${filePath + fileName}.json`;

//  console.log(`absoluteFilePath ${absoluteFilePath}`);

  let fileDescriptor = null

  try {
    const createDir = fs.mkdirSync(filePath, { recursive: true });

    if (createDir) {
      console.log(`created directory ${createDir}`);
    }

    fileDescriptor = fs.openSync(absoluteFilePath, 'w+');

  } catch (err) {
    console.error('file opening error');
    console.error(err.message);
    return false;
  }

//  console.log(`opened file ${absoluteFilePath}`);

  try {
    fs.writeFileSync(fileDescriptor, dataAsString);
  } catch (err) {
    console.error('file writing error');
    console.error(err.message);
    return false;
  }

  console.log(`Saved ${absoluteFilePath}`);

  return true;
}
