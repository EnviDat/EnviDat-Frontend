import { DatasetDTO } from '@/types/modelTypes';


const fetchDatasets = async (url: string): Promise<DatasetDTO[]> => {
  const response = await fetch(url);
  const json = await response.json();
  return json.result;
}

// eslint-disable-next-line import/no-mutable-exports
export let isFechingDatasets = false;

let datasetMap: Map<string, DatasetDTO>;
let jsonLdMap: Map<string, any>;

export async function loadDataset(): Promise<DatasetDTO[]> {

  let datasets;

  if (!datasetMap) {
    console.log('loading datasets...');
    isFechingDatasets = true;

    datasets = await fetchDatasets('https://s3-zh.os.switch.ch/frontend-static/metadata/packagelist/packagelist.json');
    datasetMap = new Map<string, DatasetDTO>;

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

export async function loadJSONLD(id: string, doi: string) {

  let jsonLd: any;

  try {
    const cleanDoi = doi.replace('/', '_');
    const response = await fetch(
      `https://os.zhdk.cloud.switch.ch/envidat-doi/${cleanDoi}/metadata.json`,
    );

    // console.log(`image jsonLd call for ${cleanDoi} here :P`);

    const responseType = response.headers.get('Content-Type');
    if (responseType === 'application/json') {
      jsonLd = await response.json();
    } else if (responseType === 'text/plain') {
      jsonLd = JSON.parse(await response.text());
    }

    jsonLd = {
      doi: cleanDoi,
      stuff: 'happens here',
    }
  } catch (error) {
    console.error(error);
  }

  return { id, jsonLd };
}

export async function getJSONLDMapForDatasets(datasets: DatasetDTO[]) {

  if (!jsonLdMap) {
    jsonLdMap = new Map<string, any>;

    console.log(`Loading JSONLd for ${datasets.length} datasets`);

    const dataArray = [];
    for (let i = 0; i < datasets.length; i++) {
      const dataset = datasets[i];

      // eslint-disable-next-line no-await-in-loop
      const data = await loadJSONLD(dataset.id, dataset.doi);
      dataArray.push(data);
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

    dataArray.forEach(jsonLdResult => jsonLdMap.set(jsonLdResult.id, jsonLdResult.jsonLd) );
  }

  return jsonLdMap;
}

export async function enhanceJSONLd(datasets: DatasetDTO[]) {
  const map = await getJSONLDMapForDatasets(datasets);

  if (jsonLdMap) {
    for (let i = 0; i < datasets.length; i++) {
      const dataset = datasets[i];
      const jsonLd = map.get(dataset.id);
      dataset.jsonLd = jsonLd
    }

    console.log(`Enhanced ${datasets.length} datasets with jsonLd`);

  } else {
    console.error('jsonLdMap could not be loaded');
  }
}
