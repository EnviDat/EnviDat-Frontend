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

/* eslint-disable import/no-extraneous-dependencies */
import BaseDatePicker from '@/components/BaseElements/BaseDatePicker.vue';
import { envidatViewportParameters, mobileLargeViewportParams, mobileViewportParams, tabletViewportParams } from './js/envidatViewports';
/*
import { EDITMETADATA_OBJECT_UPDATE, eventBus } from '@/factories/eventBus';
*/

export default {
  title: '1 Base Elements / Date picker',
  decorators: [],
  parameters: {
    ...envidatViewportParameters,
  },
};


const Template = (args, { argTypes }) => ({
  components: { BaseDatePicker },
  props: Object.keys(argTypes),
  template: '<BaseDatePicker v-bind="$props" />',
/*
  created() {
    eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.updateDataInfo);
  },
  beforeDestroy() {
    eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.updateDataInfo);
  },
  methods: {
    updateDataInfo (dataObject) {
      this.$props.dataLicenseId = dataObject.data.dataLicenseId;
    },
  },
*/
});

export const Empty = Template.bind({});

export const FilledAndClearable = Template.bind({});
FilledAndClearable.args = {
  date: '2023-02-05',
  dateLabel: 'Date',
  clearable: true,
};

export const WithMinDate = Template.bind({});
WithMinDate.args = {
  ...FilledAndClearable.args,
  minDate: '2023-02-03',
};

export const WithMinDateError = Template.bind({});
WithMinDateError.args = {
  ...FilledAndClearable.args,
  minDate: '2023-02-11',
};


export const WithMaxDate = Template.bind({});
WithMaxDate.args = {
  ...FilledAndClearable.args,
  maxDate: '2023-02-21',
};

export const WithMaxDateError = Template.bind({});
WithMaxDateError.args = {
  ...FilledAndClearable.args,
  maxDate: '2023-01-21',
};

export const WithMinAndMaxDate = Template.bind({});
WithMinAndMaxDate.args = {
  ...WithMinDate.args,
  ...WithMaxDate.args,
};

export const WithMinAndMaxDateError = Template.bind({});
WithMinAndMaxDateError.args = {
  ...FilledAndClearable.args,
  date: '2023-02-02',
  minDate: '2023-02-03',
  maxDate: '2023-02-12',
};
