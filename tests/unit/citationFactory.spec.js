import { it, describe, expect } from 'vitest';

import { extractDOIsFromText, getDoraDoisUrl } from '@/factories/citationFactory';

describe('citationFactory - getDoraDoisUrl', () => {
  it('single DOI Url', () => {
    const text = 'https://doi.org/10.1093/icesjms/fsad139.';
    const doiUrlMap = extractDOIsFromText(text);
    const doraUrl = getDoraDoisUrl(doiUrlMap);

    expect(doraUrl).toBeDefined();
    expect(doraUrl.includes('~slsh~')).toBeTruthy();
    expect(doraUrl.split('~slsh~').length > 0).toBeTruthy();
  });

  it('single DOI only number', () => {
    const text = '10.1093/icesjms/fsad139.';
    const doiUrlMap = extractDOIsFromText(text);
    const doraUrl = getDoraDoisUrl(doiUrlMap);

    expect(doraUrl).toBeDefined();
    expect(doraUrl.includes('~slsh~')).toBeTruthy();
    expect(doraUrl.split('~slsh~').length > 0).toBeTruthy();
  });

  it('single DOI with DOI prefix and no separator', () => {
    const text = 'DOI10.1111/j.1469-8137.2009.02954.x';
    const doiUrlMap = extractDOIsFromText(text);
    const doraUrl = getDoraDoisUrl(doiUrlMap);

    expect(doiUrlMap.has('10.1111/j.1469-8137.2009.02954.x')).toBeTruthy();
    expect(doraUrl).toContain('10.1111~slsh~j.1469-8137.2009.02954.x');
  });

  it('multiple DOIs', () => {
    const text = `https://www.doi.org/10.16904/envidat.442.
    \n https://doi.org/10.1093/icesjms/fsad139.
    \n 10.1093/icesjms/fsad139.`;
    const doiUrlMap = extractDOIsFromText(text);
    const doraUrl = getDoraDoisUrl(doiUrlMap);

    expect(doraUrl).toBeDefined();
    expect(
      doraUrl.split('https://www.dora.lib4ri.ch/wsl/islandora/search/json_cit_wsl/mods_identifier_doi_mt').length > 0,
    ).toBeTruthy();
  });
});
