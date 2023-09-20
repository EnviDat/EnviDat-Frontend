import fs from 'fs';
import { it, describe, expect } from 'vitest';
import axios from 'axios';
// const fs = require('fs');

import { getEndpoints } from './saveResponses';
// import { ACTION_BULK_LOAD_METADATAS_CONTENT } from '@/store/metadataMutationsConsts';


const testDataPath = `${__dirname}/../../public/testdata/`;



describe('ckanRegression - preparation', () => {

  it('gathering actions - ', async () => {

    const endpointsUrls = getEndpoints();

    expect(endpointsUrls).toBeDefined();
    expect(endpointsUrls.length).greaterThan(0)

    // console.log(endpointsUrls);

    const url = endpointsUrls[0];

    const response = await axios.get(url);
    const responseString = JSON.stringify(response.data);
    // console.log(responseString);

    const fileName = 'current_package_list_with_resources.json';

    const absoluteFilePath = testDataPath + fileName;
    console.log(`open file ${absoluteFilePath}`);

    await fs.open(absoluteFilePath, 'w+', (err) => {
      if (err) {
        return console.log(err);
      }

      return console.log(`Created ${fileName}`);
    });

    console.log(`opened file ${absoluteFilePath}`);

    fs.writeFileSync(absoluteFilePath, responseString, (err) => {

      if (err) {
        return console.log(err);
      }

      return console.log(`Saved ${fileName}`);
    });

    console.log(`Saved ${fileName}`);


  });

});


