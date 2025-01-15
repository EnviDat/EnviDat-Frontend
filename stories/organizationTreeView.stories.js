/* eslint-disable object-property-newline */
/**
 * @summary story of all the Editing Author MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-10-07 13:12:18
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import OrganizationTree from '@/modules/user/components/OrganizationTree.vue';

import { getOrganizationRelationMap, getOrganizationTree } from '@/factories/organizationFactory';
import testOrganizations from './js/organizations';

// const organizationsMap = getOrganizationMapObject(testOrganizations);
const orgaMap = getOrganizationRelationMap(testOrganizations);
const organizationsTree = getOrganizationTree(orgaMap);

export default {
  title: '3 Dataset / 1 Views / Organization Tree',
  component: OrganizationTree,
};

export const Default = {
  args: {
    organizationsTree,
    selectionDisabled: false,
  },
}

