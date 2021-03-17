import {
  getConfigFiles,
  getGcnetStationsConfigs,
} from '@/factories/chartFactory';

import dataset from '@/../public/testdata/testResoures';


describe('authorFactory - createAuthors', () => {
  it('empty', () => {
    const resources = dataset.resources;
    expect(resources).not.toBeNull();
    
    const configs = getConfigFiles(resources);
    getGcnetStationsConfigs(configs);

    expect(resources[0].hideFromResourceList).toBeTruthy();
    expect(resources[1].hideFromResourceList).toBeTruthy();
  });

});
