/* eslint-disable object-curly-newline */
/**
 * @summary story of SigninPage sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-08-25 12:21:22
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import DatasetBarChart from '@/components/Charts/DatasetBarChart.vue';
import { getOrgaDatasetMap, organizationSeries } from '@/factories/organizationFactory';

import metadataFile from './testdata/packagelist.json'

const datasets = metadataFile.result;

export default {
  title: '1 Base / Charts / DatasetBarChart',
  component: DatasetBarChart,
};

const orgaDatasetMap = getOrgaDatasetMap(datasets);
const series = organizationSeries(orgaDatasetMap);
const keys = Array.from(orgaDatasetMap.keys());

export const Basic = {
  args: {
    data: {
      labels: keys,
      datasets: [ { data: [40, 20, 12] } ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Chart.js Doughnut Chart',
        },
      },
    },
  },
}
