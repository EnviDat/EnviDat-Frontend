// noinspection JSUnusedGlobalSymbols
/* eslint-disable */
/* eslint-disable import/no-extraneous-dependencies */

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

import MetadataResources from '@/modules/metadata/components/Metadata/MetadataResources.vue';

import { createLicense } from '@/factories/metaDataFactory';
import { createResources } from '@/factories/resourceHelpers';
import { getFrontendDates } from '@/factories/mappingFactory';

// metadata gets enhance in the storybook config
import metadata from '@/../stories/js/metadata';
import {
  mobileLargeViewportParams,
  mobileViewportParams,
  tabletViewportParams
} from '@/../stories/js/envidatViewports';

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
deprecatedResources1.resources[0].url = 'https://envicloud.wsl.ch/#/?bucket=https://envicloud.wsl.ch/edna/&prefix=su_ch/su_ch_birmen_2024';

export default {
  title: '3 Datasets / 1 Views / Resources',
  component: MetadataResources,
};

export const ShowingPlaceholders = {
  args: {
    resources: null,
    showPlaceholder: true,
  }
}

export const WithResources = {
  args: {
    dataLicenseId: license1.id,
    dataLicenseTitle: license1.title,
    dataLicenseUrl: license1.url,
    resources: resources1.resources,
    dates: resources1Dates,
    showPlaceholder: false,
    compactList: true,
  }
}

export const WithResourcesWideList = {
  args: {
    dataLicenseId: license1.id,
    dataLicenseTitle: license1.title,
    dataLicenseUrl: license1.url,
    resources: resources1.resources,
    dates: resources1Dates,
    showPlaceholder: false,
    compactList: false,
  }
}

export const WithDeprecatedResources = {
  args: {
    ...WithResources.args,
    resources: deprecatedResources1.resources,
  }
}

export const WithResourcesCC0License = {
  args: {
    ...WithResources.args,
    dataLicenseId: license2.id,
    dataLicenseTitle: license2.title,
    dataLicenseUrl: license2.url,
  }
}

export const WithProtectedResources = {
  args: {
    dataLicenseId: license2.id,
    dataLicenseTitle: license2.title,
    dataLicenseUrl: license2.url,
    resources: resources2.resources,
    dates: resources2Dates,
    showPlaceholder: false,
  }
}

export const WithResourcesCC0LicenseMobile = {
  args: WithResourcesCC0License.args,
  parameters: mobileViewportParams,
}

export const WithResourcesCC0LicenseLargeMobile = {
  args: WithResourcesCC0License.args,
  parameters: mobileLargeViewportParams,
}
export const WithResourcesCC0LicenseTable = {
  args: WithResourcesCC0License.args,
  parameters: tabletViewportParams,
}
