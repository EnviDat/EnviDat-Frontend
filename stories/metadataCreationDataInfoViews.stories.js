/**
 * @summary story of all the MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho and Rebecca Kurup Buchholz
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-08-11 16:50:47
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import EditDataInfo from '@/modules/user/components/EditDataInfo.vue';
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import {
  DATE_PROPERTY_DATE_TYPE,
  DATE_PROPERTY_END_DATE,
  DATE_PROPERTY_START_DATE,
} from '@/factories/mappingFactory';


export default {
  title: '9 Editing Metadata / Data Infos',
  decorators: [],
  parameters: {
    viewport: {
      viewports: MINIMAL_VIEWPORTS,
    },
  },
};

const mobileViewportParams =  { viewport: { defaultViewport: 'mobile1' } };
const mobileLargeViewportParams = { viewport: {defaultViewport: 'mobile2' } };
const tabletViewportParams = { viewport: { defaultViewport: 'tablet' } };

const Template = (args, { argTypes }) => ({
  components: { EditDataInfo },
  props: Object.keys(argTypes),
  template: '<EditDataInfo v-bind="$props" />',
});

const datesArrayEmpty = [{
  [DATE_PROPERTY_DATE_TYPE]: '',
  [DATE_PROPERTY_START_DATE]: '',
  [DATE_PROPERTY_END_DATE]: '',
}];

const datesArrayFilled = [
  {
    [DATE_PROPERTY_DATE_TYPE]: 'collected',
    [DATE_PROPERTY_START_DATE]: '01-08-2006',
    [DATE_PROPERTY_END_DATE]: '06-09-2007',
  },
  {
    [DATE_PROPERTY_DATE_TYPE]: 'created',
    [DATE_PROPERTY_START_DATE]: '01-08-2006',
    [DATE_PROPERTY_END_DATE]: '06-09-2007',
  },
  {
    [DATE_PROPERTY_DATE_TYPE]: 'collected',
    [DATE_PROPERTY_START_DATE]: '01-08-2006',
    [DATE_PROPERTY_END_DATE]: '06-09-2007',
  },
];

export const EditDataInfoEmpty = Template.bind({});
EditDataInfoEmpty.args = { dates: datesArrayEmpty };
export const EditDataInfoFilled = Template.bind({});
EditDataInfoFilled.args = {
  dates: datesArrayFilled,
  dataLicenseId: 'odc-odbl',
};

export const MobileEditDataInfo1 = Template.bind({});
MobileEditDataInfo1.args = { ...EditDataInfoFilled.args };
MobileEditDataInfo1.parameters = mobileViewportParams;

export const MobileLargeEditDataInfo1 = Template.bind({});
MobileLargeEditDataInfo1.args = { ...EditDataInfoFilled.args };
MobileLargeEditDataInfo1.parameters = mobileLargeViewportParams;

export const TabletEditDataInfo1 = Template.bind({});
TabletEditDataInfo1.args = { ...EditDataInfoFilled.args };
TabletEditDataInfo1.parameters = tabletViewportParams;
