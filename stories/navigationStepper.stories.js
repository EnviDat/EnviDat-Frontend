// noinspection JSUnusedGlobalSymbols
/* eslint-disable object-property-newline */
/* eslint-disable import/no-extraneous-dependencies */
/**
 * @summary story of all the Navigation components for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-08-18 13:06:31
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import NavigationStepper from '@/components/Navigation/NavigationStepper.vue';
import { metadataCreationSteps, metadataEditingSteps } from '@/factories/workflowFactory';
import { mobileLargeViewportParams, mobileViewportParams, tabletViewportParams } from './js/envidatViewports';

const datasetTitle = 'Lens, Switzerland: Long-term forest meteorological data from the Long-term Forest Ecosystem Research Programme (LWF), from 1997 onwards';

export default {
  title: '5 Navigation / NavigationStepper',
  decorators: [],
  parameters: {},
};

const Template = (args, { argTypes }) => ({
  components: { NavigationStepper },
  props: Object.keys(argTypes),
  template: '<NavigationStepper v-bind="$props"  />',
});

export const CreationSteps = Template.bind({});
CreationSteps.args = {
  steps: metadataCreationSteps,
  initialStepTitle: metadataCreationSteps[0].title,
  datasetTitle,
  isCreationWorkflow: true,
  showProgress: true,
}

export const CreationStepsMessage = Template.bind({});
CreationStepsMessage.args = {
  ...CreationSteps.args,
  message: 'Saved successfull',
  messageDetails: 'Saved Metadataheader',
}

export const CreationStepsError = Template.bind({});
CreationStepsError.args = {
  ...CreationSteps.args,
  error: 'Network Error',
  errorDetails: 'Could not save the dataset',
}

export const CreationStepsLoading = Template.bind({});
CreationStepsLoading.args = {
  ...CreationSteps.args,
  loading: true,
}

export const EditingSteps = Template.bind({});
EditingSteps.args = {
  steps: metadataEditingSteps,
  initialStepTitle: metadataEditingSteps[0].title,
  datasetTitle,
}

export const EditingStepsLoading = Template.bind({});
EditingStepsLoading.args = {
  ...EditingSteps.args,
  loading: true,
}

export const MobileCreationSteps = Template.bind({});
MobileCreationSteps.args = { ...CreationSteps.args };
MobileCreationSteps.parameters = mobileViewportParams;

export const MobileEditingSteps = Template.bind({});
MobileEditingSteps.args = { ...EditingSteps.args };
MobileEditingSteps.parameters = mobileViewportParams;

export const LargeMobileCreationSteps = Template.bind({});
LargeMobileCreationSteps.args = { ...CreationSteps.args };
LargeMobileCreationSteps.parameters = mobileLargeViewportParams;

export const LargeMobileEditingSteps = Template.bind({});
LargeMobileEditingSteps.args = { ...EditingSteps.args };
LargeMobileEditingSteps.parameters = mobileLargeViewportParams;

export const TabletCreationSteps = Template.bind({});
TabletCreationSteps.args = { ...CreationSteps.args };
TabletCreationSteps.parameters = tabletViewportParams;

export const TabletEditingSteps = Template.bind({});
TabletEditingSteps.args = { ...EditingSteps.args };
TabletEditingSteps.parameters = tabletViewportParams;
