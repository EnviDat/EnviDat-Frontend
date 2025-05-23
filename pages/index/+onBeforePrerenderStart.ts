import { DatasetDTO } from '@/types/modelTypes';
import { isFechingDatasets, loadDataset } from '../datasets.ts';

// @ts-ignore
export async function onBeforePrerenderStart() {
  console.log('onBeforePrerenderStart index');

  while(isFechingDatasets) {
    console.log('waiting for fetching to finish...');
    // eslint-disable-next-line no-await-in-loop
    await new Promise(resolve => { setTimeout(resolve, 250) })
  }

  const datasets : DatasetDTO[] = await loadDataset();

  // don't enhance datasets with jsonLd, because here they would get overwritten

  const routes = [{
    url: '/',
    pageContext: {
      data: {
        ...datasets,
      },
    },
  }];

  console.log('onBeforePrerenderStart root routes', routes.length);

  return routes;
}

