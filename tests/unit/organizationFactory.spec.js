import { it, describe, expect } from 'vitest';

import { getOrganizationTree } from '@/factories/organizationFactory';

import orgaMapProd from '../../stories/testdata/orgaMapProd.json';

describe('organizationFactory - getOrganizationTree', () => {
  it('recursive OrganizationTree', () => {

    const organiztionMap = new Map();
    const orgaEntries = Object.values(orgaMapProd);

    orgaEntries.map((entry) => organiztionMap.set(entry.key, entry.value));

    const tree = getOrganizationTree(organiztionMap);

    expect(tree).toBeDefined();
  });

});

