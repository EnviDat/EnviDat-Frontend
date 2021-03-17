import {
  createAuthors,
  extractAuthorsMap,
  getFullAuthorsFromDataset,
} from '@/factories/authorFactory';

import packagelist from '@/../public/testdata/packagelist';

// const metadatasContent = {};
// packagelist.result.forEach((entry) => {
//   metadatasContent[entry.id] = entry;
// });

describe('authorFactory - createAuthors', () => {
  it('empty', () => {
    const authors = createAuthors(undefined);
    expect(authors).toBeNull();
  });

  it('with dataset', () => {
    const dataset = packagelist.result[7];

    const authors = createAuthors(dataset);

    expect(authors).toBeDefined();

    for (let i = 0; i < authors.length; i++) {
      const author = authors[i];

      expect(author.firstName).toBeDefined();
      expect(author.lastName).toBeDefined();
      expect(author.datasetCount).toBeGreaterThanOrEqual(1);
      expect(author.affiliation).toBeDefined();
      expect(author.id).toBeDefined();
      expect(author.email).toBeDefined();
      expect(author.dataCredit).toBeDefined();
    }
  });
});

describe('authorFactory - extractAuthorsMap', () => {
  it('empty', () => {
    const authorMap = extractAuthorsMap(undefined);
    expect(authorMap).toBeNull();
  });

  it('with datasets', () => {
    const datasets = packagelist.result;

    const authorMap = extractAuthorsMap(datasets);

    expect(authorMap).toBeDefined();

    const keys = Object.keys(authorMap);

    for (let i = 0; i < keys.length; i++) {
      const authorFullName = keys[i];
      const author = authorMap[authorFullName];

      // console.log('authorFullName: ' + authorFullName + ' fullName: ' + author.fullName + ' firstName: ' + author.firstName + ' lastName: ' + author.lastName);
            
      expect(author.firstName).toBeDefined();
      expect(author.lastName).toBeDefined();
      expect(author.datasetCount).toBeGreaterThanOrEqual(1);
      expect(author.affiliation).toBeDefined();
      expect(author.id).toBeDefined();
      expect(author.email).toBeDefined();
      expect(author.dataCredit).toBeDefined();
    }
  });
});

describe('authorFactory - getFullAuthorsFromDataset', () => {
  it('empty', () => {
    const authorMap = getFullAuthorsFromDataset();
    expect(authorMap).toBeNull();
  });

  it('with datasets', () => {
    const datasets = packagelist.result;
    const authorMap = (datasets);

    expect(authorMap).toBeDefined();

    const fullAuthors = getFullAuthorsFromDataset(authorMap, datasets[2]);

    expect(fullAuthors).toBeDefined();

    for (let i = 0; i < fullAuthors.length; i++) {
      const author = fullAuthors[i];
      
      expect(author.firstName).toBeDefined();
      expect(author.lastName).toBeDefined();
      expect(author.datasetCount).toBeGreaterThanOrEqual(1);
      expect(author.affiliation).toBeDefined();
      expect(author.id).toBeDefined();
      expect(author.email).toBeDefined();
      expect(author.dataCredit).toBeDefined();
    }
  });
});
