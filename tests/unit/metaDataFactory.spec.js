import { it, describe, expect } from 'vitest';

import {
  createHeader,
  createBody,
  createFunding,
  createLicense,
  createPublications,
  createDetails,
  enhanceTitleImg,
} from '@/factories/metaDataFactory';

import { createResource } from '@/factories/resourceHelpers';

import { createCitation, extractPIDMapFromText } from '@/factories/citationFactory';

import packagelist from '@/../stories/testdata/packagelist.json';
import { enhanceKeywords } from '@/factories/keywordsFactory';
import categoryCards from '@/store/categoryCards';
import { formatDate } from '@/factories/dateFactory';
import { METADATA_CONTACT_EMAIL, METADATA_CONTACT_FULLNAME, METADATA_TITLE_PROPERTY } from '@/factories/metadataConsts';

// const metadatasContent = {};
// packagelist.result.forEach((entry) => {
//   metadatasContent[entry.id] = entry;
// });

describe('metaDataFactory - createHeader', () => {
  it('empty', () => {
    const header = createHeader(undefined);
    expect(header).toBeNull();
  });

  it('with dataset', () => {
    const dataset = packagelist.result[2];

    const header = createHeader(dataset);

    expect(header).toBeDefined();
    expect(header[METADATA_TITLE_PROPERTY]).toBeDefined();
    expect(header.doi).toBeDefined();
    expect(header[METADATA_CONTACT_FULLNAME]).toBeDefined();
    expect(header[METADATA_CONTACT_EMAIL]).toBeDefined();
    expect(header.tags).toBeDefined();
    expect(header.titleImg).toBe(dataset.titleImg);
    expect(header.maxTags).toBeDefined();
    expect(header.authors).toBeDefined();
    expect(header.organization).toBeDefined();
    expect(header.organizationTooltip).toBeDefined();
  });
});

describe('metaDataFactory - createBody', () => {
  it('empty', () => {
    const body = createBody(undefined);
    expect(body).toBeNull();
  });

  it('with dataset', () => {
    const dataset = packagelist.result[3];

    const body = createBody(dataset);

    expect(body).toBeDefined();
    expect(body.text).toBeDefined();
    expect(body.maxTextLength).toBeDefined();
  });

  it('with dataset, compare maxTextLength', () => {
    const dataset = packagelist.result[3];

    const body = createBody(dataset, true);
    const body2 = createBody(dataset, false);

    expect(body.maxTextLength).not.toBe(body2.maxTextLength);
  });
});

describe('metaDataFactory - createFunding', () => {
  it('empty', () => {
    const funding = createFunding(undefined);
    expect(funding).toBeNull();
  });

  it('with dataset', () => {
    const dataset = packagelist.result[3];

    const funding = createFunding(dataset);

    expect(funding).toBeDefined();
    expect(typeof funding).toBe('object');
  });
});

describe('metaDataFactory - createCitation', () => {
  it('empty', () => {
    const citation = createCitation(undefined);
    expect(citation).toBeNull();
  });

  it('with dataset', () => {
    const dataset = packagelist.result[4];

    const citation = createCitation(dataset);

    expect(citation).toBeDefined();
    expect(citation.id).toBeDefined();
    expect(citation.citationText).toBeDefined();

    expect(citation.citationXmlLink).toBeDefined();
    expect(citation.citationIsoXmlLink).toBeDefined();
    expect(citation.citationGCMDXmlLink).toBeDefined();

    expect(citation.citationBibtexXmlLink).toBeDefined();
    expect(citation.citationBibtexXmlLink.includes('bib')).toBeTruthy();

    expect(citation.citationRisXmlLink).toBeDefined();
    expect(citation.citationRisXmlLink.includes('ris')).toBeTruthy();
  });
});

describe('metaDataFactory - createResource', () => {
  it('empty', () => {
    const res = createResource(undefined);
    expect(res).toBeNull();
  });

  it('with dataset', () => {
    const dataset = packagelist.result[4];

    const res = createResource(dataset);

    expect(res).toBeDefined();
    expect(res.id).toBeDefined();
    expect(res.size).toBeDefined();

    expect(res.doi).toBeDefined();

    expect(res.name).toBeDefined();
    expect(res.url).toBeDefined();

    expect(res.url).toBeDefined();
    expect(res.restricted).toBeDefined();
    expect(res.format).toBeDefined();
    expect(res.state).toBeDefined();

    expect(res.created).toBeDefined();
    expect(res.lastModified).toBeDefined();

    expect(res.position).toBeDefined();
    expect(res.isProtected).toBeDefined();
  });
});

describe('metaDataFactory - createLicense', () => {
  it('empty', () => {
    const license = createLicense(undefined);
    expect(license).toBeNull();
  });

  it('with dataset', () => {
    const dataset = packagelist.result[3];

    const license = createLicense(dataset);

    expect(license).toBeDefined();
    expect(license.id).toBeDefined();
    expect(license.title).toBeDefined();
    expect(license.url).toBeDefined();
  });
});

describe('metaDataFactory - createPublications', () => {
  it('empty', () => {
    const pub = createPublications(undefined);
    expect(pub).toBeNull();
  });

  it('with dataset', () => {
    const dataset = packagelist.result[6];

    const pub = createPublications(dataset);

    expect(pub).toBeDefined();
    expect(pub.text).toBeDefined();
    expect(pub.maxTextLength).toBeDefined();
  });
});

describe('metaDataFactory - createDetails', () => {
  it('empty', () => {
    const details = createDetails(undefined);
    expect(details).toBeNull();
  });

  it('with dataset', () => {
    const dataset = packagelist.result[6];

    const details = createDetails(dataset);

    expect(details).toBeDefined();

    for (let i = 0; i < details.length; i++) {
      const detail = details[i];

      expect(detail.label).toBeDefined();
      expect(detail.text).toBeDefined();
    }
  });
});

describe('metaDataFactory - enhanceTags', () => {
  it('empty', () => {
    const enhancedDataset = enhanceKeywords();
    expect(enhancedDataset).toBeNull();
  });

  it('with dataset', () => {
    const enhancedDataset = packagelist.result[6];

    enhanceKeywords(enhancedDataset.tags, categoryCards);

    expect(enhancedDataset).toBeDefined();

    for (let j = 0; j < enhancedDataset.tags.length; j++) {
      const tag = enhancedDataset.tags[j];
      expect(tag).toBeDefined();
      expect(tag).not.toBe('');
      expect(tag.color).toBeDefined();
      expect(tag.color).not.toBe('');
    }
  });
});

describe('metaDataFactory - enhanceTitleImg', () => {
  it('empty', () => {
    const enhancedDataset = enhanceTitleImg();
    expect(enhancedDataset).toBeNull();
  });

  it('with multiple datasets but no background images', () => {
    const datasets = packagelist.result.slice(6, 16);

    for (let i = 0; i < datasets.length; i++) {
      const dataset = datasets[i];
      const enhancedDataset = enhanceTitleImg(dataset);

      expect(enhancedDataset).toBeDefined();
      expect(enhancedDataset).not.toBe('');
      expect(enhancedDataset.categoryColor).toBeDefined();
      expect(enhancedDataset.categoryColor).not.toBe('');
    }
  });

  // it('with dataset but no background images', () => {
  //   const dataset = packagelist.result[6];

  //   const enhancedDataset = enhanceTitleImg(dataset);

  //   expect(enhancedDataset).toBeDefined();
  //   expect(enhancedDataset).not.toBe('');
  //   expect(enhancedDataset.categoryColor).toBeDefined();
  //   expect(enhancedDataset.categoryColor).not.toBe('');
  // });
});

describe('metaDataFactory - formatDate', () => {
  it('empty', () => {
    const date = formatDate();
    expect(date).toBe('');
  });

  it('with date in ckan format', () => {
    const ckanDate = '2017-08-15T15:25:45.175790';

    const date = formatDate(ckanDate);
    expect(date).toBeDefined();
    expect(date).toBe('15. Aug 2017 15:25');
  });
});

const text = 'https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:14249\n';
const text2 =
  'https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:14249 \n https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:21248 \n https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:32593 \n https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:32246 \n https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:32611 ';
const text3 =
  '* https://www.dora.lib4ri.ch/wsl/islandora/object/wsl%3A22390\r\n* https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:29664 \r\n* https://www.dora.lib4ri.ch/wsl/islandora/object/wsl%3A30382';
const text4 = '* wsl:21835 * wsl%3A22390';
const text5 = '* wsl:21835 \n * https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:29664 ';

describe('metaDataFactory - extractPIDMapFromText', () => {
  it('empty', () => {
    const pids = extractPIDMapFromText();
    expect(pids).toBeDefined();
    expect(pids.size).toBe(0);
  });

  it('with text with dora url', () => {
    const pids = extractPIDMapFromText(text);
    expect(pids).toBeDefined();
    expect(pids.size > 0).toBeTruthy();
  });

  it('with text2 with dora url', () => {
    const pids = extractPIDMapFromText(text2);
    expect(pids).toBeDefined();
    expect(pids.size > 0).toBeTruthy();
  });

  it('with text3 with dora url', () => {
    const pids = extractPIDMapFromText(text3);
    expect(pids).toBeDefined();
    expect(pids.size > 0).toBeTruthy();
  });

  it('with text4 with dora url', () => {
    const pids = extractPIDMapFromText(text4);
    expect(pids).toBeDefined();
    expect(pids.size > 0).toBeTruthy();
  });

  it('with text5 with dora url', () => {
    const pids = extractPIDMapFromText(text5);
    expect(pids).toBeDefined();
    expect(pids.size > 0).toBeTruthy();
  });
});
