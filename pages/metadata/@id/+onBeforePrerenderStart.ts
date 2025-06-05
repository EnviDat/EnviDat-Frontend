import { DatasetDTO } from '@/types/dataTransferObjectsTypes';
import { loadDataset } from '../../datasets.ts';

// @ts-ignore
export async function onBeforePrerenderStart() {
  const datasets : DatasetDTO[] = await loadDataset();

  // enhance the dataset as the pagecContext data
  const routes = datasets.map(dataset => ({
    url: `/metadata/${dataset.name}`,
    pageContext: {
      data: {
        ...dataset,
      },
    },
  }));

  console.log('onBeforePrerenderStart metadata routes', routes.length);

  return routes;
}

