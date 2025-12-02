import { DatasetDTO } from '@/types/dataTransferObjectsTypes';
import { isFechingDatasets, loadDataset } from '../datasets';

// @ts-ignore
export async function onBeforePrerenderStart() {
  console.log('onBeforePrerenderStart metadata');

  while (isFechingDatasets) {
    console.log('waiting for fetching to finish...');
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => {
      setTimeout(resolve, 250);
    });
  }

  const datasets: DatasetDTO[] = await loadDataset();

  // don't enhance datasets with jsonLd, because here they would get overwritten

  const routes = [
    {
      url: '/metadata/',
      pageContext: {
        data: {
          ...datasets,
        },
      },
    },
  ];

  console.log('onBeforePrerenderStart metadata routes', routes.length);

  return routes;
}
