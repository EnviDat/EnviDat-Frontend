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

import LineChart from '@/components/Charts/LineChart.vue';
import { getOrgaDatasetsMap, organizationSeries } from '@/factories/organizationFactory';

import metadataFile from '@/../stories/testdata/packagelist.json';

const metadatas = metadataFile.result;

export default {
  title: '1 Base / Charts / LineChart',
  component: LineChart,
  //  decorators: [() => ({ template: '<div style="height: 500px;"><story/></div>' })],
};

const chartColors = [
  '#874540',
  '#954D59',
  '#9C5A74',
  '#9B6A90',
  '#907DA8',
  '#7D92BC',
  '#62A5C7',
  '#45B8C8',
  '#38C9C1',
  '#4DD8B1',
  '#75E59C',
  '#A3EF86',
  '#D5F673',
  //  "#3F1D1E","#512933","#5E374A","#644964","#635D7D","#597392","#4989A2","#369FA9","#31B4A9","#4AC8A0","#72DA92","#A1E981","#D5F673"
  //  "#F0807D","#F3859B","#ED90B8","#DC9ED3","#C2AFE7","#A0C0F3","#7ACFF4","#57DCEC","#49E6DA","#5CEEC1","#81F3A6","#ABF68B","#D6F675"
];
chartColors.reverse();

const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  /*
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
*/
];

export const Basic = {
  args: {
    data: {
      labels,
      datasets: [
        {
          label: 'Dataset 1',
          data: [10, 20, 30],
          // backgroundColor: chartColors[0],
          // borderColor: chartColors[0],
        },
        {
          label: 'Dataset 2',
          data: [44, 23, 234],
          // backgroundColor: chartColors[1],
          // borderColor: chartColors[1],
        },
        {
          label: 'Dataset 3',
          data: [87, 20, 7],
          // backgroundColor: chartColors[2],
          // borderColor: chartColors[2],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Chart.js Line Chart',
        },
      },
    },
  },
};

const orgaDatasetMap = getOrgaDatasetsMap(metadatas);

const yearLables = new Set();
for (const [orgaName, value] of orgaDatasetMap) {
  const yearMap = value.yearMap;

  for (const year of yearMap.keys()) {
    yearLables.add(year);
  }
}

const yearsSorted = Array.from(yearLables).sort();

const series = organizationSeries(orgaDatasetMap, yearsSorted);

const stackedData = {
  labels: Array.from(yearLables).reverse(),
  datasets: [
    {
      label: 'Dataset 1',
      data: [10, 20, 30],
      //      backgroundColor: chartColors[0],
      borderColor: chartColors[0],
      fill: true,
    },
    {
      label: 'Dataset 2',
      data: [44, 23, 234],
      //      backgroundColor: chartColors[1],
      borderColor: chartColors[1],
      fill: true,
    },
    {
      label: 'Dataset 3',
      data: [87, 20, 7],
      //      backgroundColor: chartColors[2],
      borderColor: chartColors[2],
      fill: true,
    },
  ],
};

const stackedOptions = {
  plugins: {
    title: {
      display: true,
      text: 'Chart.js Line Chart - Stacked',
    },
  },
  responsive: true,
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false,
  },
  scales: {
    y: {
      stacked: true,
    },
  },
};

export const Stacked = {
  args: {
    data: stackedData,
    options: stackedOptions,
  },
};

export const StackedOrgasDatasetPerYear = {
  args: {
    data: {
      labels: yearsSorted,
      datasets: series,
    },
    options: stackedOptions,
  },
};
