import { defineAsyncComponent } from 'vue';
import { getUrlExtension } from '@/factories/strategyFactory';
import { getDataWithMetaData } from '@/modules/charts/middelware/DataVizServiceLayer.ts';
import { MetaData } from '@/types/dataVizTypes';
import { INJECT_GENERIC_COMPONENT } from '@/factories/eventBus';

const ResourceDataVizAsync = defineAsyncComponent(() =>
  import('@/modules/charts/components/ResourceDataViz.vue'),
)

export const DataVizSupportedExtensions = ['csv'];

export const chartPreviewLabels = [
    '12am',
    '3am',
    '6am',
    '9am',
    '12pm',
    '3pm',
    '6pm',
    '9pm',
  ];

export const chartPreviewData = [
    200,
    675,
    410,
    390,
    310,
    460,
    250,
    240,
  ]

  export function convertCSVToJSON(csv, nullValue) {
  let lines = csv.split('\n');

  // TEST DEV BLOCK //
  const displayDescription = lines.filter((line) =>
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
  lines = lines.filter((line) => !line.startsWith('#'));

  // TEST END DEV BLOCK //

  // Remove last line if it is an empty string
  if (lines[lines.length - 1] === '') {
    lines.pop();
  }

  // TEST comment this out
  // const keys = lines[0].split(',');

  return lines.slice(1).map((line) =>
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

type LoadResourcesCallback = (meta: MetaData, data: object[]) => void;

export async function loadResourcesData(
  url: string,
  successCallback: LoadResourcesCallback,
  errorCallback: (e: Error) => void,
) {
  try {
    const { meta, data } = await getDataWithMetaData(url);
    successCallback(meta, data);
  } catch (e) {
    errorCallback(e);
  }
}

export function markResourceForDataViz(resources: any[]) {
  for (let i = 0; i < resources.length; i++) {
    const resource = resources[i];
    const canDataViz =
      !resource.isProtected &&
      DataVizSupportedExtensions.includes(getUrlExtension(resource.url));

    resource.canDataViz = canDataViz;
    if (canDataViz) {
      resource.openEvent = INJECT_GENERIC_COMPONENT;
      resource.openProperty = {
        asyncComponent: ResourceDataVizAsync,
        props: {
          resource,
        },
      };
    }
  }
}

export function getResourcesForDataViz(resources: object[]) : object[] {
  return resources.filter((res) => !res.isProtected &&
    DataVizSupportedExtensions.includes(getUrlExtension(res.url)));
}
