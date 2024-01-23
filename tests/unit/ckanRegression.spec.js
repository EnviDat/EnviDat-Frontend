/* eslint-disable no-unused-vars */

import { it, describe, expect } from 'vitest';
import axios from 'axios';

// noinspection ES6UnusedImports, NpmUsedModulesInstalled
import packages from '../../public/testdata/admin_packages_27092023.json';
import { getEndpoints, getFileFromUrl, saveResponseToFile } from './saveResponses';


// import { ACTION_BULK_LOAD_METADATAS_CONTENT } from '@/store/metadataMutationsConsts';

// const testDataPath = `${__dirname}/../../public/testdata/`;
const testDataPath = `${__dirname}/regression/`;


/**
 * Regression tests for the different api actions from CKAN 2.9 vs 2.10
 *
 * To run these test via vitest you have remove it from the exclude list
 * in the vite.config.json
 */
describe('ckanRegression - preparation', () => {

  it('gathering actions - version 2_9', async () => {
    const version = '2_9';

    const endpointsUrls = getEndpoints({
      id: 'satellite-avalanche-mapping-validation',
    });

    expect(endpointsUrls).toBeDefined();
    expect(endpointsUrls.length).greaterThan(0)

    // console.log(endpointsUrls);
    // const url = endpointsUrls[0];

    const requests = [];

    for (let i = 0; i < endpointsUrls.length; i++) {
      const url = endpointsUrls[i];
      requests.push(axios.get(url, {
        validateStatus: (status) => status < 500, // Resolve only if the status code is 500
      }));
    }

    const responses= await Promise.all(requests);

    for (const response of responses) {

      const responseString = JSON.stringify(response.data);
      const url = axios.getUri(response.config);
//      console.log(`url: ${url}`);
      const fileName = getFileFromUrl(url, version)

      expect(fileName).toBeDefined();
/*
      console.log(`testDataPath: ${testDataPath}`);
      console.log(`fileName: ${fileName}`);
*/

      // eslint-disable-next-line no-await-in-loop
      const ok = saveResponseToFile(testDataPath, fileName, responseString);

      expect(ok).toBe(true);
    }

  });

});

describe('ckanRegression - save subset of dataset', () => {

  it('save subset to new file', async () => {

    const datasets = packages.result;
    console.log(`amount of input datasets: ${datasets.length}`);

    const condition = (d) => d.publication_state === 'reserved' &&
      (d.metadata_modified.includes('2023-09-27') || d.metadata_modified.includes('2023-09-26'));

/*
    const condition = (d) => (d.metadata_modified.includes('2023-09-27') || d.metadata_modified.includes('2023-09-26'));
*/

    const subset = datasets.filter(condition);

    console.log(`found ${subset.length} dataset for the subset condition: ${condition.toString()}`);

    if (subset.length > 0) {
      const fileName = 'doi_fabrica_datasets';

      const outdata = [];
      for (let i = 0; i < subset.length; i++) {
        const dataset = subset[i];
        outdata.push({
          id: dataset.id,
          title: dataset.title,
          doi: dataset.doi,
          metadata_modified: dataset.metadata_modified,
          publication_state: dataset.publication_state,
          private: dataset.private,
          owner_org: dataset.owner_org,
          maintainer: dataset.maintainer,
        });
      }

      const subsetString = JSON.stringify(outdata);

      console.log(`writing to the file ${fileName}`);
      saveResponseToFile(testDataPath, fileName, subsetString);
    }

  });

});
