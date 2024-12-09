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

import EditOrganizationTree from '@/modules/user/components/EditOrganizationTree.vue';

import { getOrganizationMap, getOrganizationTree } from '@/factories/organizationFactory';

import organizationList from '~/public/testdata/organization_show.json';

const orgaMap = getOrganizationMap(organizationList.result);
const organizationsTree = getOrganizationTree(orgaMap);

// const organizationsTree = getOrganizationMapObject(testOrganizations);
// const organizationsTree2 = { ...organizationsTree };

export default {
  title: '3 Dataset / 2 Edit / Organization Tree',
  component: EditOrganizationTree,
};

export const Default = {
  args: {
    organizationsTree,
    selectionDisabled: false,
  },
}

export const PreselectedOrganization = {
  args: {
    organizationsTree,
    organization: 'community-ecology',
    selectionDisabled: true,
  },
}
