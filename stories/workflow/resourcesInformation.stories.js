/**
 * @summary story of all the MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-10-29 20:26:06
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import ResourcesInformation from '@/modules/workflow/components/steps/ResourcesInformation.vue';

import { createLicense } from '@/factories/metaDataFactory.js';
import { createResources } from '@/factories/resourceHelpers.js';
import { getFrontendDates } from '@/factories/mappingFactory.js';

// metadata gets enhance in the storybook config
import metadata from '~/stories/js/metadata.js';
import {
  mobileLargeViewportParams,
  mobileViewportParams,
  tabletViewportParams,
} from '~/stories/js/envidatViewports.js';
import { ResourcesListViewModel } from '@/modules/workflow/viewModel/ResourcesListViewModel.js';
import { CustomFieldsViewModel } from '@/modules/workflow/viewModel/CustomFieldsViewModel.js';

const resources1 = createResources(metadata[0]);
const resources2 = createResources(metadata[2]);

const license1 = createLicense(metadata[1]);
const license2 = createLicense(metadata[2]);

const resources1Dates = getFrontendDates(metadata[1].date);
const resources2Dates = getFrontendDates(metadata[2].date);

const deprecatedMetadata = metadata[3];

for (let j = 0; j < deprecatedMetadata.resources.length; j++) {
  const res = deprecatedMetadata.resources[j];
  if (j % 2 === 0) {
    res.deprecated = true;
  }
}

const deprecatedResources1 = createResources(deprecatedMetadata);
deprecatedResources1.resources[0].url =
  'https://envicloud.wsl.ch/#/?bucket=https://envicloud.wsl.ch/edna/&prefix=su_ch/su_ch_birmen_2024';

export default {
  title: '6 Workflows / Resource List',
  component: ResourcesInformation,
};

const emptyVM = new ResourcesListViewModel(undefined, undefined, undefined);
export const Empty = {
  args: emptyVM,
};

export const Loading = {
  args: {
    ...emptyVM,
    loading: true,
  },
};

const customFieldVM = new CustomFieldsViewModel(metadata[0], undefined);
const vm = new ResourcesListViewModel(metadata[0], undefined, customFieldVM.isResourceDeprecated);
export const WithResources = {
  args: vm,
};

const deprecatedCustomFieldVM = new CustomFieldsViewModel(deprecatedMetadata, undefined);
const deprecatedVm = new ResourcesListViewModel(
  deprecatedMetadata,
  undefined,
  deprecatedCustomFieldVM.isResourceDeprecated,
);
export const WithDeprecatedResources = {
  args: deprecatedVm,
};

export const WithProtectedResources = {
  args: {
    dataLicenseId: license2.id,
    dataLicenseTitle: license2.title,
    dataLicenseUrl: license2.url,
    resources: resources2.resources,
    dates: resources2Dates,
    showPlaceholder: false,
  },
};

export const WithResourcesMobile = {
  args: WithResources.args,
  parameters: mobileViewportParams,
};

export const WithResourcesLargeMobile = {
  args: WithResources.args,
  parameters: mobileLargeViewportParams,
};
export const WithResourcesTable = {
  args: WithResources.args,
  parameters: tabletViewportParams,
};
