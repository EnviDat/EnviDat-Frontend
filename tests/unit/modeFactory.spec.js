import {
  getModeData,
  getTagsMergedWithExtras,
  enhanceMetadataFromExtras,
} from '@/factories/modeFactory';

import { SWISSFL_MODE } from '@/store/metadataMutationsConsts';
import {
  swissFLExtraTags,
} from '@/modules/metadata/store/swissForestLabTags';

import metadataTags from '@/modules/metadata/store/metadataTags';

describe('modeFactory - getModeData', () => {
  it('empty', () => {

    try {
      getModeData(undefined);
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('with SwissFL mode', () => {

    const mode = getModeData(SWISSFL_MODE);

    expect(mode).toBeDefined();
    expect(mode.name).toBe(SWISSFL_MODE);
  });
});

describe('modeFactory - getTagsMergedWithExtras', () => {
  it('empty', () => {
    const mergedTags = getTagsMergedWithExtras(undefined, undefined);

    expect(mergedTags).toBeNull();
  });

  it('with SwissFL mode with empty tags', () => {

    const tags = [];
    const mergedTags = getTagsMergedWithExtras(SWISSFL_MODE, tags);

    expect(mergedTags).toBeDefined();
    expect(mergedTags).toBeInstanceOf(Array);
    expect(mergedTags.length).toBeLessThanOrEqual(swissFLExtraTags.length);
  });

  it('with SwissFL mode with tags', () => {

    const tags = metadataTags;
    const mergedTags = getTagsMergedWithExtras(SWISSFL_MODE, tags);

    expect(mergedTags).toBeDefined();
    expect(mergedTags).toBeInstanceOf(Array);
    expect(mergedTags.length).toBeLessThanOrEqual(swissFLExtraTags.length + metadataTags.length);
  });
});

describe('modeFactory - enhanceMetadataFromExtras', () => {
  it('empty', () => {
    const enhancedMetadata = enhanceMetadataFromExtras(undefined, undefined);

    expect(enhancedMetadata).toBeNull();
  });

  // it('with SwissFL mode', () => {
  //   const metdataEntry = {};

  //   const enhancedMetadata = enhanceMetadataFromExtras(SWISSFL_MODE, metdataEntry);

  //   expect(enhancedMetadata).toBeDefined();
  //   expect(enhancedMetadata.extras).toBeDefined();
  //   expect(enhancedMetadata.extras).toBeInstanceOf(Array);
  // });
});
