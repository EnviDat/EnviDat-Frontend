import { it, describe, expect } from 'vitest';

import {
  getModeData,
  enhanceMetadataWithModeExtras,
} from '@/factories/modeFactory';

import {
  EDNA_MODE,
  EDNA_MODE_EXTRAS_KEY,
  SWISSFL_MODE,
  SWISSFL_MODE_EXTRAS_KEY,
} from '@/store/metadataMutationsConsts';
import {
  swissFLExtraTags,
} from '@/modules/metadata/store/swissForestLabTags';

import metadataTags from '@/modules/metadata/store/metadataTags';
import { getTagsMergedWithExtras } from '@/factories/keywordsFactory';

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
    expect(mode.title).toBeDefined();
    expect(mode.externalUrl).toBeDefined();
    expect(mode.mainTag).toBeDefined();
    expect(mode.logo).toBeDefined();
    expect(mode.icons).toBeDefined();
    expect(mode.extrasKey).toBe(SWISSFL_MODE_EXTRAS_KEY);
  });

  it('with eDNA mode', () => {

    const mode = getModeData(EDNA_MODE);

    expect(mode).toBeDefined();
    expect(mode.name).toBe(EDNA_MODE);
    expect(mode.title).toBeDefined();
    expect(mode.externalUrl).toBeDefined();
    expect(mode.mainTag).toBeDefined();
    expect(mode.logo).toBeDefined();
    expect(mode.icons).toBeDefined();
    expect(mode.extrasKey).toBe(EDNA_MODE_EXTRAS_KEY);
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
    const enhancedMetadata = enhanceMetadataWithModeExtras();

    expect(enhancedMetadata).toBeUndefined();
  });

  // it('with SwissFL mode', () => {
  //   const metdataEntry = {};

  //   const enhancedMetadata = enhanceMetadataFromExtras(SWISSFL_MODE, metdataEntry);

  //   expect(enhancedMetadata).toBeDefined();
  //   expect(enhancedMetadata.extras).toBeDefined();
  //   expect(enhancedMetadata.extras).toBeInstanceOf(Array);
  // });
});
