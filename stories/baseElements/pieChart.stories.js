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

import PieChart from '@/components/Charts/PieChart.vue';

export default {
  title: '1 Base / Charts / PieChart',
  component: PieChart,
  //  decorators: [() => ({ template: '<div style="height: 500px;"><story/></div>' })],
};

export const Basic = {
  args: {
    data: {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [
        {
          label: 'My First Dataset',
          data: [300, 50, 100],
          backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
          hoverOffset: 4,
        },
      ],
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
};
