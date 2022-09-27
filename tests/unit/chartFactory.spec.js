import {
  getConfigFiles,
  getConfigUrls,
} from '@/factories/chartFactory';

import dataset from '@/../public/testdata/testResoures.json';


describe('chartFactory - getConfigFiles()', () => {
  it('with testResources', () => {
    const resources = dataset.resources;
    expect(resources).not.toBeNull();
    
    const configs = getConfigFiles(resources);
    getConfigUrls(configs);

    expect(resources[0].hideFromResourceList).toBeTruthy();
    expect(resources[1].hideFromResourceList).toBeTruthy();
  });

});
