import { it, describe, expect } from 'vitest';

import { getOrganizationMap, getOrganizationTree } from '@/factories/organizationFactory';

import orgaMapProd from '../../stories/testdata/orgaMapProd.json';

describe('organizationFactory - getOrganizationTree', () => {
  it('recursive OrganizationTree', () => {

    const orgaEntries = Object.values(orgaMapProd);
    let orgas = [];
    orgaEntries.forEach((entry) => {
      orgas = [...orgas, ...entry.value];
    });

    const orgaMap = getOrganizationMap(orgas);
    const tree = getOrganizationTree(orgaMap);

    expect(tree).toBeDefined();
    expect(tree.length > 0).toBeTruthy();
  });

});

