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
import {
  enhanceDatasetWithResearchUnit,
  getOrgaDatasetsMap,
  getOrganizationRelationMap,
  getOrganizationTree,
  getTopOraganizations,
} from '@/factories/organizationFactory';

import metadatas from '@/../public/packagelist.json';
import researchUnits from '@/../public/researchUnits.json';
import testOrganizations from '@/../stories/js/organizations';

const datasets = enhanceDatasetWithResearchUnit(metadatas.result, researchUnits);
const orgaMap = getOrganizationRelationMap(testOrganizations);
const topOrgas = getTopOraganizations(testOrganizations);
const orgaDatasetsMap = getOrgaDatasetsMap(datasets);
const organizationsTree = getOrganizationTree(topOrgas, orgaMap, orgaDatasetsMap);

export default {
  title: '8 Organization / Organization Tree',
  component: OrganizationTree,
};

export const Default = {
  args: {
    organizationsTree,
    selectionDisabled: false,
  },
}

