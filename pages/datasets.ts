import { DatasetDTO } from '@/types/modelTypes';

const fetchDatasets = async (url: string): Promise<DatasetDTO[]> => {
  const response = await fetch(url);
  const json = await response.json();
  return json.result;
}

let cache;

export async function loadDataset(): Promise<DatasetDTO[]> {

  if (!cache) {
    console.log('loading datasets...');
    cache = await fetchDatasets('https://s3-zh.os.switch.ch/frontend-static/metadata/packagelist/packagelist.json');
  }

  console.log('loaded datasets ', cache.length);

  return cache;
}
