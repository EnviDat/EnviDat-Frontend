import { DatasetDTO } from '@/types/modelTypes';
import { enhanceJSONLd, isFechingDatasets, loadDataset } from '../../datasets.ts';

// @ts-ignore
export async function onBeforePrerenderStart() {
  console.log('onBeforePrerenderStart metadata/@id');

  while(isFechingDatasets) {
    console.log('waiting for fetching to finish...');
    // eslint-disable-next-line no-await-in-loop
    await new Promise(resolve => { setTimeout(resolve, 250) })
  }

  const datasets : DatasetDTO[] = await loadDataset();

  let count = 0;

  for (let i = 0; i < datasets.length; i++) {
    const dataset = datasets[i];
    count = dataset.jsonLd ? count + 1 : count;
  }

  console.log('before');
  console.log(`jsonLd dataset count ${count}`);

  await enhanceJSONLd(datasets);

  count = 0;
  
  for (let i = 0; i < datasets.length; i++) {
    const dataset = datasets[i];
    count = dataset.jsonLd ? count + 1 : count;
  }

  console.log('after');
  console.log(`jsonLd dataset count ${count}`);

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

