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

import SparkChart from '@/components/Charts/SparkChart.vue';

export default {
  title: '1 Base / Charts / Spark Chart',
  component: SparkChart,
};

const labels = ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'];

const data = [200, 675, 410, 390, 310, 460, 250, 240];

export const Empty = {};

export const Loading = {
  args: {
    loading: true,
  },
};

export const Trend = {
  args: {
    labels,
    data,
  },
};

export const TrendNoLabels = {
  args: {
    data,
  },
};

export const TrendWithBorder = {
  args: {
    data,
    showCardBorder: true,
  },
};

export const Bar = {
  args: {
    ...Trend.args,
    type: 'bar',
  },
};

export const BarNoLabels = {
  args: {
    ...TrendNoLabels.args,
    type: 'bar',
  },
};
