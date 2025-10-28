import axios from 'axios';
import type { DatasetDTO } from '@/types/dataTransferObjectsTypes';
import type { Dataset } from '@/types/jsonLdTypes';

const fetchDatasets = async (url: string): Promise<DatasetDTO[]> => {
  const response = await fetch(url);
  const json = await response.json();
  return json.result;
};

// eslint-disable-next-line import/no-mutable-exports
export let isFechingDatasets = false;

let datasetMap: Map<string, DatasetDTO>;
let jsonLdMap: Map<string, Dataset>;

export async function loadDataset(): Promise<DatasetDTO[]> {
  let datasets;

  if (!datasetMap) {
    datasetMap = new Map<string, DatasetDTO>();
    console.log('loading datasets...');
    isFechingDatasets = true;

    datasets = await fetchDatasets(
      'https://s3-zh.os.switch.ch/frontend-static/metadata/packagelist/packagelist.json',
      // './packagelist.json',
    );

    for (let i = 0; i < datasets.length; i++) {
      const dataset = datasets[i];
      datasetMap.set(dataset.id, dataset);
    }

    isFechingDatasets = false;
    console.log(`cached ${datasets.length} datasets`);
  } else {
    console.log(`Using cached map ${datasetMap.size} for datasets`);

    datasets = Array.from(datasetMap.values());
    console.log(`${datasets.length} datasets from cache`);
  }

  console.log('loaded datasets ', datasets.length);

  return datasets;
}

export function getDatasetMap() : Map<string, DatasetDTO> | undefined {
  console.log('getDatasetMap', datasetMap.size);
  return datasetMap;
}

export async function loadJSONLD(id: string, doi: string) : Promise<Dataset> {
  let jsonLd: any;

  try {
    const cleanDoi = doi.replace('/', '_');
/*
    const response = await fetch(
      `https://os.zhdk.cloud.switch.ch/envidat-doi/${cleanDoi}/metadata.json`,
    );

    const responseType = response.headers.get('Content-Type');

    if (responseType === 'application/json') {
      jsonLd = await response.json();
    } else if (responseType === 'text/plain') {
      jsonLd = JSON.parse(await response.text());
    }

*/

    const response = await axios.get(`https://os.zhdk.cloud.switch.ch/envidat-doi/${cleanDoi}/metadata.json`);
    // console.log(`DOI ${doi} jsonld found`);
    jsonLd = response.data;

//    const responseType = response.headers['Content-Type'];

//     console.log(`responseType ${responseType}`, response.data);
  } catch (error) {

    if (error.response.status === 404) {
      // console.log(`DOI ${doi} Error: Resource not found (404)`);
    } else {
      console.log(`Error: HTTP status code ${error.response.status}`);
      // console.error(error);
    }
  }

  // console.log(`Dataset ${id} jsonLd`, jsonLd);

  return jsonLd;
}

export async function getJSONLDMapForDatasets(datasets: DatasetDTO[]) {
  if (!jsonLdMap) {
    jsonLdMap = new Map<string, Dataset>();

    console.log(`Loading JSONLd for ${datasets.length} datasets`);

    for (let i = 0; i < datasets.length; i++) {
      const dataset = datasets[i];

      // eslint-disable-next-line no-await-in-loop
      const jsonLd = await loadJSONLD(dataset.id, dataset.doi);

      jsonLdMap.set(dataset.id, jsonLd);
    }

    /*
    const promises  = [];
    for (let i = 0; i < datasets.length; i++) {
      const dataset = datasets[i];

      promises.push(loadJSONLD(dataset.id, dataset.doi));
    }

    const dataArray = await Promise.all(promises);
*/
    // const dataArray = await Promise.all(responses.map(response => response.json()));

    // dataArray.forEach(jsonLdResult => jsonLdMap.set(jsonLdResult.id, jsonLdResult.jsonLd) );
  }

  console.log(`Loaded the map with size ${jsonLdMap.size}`);

  return jsonLdMap;
}

export async function enhanceJSONLd(datasets: DatasetDTO | { jsonLd: object }[]) {
  const map = await getJSONLDMapForDatasets(datasets);

  console.log(`Map size ${map.size} for enhancing `);

  if (jsonLdMap) {
    for (let i = 0; i < datasets.length; i++) {
      const dataset = datasets[i];
      dataset.jsonLd = map.get(dataset.id);
//      console.log(`jsonLd dataset ${dataset.name} has jsonld ${!!dataset.jsonLd}`);
    }

    console.log(`Enhanced ${datasets.length} datasets with jsonLd`);
  } else {
    console.error('jsonLdMap could not be loaded');
  }
}
