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
import {
  DATE_PROPERTY_DATE_TYPE,
  DATE_PROPERTY_END_DATE,
  DATE_PROPERTY_START_DATE,
  METADATA_DATALICENSE_PROPERTY,
} from '@/factories/metadataConsts';
import { EDITMETADATA_OBJECT_UPDATE, eventBus } from '@/factories/eventBus';
import { CC_BY_SA_LICENSE_ID, OTHER_UNDEFINED_LICENSE_ID, WSL_DATA_LICENSE_ID } from '@/factories/dataLicense';
import { mobileLargeViewportParams, mobileViewportParams, tabletViewportParams } from './js/envidatViewports';


export default {
  title: '3 Datasets / 2 Edit / Data Info',
  component: EditDataInfo,
};


const Template = {
  render: (args, { argTypes }) => ({
    components: { EditDataInfo },
    props: Object.keys(argTypes),
    template: '<EditDataInfo v-bind="$props" />',
    created() {
      eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.updateDataInfo);
    },
    beforeUnmount() {
      eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.updateDataInfo);
    },
    methods: {
      updateDataInfo(dataObject) {
        if (dataObject.data.dataLicenseId) {
          this.$props.dataLicenseId = dataObject.data.dataLicenseId;
        }
      },
    },
  }),
}

const datesArrayFilled = [
  {
    [DATE_PROPERTY_DATE_TYPE]: 'collected',
    [DATE_PROPERTY_START_DATE]: '2023-02-28',
    [DATE_PROPERTY_END_DATE]: '2023-03-01',
  },
  {
    [DATE_PROPERTY_DATE_TYPE]: 'created',
    [DATE_PROPERTY_START_DATE]: '2023-01-05',
    [DATE_PROPERTY_END_DATE]: '2023-05-05',
  },
  {
    [DATE_PROPERTY_DATE_TYPE]: 'collected',
    [DATE_PROPERTY_START_DATE]: '2019-08-01',
    [DATE_PROPERTY_END_DATE]: '2023-09-01',
  },
  {
    [DATE_PROPERTY_DATE_TYPE]: 'modeled',
    [DATE_PROPERTY_START_DATE]: '2021-08-01',
    [DATE_PROPERTY_END_DATE]: '2023-09-01',
  },
];

export const EditDataInfoEmpty = {
  ...Template,
  args: {},
};

export const EditDataInfoFilled = {
  ...Template,
  args: {
    dates: datesArrayFilled,
    dataLicenseId: CC_BY_SA_LICENSE_ID,
  },
};

export const EditDataInfoReadonly = {
  ...Template,
  args: {
    dates: datesArrayFilled,
    dataLicenseId: CC_BY_SA_LICENSE_ID,
    readOnlyFields: [
      METADATA_DATALICENSE_PROPERTY,
      DATE_PROPERTY_START_DATE,
      DATE_PROPERTY_END_DATE,
    ],
    readOnlyExplanation: 'Fields are readonly for testing!',
  },
};


export const EditDataInfoReadonlyWslDataPolicy = {
  ...Template,
  args: {
    ...EditDataInfoReadonly.args,
    dataLicenseId: WSL_DATA_LICENSE_ID,
    readOnlyExplanation: 'License should not be readonly, the WSL DATA Policy should be possible to change!',
  },
};

export const EditDataInfoReadonlyOther = {
  ...Template,
  args: {
    ...EditDataInfoReadonly.args,
    dataLicenseId: OTHER_UNDEFINED_LICENSE_ID,
    readOnlyExplanation: 'License should not be readonly, the Other should be possible to change',
  },
};

export const MobileEditDataInfo1 = {
  ...Template,
  args: { ...EditDataInfoFilled.args },
  parameters: mobileViewportParams,
};

export const MobileLargeEditDataInfo1 = {
  ...Template,
  args: { ...EditDataInfoFilled.args },
  parameters: mobileLargeViewportParams,
};

export const TabletEditDataInfo1 = {
  ...Template,
  args: { ...EditDataInfoFilled.args },
  parameters: tabletViewportParams,
};
