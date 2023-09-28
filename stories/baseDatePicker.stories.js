/**
 * @summary story of BaseIconButton & BaseIconCountView for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2019-10-31 08:14:47
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseDatePicker from '@/components/BaseElements/BaseDatePicker.vue';
import { mobileLargeViewportParams, mobileViewportParams, tabletViewportParams } from './js/envidatViewports';


export default {
  title: '1 Base Elements / Date picker',
  decorators: [],
  component: BaseDatePicker,
};


export const Empty = {};

export const FilledAndClearable = {
  args: {
    date: '2023-02-05',
    dateLabel: 'Date',
    clearable: true,
  },
};

export const WithMinDate = {
  args: {
    ...FilledAndClearable.args,
    minDate: '2023-02-03',
  },
};

export const WithMinDateError = {
  args: {
    ...FilledAndClearable.args,
    minDate: '2023-02-11',
  },
};


export const WithMaxDate = {
  args: {
    ...FilledAndClearable.args,
    maxDate: '2023-02-21',
  },
};

export const WithMaxDateError = {
  args: {
    ...FilledAndClearable.args,
    maxDate: '2023-01-21',
  },
};

export const WithMinAndMaxDate = {
  args: {
    ...WithMinDate.args,
    ...WithMaxDate.args,
  },
};

export const WithMinAndMaxDateError = {
  args: {
    ...FilledAndClearable.args,
    date: '2023-02-02',
    minDate: '2023-02-03',
    maxDate: '2023-02-12',
  },
};


export const MobileWithMinAndMax = {
  args: {
    ...FilledAndClearable.args,
    ...WithMinAndMaxDate.args,
  },
};
MobileWithMinAndMax.parameters = mobileViewportParams;

export const MobileLargeWithMinAndMax = {};
MobileLargeWithMinAndMax.args = { ...MobileWithMinAndMax.args };
MobileLargeWithMinAndMax.parameters = mobileLargeViewportParams;

export const TabletWithMinAndMax = {};
TabletWithMinAndMax.args = { ...MobileWithMinAndMax.args };
TabletWithMinAndMax.parameters = tabletViewportParams;

