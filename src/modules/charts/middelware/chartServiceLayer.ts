import { getUrlExtension } from '@/factories/strategyFactory';
import { getDataWithMetaData } from '@/modules/charts/middelware/ServiceLayer.ts';


export function convertCSVToJSON(csv, nullValue) {
  let lines = csv.split('\n');

  // TEST DEV BLOCK //
  const displayDescription = lines.filter(line =>
    line.startsWith('# display_description = '),
  );

  let keys = [];
  if (displayDescription.length === 1) {
    keys = displayDescription[0]
      .replace('# display_description = ', '')
      .split(',');
  }
  // TODO refine error handling
  else {
    console.log(
      'Error parsing NEAD file because header does not have a row that starts with: "# display_description = "',
    );
    return {};
  }

  // TEST code for removing NEAD metadata header lines that start with '#'
  lines = lines.filter(line => !line.startsWith('#'));

  // TEST END DEV BLOCK //

  // Remove last line if it is an empty string
  if (lines[lines.length - 1] === '') {
    lines.pop();
  }

  // TEST comment this out
  // const keys = lines[0].split(',');

  return lines.slice(1).map(line =>
    line.split(',').reduce((acc, cur, i) => {
      // TODO possible add logic that tests that keys.length equals length of comma separated line before adding JSON object

      const toAdd = {};

      if (cur === nullValue) {
        cur = null;
      }

      toAdd[keys[i]] = cur;

      return { ...acc, ...toAdd };
    }, {}),
  );
}


async function loadPreviewDataForResource(resource) {
  try {
    const { meta, data } = await getDataWithMetaData(resource.url);
    resource.sparkChartData = data;
  } catch (e) {
    console.error(e);
  }
}

export async function loadResourcesPreview(resources) {

  for (let i = 0; i < resources.length; i++) {
    const resource = resources[i];
    const loadPreview = getUrlExtension(resource.url) === 'csv';

    if (loadPreview) {
      setTimeout(
        () => loadPreviewDataForResource(resource),
        500);
    }
  }
}
