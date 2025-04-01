import { DatasetDTO } from '@/types/modelTypes';

const fetchDatasets = async (url: string): Promise<DatasetDTO[]> => {
  const response = await fetch(url);
  const json = await response.json();
  return json.result;
}

// let datasets: DatasetDTO[];

// @ts-ignore
export async function onBeforePrerenderStart() {
  const datasets = await fetchDatasets('https://s3-zh.os.switch.ch/frontend-static/metadata/packagelist/packagelist.json');

  // enhance the dataset as the pagecContext data
  const routes = datasets.map(dataset => ({
    url: `/metadata/${dataset.name}`,
    pageContext: {
      data: {
        ...dataset,
      },
    },
  }));

  return routes;
}

