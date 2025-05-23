/* eslint-disable object-property-newline */
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

import {
  EDITMETADATA_DATA_RESOURCE,
} from '@/factories/eventBus';

import EditResource from '@/modules/user/components/EditResource.vue';

import {
  enhanceElementsWithStrategyEvents,
  SELECT_EDITING_RESOURCE_PROPERTY,
} from '@/factories/strategyFactory';

import {
  cleanListForFrontend,
  enhanceUserObject,
  mergeResourceSizeForFrontend,
} from '@/factories/mappingFactory';

import unFormatedMetadata from './js/metadata';
import userList from './testdata/user_list.json';

const envidatUsers = userList?.result || [];

for (let i = 0; i < envidatUsers.length; i++) {
  envidatUsers[i] = enhanceUserObject(envidatUsers[i]);
}

const allResources = [];

// console.log(`got metadata ${!!unFormatedMetadata}`);

for (let i = 0; i < unFormatedMetadata.length; i++) {
  const dataset = unFormatedMetadata[i];
  let resources = cleanListForFrontend(
    dataset.resources,
    EDITMETADATA_DATA_RESOURCE,
  );

  for (let j = 0; j < resources.length; j++) {
    const resource = resources[j];
    if (resource.restricted && typeof resource.restricted === 'string') {
      try {
        resource.restricted = JSON.parse(resource.restricted);
      } catch (e) {
        console.log(
          `resource failed ${resource.name} restricted ${resource.restricted}`,
        );
        console.error(e);
      }
    }
  }

  resources = enhanceElementsWithStrategyEvents(
    resources,
    SELECT_EDITING_RESOURCE_PROPERTY,
    true,
  );
  allResources.push(resources);
}

const deprecatedResources = [...allResources[1], ...allResources[2]];

deprecatedResources[1].deprecated = true;
deprecatedResources[2].deprecated = true;

export default {
  title: '3 Datasets / 2 Edit / Resource',
  component: EditResource,
};

const userEditMetadataConfig = {
  editingRestrictingActive: true,
};

export const Empty = {}

export const Filled = {
  args: {
    ...allResources[0][0],
    ...mergeResourceSizeForFrontend(allResources[0][0]),
    userEditMetadataConfig,
    envidatUsers,
  },
}

export const Filled2 = {
  args: {
    ...Filled.args,
    ...allResources[0][1],
    ...mergeResourceSizeForFrontend(allResources[0][1]),
  },
}

export const Filled3 = {
  args: {
    ...Filled.args,
    ...allResources[2][0],
    ...mergeResourceSizeForFrontend(allResources[2][0]),
  },
}

export const FilledAndDisabled = {
  args: {
    ...allResources[2][2],
    loading: true,
    envidatUsers,
  },
}
