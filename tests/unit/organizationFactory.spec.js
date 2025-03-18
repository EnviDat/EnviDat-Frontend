import { it, describe, expect } from 'vitest';

import { getOrganizationRelationMap, getOrganizationTree, getTopOrganizations } from '@/factories/organizationFactory';

import orgaMapProd from '../../stories/testdata/orgaMapProd.json';

describe('organizationFactory - getOrganizationTree', () => {
  it('recursive OrganizationTree', () => {

    const orgaEntries = Object.values(orgaMapProd);
    let orgas = [];
    orgaEntries.forEach((entry) => {
      orgas = [...orgas, ...entry.value];
    });

    const orgaMap = getOrganizationRelationMap(orgas);
    const topOrgas = getTopOrganizations(orgas);
    const tree = getOrganizationTree(topOrgas, orgaMap);

    expect(tree).toBeDefined();
    expect(tree.length > 0).toBeTruthy();
  });

});

