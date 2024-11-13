/**
 * @summary story of BaseIconButton & BaseIconCountView for sandbox testing
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseDatePicker from '@/components/BaseElements/BaseDatePicker.vue';
import { mobileLargeViewportParams, mobileViewportParams, tabletViewportParams } from './js/envidatViewports';

export default {
  title: '1 Base / Pickers / Date picker',
  decorators: [],
  component: BaseDatePicker,
};

export const Empty = {};

export const FilledAndClearable = {
  args: {
    date: '2023-02-05',
    dateLabel: 'Date',
    clearable: true,
    clearClick: () => {
      FilledAndClearable.args.date = '';
    },
  },
};

export const Readonly = {
  args: {
    ...FilledAndClearable.args,
    readOnlyFields: ['date'],
    readOnlyExplanation: 'THIS IS READONLY!!',
  },
};

export const WithMinDate = {
  args: {
    ...FilledAndClearable.args,
    minDate: '2023-02-05',
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

