/* eslint-disable import/extensions */
// import fs from 'fs';


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
} from '../modules/user/store/userMutationsConsts.js';

import {
  ACTION_GET_ORGANIZATION,
  ACTION_GET_ORGANIZATIONS,
  ACTION_USER_GET_ORGANIZATIONS_SEARCH,
  ACTION_USER_ORGANIZATION_IDS,
} from '../modules/organizations/store/organizationsMutationsConsts.js';

import { ACTION_DOI_PUBLISH, ACTION_DOI_REQUEST, ACTION_DOI_RESERVE } from '../modules/user/store/doiMutationsConsts.js';
import { ACTION_GET_PROJECTS } from '../modules/projects/store/projectsMutationsConsts.js';
import {
  ACTION_BULK_LOAD_METADATAS_CONTENT,
  ACTION_LOAD_METADATA_CONTENT_BY_ID,
  ACTION_METADATA_UPDATE_EXISTING_KEYWORDS,
  ACTION_SEARCH_METADATA,
} from '../store/metadataMutationsConsts.js';
import { urlRewrite } from '../factories/apiFactory.js';



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

const getEndpoints = () => {
  const endpoints = [];

  endpoints.push(ACTION_API_TOKEN());
  endpoints.push(ACTION_USER_SHOW());
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
  endpoints.push(ACTION_BULK_LOAD_METADATAS_CONTENT());

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
/*

import * as packageJson from '../../stories/testdata/packagelist.json';

const metadataList = packageJson.result;

const outputFileName = 'authorCollection.json';
const outputPath = `${__dirname}/../testdata/`;

const fullNameList = {
  'Meile, R.': 'Rolf Meile',
};

function getDataCredit(author) {
  if (!author.data_credit) {
    return null;
  }

  // key: dataCreditName, value: count
  const dataCredit = {};

  if (author.data_credit instanceof Array) {
    for (let i = 0; i < author.data_credit.length; i++) {
      const credit = author.data_credit[i];

      if (dataCredit[credit]) {
        let v = dataCredit[credit];
        v += 1;
        dataCredit[credit] = v;
      } else {
        dataCredit[credit] = 1;
      }
    }
  } else if (typeof author.data_credit === 'string') {
    dataCredit[author.data_credit] = 1;
  } else {
    console.log(
      `Unexpected type for author.data_credit ${typeof author.data_credit}`,
    );
    throw new Error(
      `Unexpected type for author.data_credit ${typeof author.data_credit}`,
    );
  }

  return dataCredit;
}

function getAuthorName(author) {
  let fullName = author.name.trim();

  if (fullName.indexOf('.') >= 0) {
    // for names like 'Meile R.' usually the lastname comes first then
    const lookupName = fullNameList[fullName];
    if (lookupName) {
      fullName = lookupName;
    }
  }

  const nameSpilts = fullName.split(' ');

  const firstName = nameSpilts[0];
  let lastName = nameSpilts[1];

  if (nameSpilts.length === 3) {
    // For Names like 'Dude van Dudehood'
    lastName = `${nameSpilts[1]} ${nameSpilts[2]}`;
  }

  return {
    fullName,
    firstName,
    lastName,
  };
}

function getAuthors(dataset) {
  let authors = null;

  if (typeof dataset.author === 'string') {
    authors = JSON.parse(dataset.author);
  }

  if (authors && authors instanceof Array) {
    const authorObjs = [];

    for (let i = 0; i < authors.length; i++) {
      const author = authors[i];

      const authorName = getAuthorName(author);

      const id = {
        type: author.identifier_scheme,
        identifier: author.identifier,
      };

      const dataCredit = getDataCredit(author);

      authorObjs.push({
        firstName: authorName.firstName,
        lastName: authorName.lastName,
        fullName: authorName.fullName,
        datasetCount: 1,
        affiliation: author.affiliation,
        id,
        email: author.email,
        dataCredit,
      });
    }

    return authorObjs;
  }

  return null;
}

function extractAuthorsMap(datasets) {
  const mapAuthors = {};
  let authorCount = 0;

  for (let i = 0; i < datasets.length; i++) {
    const dataset = datasets[i];

    const authors = getAuthors(dataset);

    if (authors) {
      for (let j = 0; j < authors.length; j++) {
        const author = authors[j];

        const authorName = author.fullName;
        const existingAuthor = mapAuthors[authorName];

        if (existingAuthor) {
          existingAuthor.datasetCount += author.datasetCount;

          if (author.data_credit) {
            if (!existingAuthor.data_credit) {
              existingAuthor.data_credit = author.data_credit;
            } else {
              const keys = Object.keys(author.data_credit);

              for (let k = 0; k < keys.length; k++) {
                const key = keys[k];
                const value = author.data_credit[key];

                let existingValue = existingAuthor.data_credit[key];

                if (existingValue) {
                  existingValue += value;
                } else {
                  existingValue = value;
                }

                // console.log('for ' + author.name + ' set ' + key + ' ' + existingValue);
                existingAuthor.data_credit[key] = existingValue;
              }
            }
          }

          // console.log('for ' + author.name + ' updated ' + existingAuthor.count);
          mapAuthors[authorName] = existingAuthor;
        } else {
          // console.log('for ' + author.name + ' set ' + author.count);
          mapAuthors[authorName] = author;
          authorCount++;
        }
      }
    } else {
      console.log(`Dataset ${dataset.title} id ${dataset.id} has no authors?`);
    }

    console.log(`extracted ${authorCount} authors`);
  }

  return mapAuthors;
}

function writeAuthorsToFile(authorMap) {
  const authorJson = JSON.stringify(authorMap, null, 2);

  fs.writeFile(outputPath + outputFileName, authorJson, err => {
    if (err) {
      return console.log(err);
    }

    return console.log(
      `Authors extracted to ${outputPath}${outputFileName}. Wrote ${authorJson.length} lines.`,
    );
  });
}

const authorsMap = extractAuthorsMap(metadataList);

writeAuthorsToFile(authorsMap);
*/
