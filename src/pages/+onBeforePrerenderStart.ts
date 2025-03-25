import { DatasetDTO } from '@/types/modelTypes';

const fetchDatasets = async (url: string): Promise<DatasetDTO[]> => {
  const response = await fetch(url);
  const json = await response.json();
  return json.result;
}

// @ts-ignore
export async function onBeforePrerenderStart() {
  const datasets = await fetchDatasets('https://s3-zh.os.switch.ch/frontend-static/metadata/packagelist/packagelist.json');
  const routes = datasets.map(dataset => `/metadata/${dataset.id}`);
/*
  const routes = datasets.map(dataset => ({
    route: `/metadata/${dataset.id}`,
    Page: MetadataDetailPage,
  }));
*/
  console.log('[Vike prerender routes]', routes)
  return routes;
/*
  const datasets = await fetchDatasets('https://s3-zh.os.switch.ch/frontend-static/metadata/packagelist/packagelist.json');
  return datasets.map(dataset => `/metadata/${dataset.id}`);
*/
}
