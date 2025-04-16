import { DatasetDTO } from '@/types/modelTypes';
import { loadDataset } from '../datasets.ts';

// @ts-ignore
export async function onBeforePrerenderStart() {
  const datasets : DatasetDTO[] = await loadDataset();

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

