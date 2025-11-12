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
import { metadataCreationSteps } from '@/factories/workflowCreation';
import {
  mobileLargeViewportParams,
  mobileViewportParams,
  tabletViewportParams,
} from '@/../stories/js/envidatViewports';

const datasetTitle =
  'Lens, Switzerland: Long-term forest meteorological data from the Long-term Forest Ecosystem Research Programme (LWF), from 1997 onwards';

export default {
  title: '6 Workflows / Creation Workflow',
  component: NavigationStepper,
};

export const CreationSteps = {
  args: {
    steps: metadataCreationSteps,
    initialStepTitle: metadataCreationSteps[0].title,
    datasetTitle,
    isCreationWorkflow: true,
    showProgress: true,
  },
};

export const CreationStepsMessage = {
  args: {
    ...CreationSteps.args,
    message: 'Saved successfull',
    messageDetails: 'Saved Metadataheader',
  },
};

export const CreationStepsError = {
  args: {
    ...CreationSteps.args,
    error: 'Network Error',
    errorDetails: 'Could not save the dataset',
  },
};

export const CreationStepsLoading = {
  args: {
    ...CreationSteps.args,
    loading: true,
  },
};

export const MobileCreationSteps = {
  args: CreationSteps.args,
  parameters: mobileViewportParams,
};

export const LargeMobileCreationSteps = {
  args: CreationSteps.args,
  parameters: mobileLargeViewportParams,
};

export const TabletCreationSteps = {
  args: CreationSteps.args,
  parameters: tabletViewportParams,
};
