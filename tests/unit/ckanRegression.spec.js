import { it, describe, expect } from 'vitest';
import axios from 'axios';

import { getEndpoints, getFileFromUrl, saveResponseToFile } from './saveResponses';

// import { ACTION_BULK_LOAD_METADATAS_CONTENT } from '@/store/metadataMutationsConsts';

// const testDataPath = `${__dirname}/../../public/testdata/`;
const testDataPath = `${__dirname}/regression/`;



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


