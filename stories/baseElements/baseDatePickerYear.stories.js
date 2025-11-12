/**
 * @summary story of BaseIconButton & BaseIconCountView for sandbox testing
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseDatePickerYear from '@/components/BaseElements/BaseDatePickerYear.vue';
import {
  mobileLargeViewportParams,
  mobileViewportParams,
  tabletViewportParams,
} from '@/../stories/js/envidatViewports';

export default {
  title: '1 Base / Pickers / Date picker Year',
  component: BaseDatePickerYear,
};

export const Empty = {};

export const Filled = {
  args: {
    year: '2023',
    yearLabel: 'PublicationYear',
  },
};

export const Clearable = {
  args: {
    ...Filled.args,
    isClearable: true,
  },
};

export const Readonly = {
  args: {
    ...Filled.args,
    isClearable: true,
    readOnlyFields: ['year'],
    readOnlyExplanation: 'THIS IS READONLY!!',
  },
};

export const MobileFilled = {
  args: Filled.args,
  parameters: mobileViewportParams,
};

export const MobileLargeFilled = {};
MobileLargeFilled.args = { ...Filled.args };
MobileLargeFilled.parameters = mobileLargeViewportParams;

export const TabletFilled = {};
TabletFilled.args = { ...Filled.args };
TabletFilled.parameters = tabletViewportParams;
