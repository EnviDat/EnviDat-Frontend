import {
  createHeader,
  createBody,
  createFunding,
  createCitation,
  createLicense,
  createLocation,
  createPublications,
  createDetails,
  createResource,
  enhanceTags,
  formatDate,
  enhanceTitleImg,
} from '@/factories/metaDataFactory';


import packagelist from '@/../public/testdata/packagelist.json';
import categoryCards from '@/store/categoryCards';

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
    expect(header.metadataTitle).toBeDefined();
    expect(header.doi).toBeDefined();
    expect(header.contactName).toBeDefined();
    expect(header.contactEmail).toBeDefined();
    expect(header.license).toBeDefined();
    expect(header.tags).toBeDefined();
    expect(header.titleImg).toBe(dataset.titleImg);
    expect(header.maxTags).toBeDefined();
    expect(header.authors).toBeDefined();
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
    expect(citation.citationBibtexXmlLink.includes('.bib')).toBeTruthy();

    expect(citation.citationRisXmlLink).toBeDefined();
    expect(citation.citationRisXmlLink.includes('.ris')).toBeTruthy();
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

    expect(res.mimetype).toBeDefined();
    expect(res.cacheUrl).toBeDefined();
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
    expect(res.revisionId).toBeDefined();
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

describe('metaDataFactory - createLocation', () => {
  it('empty', () => {
    const loc = createLocation(undefined);
    expect(loc).toBeNull();
  });

  it('with dataset', () => {
    const dataset = packagelist.result[6];

    const loc = createLocation(dataset);

    expect(loc).toBeDefined();
    expect(loc.id).toBeDefined();
    expect(loc.name).toBeDefined();
    expect(loc.title).toBeDefined();

    expect(loc.isPolygon).toBeDefined();
    expect(loc.isPoint).toBeDefined();
    expect(loc.isMultiPoint).toBeDefined();

    expect(loc.pointArray).toBeDefined();
    expect(loc.pointArray.length).toBeGreaterThan(0);
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
    const enhancedDataset = enhanceTags();
    expect(enhancedDataset).toBeNull();
  });

  it('with dataset', () => {
    const dataset = packagelist.result[6];

    const enhancedDataset = enhanceTags(dataset, categoryCards);

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
      const enhancedDataset = enhanceTitleImg(dataset, null, categoryCards);

      expect(enhancedDataset).toBeDefined();
      expect(enhancedDataset).not.toBe('');
      expect(enhancedDataset.categoryColor).toBeDefined();
      expect(enhancedDataset.categoryColor).not.toBe('');
    }

  });

  // it('with dataset but no background images', () => {
  //   const dataset = packagelist.result[6];

  //   const enhancedDataset = enhanceTitleImg(dataset, null, categoryCards);

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
