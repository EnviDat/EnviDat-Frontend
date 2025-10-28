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
import { metadataEditingSteps } from '@/factories/workflowEditing';
import {
  mobileLargeViewportParams,
  mobileViewportParams,
  tabletViewportParams,
} from '@/../stories/js/envidatViewports';

const datasetTitle =
  'Lens, Switzerland: Long-term forest meteorological data from the Long-term Forest Ecosystem Research Programme (LWF), from 1997 onwards';

export default {
  title: '6 Workflows / Editing Workflow',
  component: NavigationStepper,
};

export const EditingSteps = {
  args: {
    steps: metadataEditingSteps,
    initialStepTitle: metadataEditingSteps[0].title,
    datasetTitle,
  },
};

export const EditingStepsLoading = {
  args: {
    ...EditingSteps.args,
    loading: true,
  },
};

export const MobileEditingSteps = {
  args: EditingSteps.args,
  parameters: mobileViewportParams,
};

export const LargeMobileEditingSteps = {
  args: EditingSteps.args,
  parameters: mobileLargeViewportParams,
};

export const TabletEditingSteps = {
  args: EditingSteps.args,
  parameters: tabletViewportParams,
};
