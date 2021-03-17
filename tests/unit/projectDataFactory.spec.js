
import packagelist from '@/../public/testdata/packagelist';
import projectJSON from '@/../public/testdata/projects';
import {
  enhanceSubprojectsFromExtras,
  enhanceProjectDatasets,
} from '../../src/factories/projectsDataFactory';

const metadatasContent = {};
packagelist.result.forEach((entry) => {
  metadatasContent[entry.id] = entry;
});

describe('projectsDataFactory - enhanceSubprojectsFromExtras', () => {

  it('empty', () => {
    const enhanced = enhanceSubprojectsFromExtras(undefined);
    expect(enhanced).toBeDefined();
    expect(enhanced.length).toEqual(0);
  });

});

describe('projectsDataFactory - enhanceProjectDatasets', () => {
  it('empty', () => {

    const enhanced = enhanceProjectDatasets(undefined, null);

    expect(enhanced).toBeDefined();
    expect(enhanced.length).toEqual(0);
  });

  it('Enhanced Tags', () => {

    const enhanced = enhanceProjectDatasets(projectJSON.result, metadatasContent);

    for (let i = 0; i < enhanced.length; i++) {
      const pro = enhanced[i];

      for (let j = 0; j < pro.packages.length; j++) {
        const dataset = pro.packages[j];

        expect(dataset.tags).toBeDefined();

        for (let k = 0; k < dataset.tags.length; k++) {
          const tag = dataset.tags[k];

          expect(tag).toBeDefined();
          expect(tag.name).toBeDefined();
          // expect(tag.enabled).toBeDefined();
          // expect(tag.count).toBeDefined();
        }
      }

    }

  });

});
