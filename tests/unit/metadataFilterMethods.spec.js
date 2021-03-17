import {
  createTag,
  countTags,
  getEnabledTags,
  tagsIncludedInSelectedTags,
  getPopularTags,
} from '@/factories/metadataFilterMethods';

it('metadataFilterMethods Tag - creation - empty', () => {
  const tag = createTag();
  expect(tag).toBeNull();
});

it('metadataFilterMethods Tag - creation - only name', () => {
  const tag = createTag('someTag');
  expect(tag.name).toBe('someTag');
});

it('metadataFilterMethods Tag - creation - defaults', () => {
  const tag = createTag('someTag');
  expect(tag.enabled).toBeDefined();
  expect(tag.color).toBeDefined();
  expect(tag.count).toBeDefined();
});

it('metadataFilterMethods Tag - creation - options tag overload', () => {
  const existingTag = {
 name: 'dude', enabled: false, color: '#ffffff', count: 5, 
};
  const tag = createTag(existingTag.name, { tag: existingTag });
  expect(tag.name).toBe(existingTag.name);
  expect(tag.enabled).toBe(existingTag.enabled);
  expect(tag.color).toBe(existingTag.color);
  expect(tag.count).toBe(existingTag.count);
});


it('metadataFilterMethods Tag - countTags - empty', () => {
  const count = countTags();
  expect(count).toBeDefined();
  expect(count.length).toEqual(0);
});

function getMockDatasets(two = false, three = false, four = false) {
  const tag1 = createTag('tag1');
  const tag2 = createTag('tag2');
  const tag3 = createTag('tag3');
  const tag4 = createTag('tag4');

  const tags1 = [tag1, tag2, tag2, tag3, tag3, tag3, tag4];
  const tags2 = [tag1, tag2, tag3];

  if (two) {
    return [{ tags: tags1 }, { tags: tags2 }];
  }

  if (three) {
    return [{ tags: tags1 }, { tags: tags2 }, { tags: tags2 }];
  }

  if (four) {
    return [{ tags: tags1 }, { tags: tags2 }, { tags: tags1 }, { tags: tags2 }];
  }
  
  return [{ tags: tags1 }];
}

it('metadataFilterMethods Tag - countTags - basic', () => {
  const datasets = getMockDatasets();

  const count = countTags(datasets);

  expect(count.length).toEqual(4);
  expect(count[0].count).toEqual(3);
  expect(count[1].count).toEqual(2);
  expect(count[2].count).toEqual(1);
  expect(count[3].count).toEqual(1);
});

it('metadataFilterMethods Tag - getEnabledTags - empty', () => {
  const count = getEnabledTags();
  expect(count).toBeDefined();
  expect(count.length).toEqual(0);
});

it('metadataFilterMethods Tag - getEnabledTags - check enabled tags', () => {

  const tag1 = createTag('tag1');
  const tag2 = createTag('tag2');
  const tag3 = createTag('tag3');
  const tag4 = createTag('tag4');

  const tags = [tag1, tag2, tag2, tag3, tag3, tag3, tag4];

  const contentTags1 = { tags: [tag3, tag4] };
  const contentTags2 = { tags: [tag2, tag3, tag3, tag3, tag4] };
  const contentTags3 = { tags: [tag2, tag2, tag3, tag3, tag4] };
  const contentTags4 = { tags: [tag3, tag3] };

  const contentList = [contentTags1, contentTags2, contentTags3, contentTags4];

  const newTags = getEnabledTags(tags, contentList);

  expect(newTags).toBeDefined();
  expect(newTags[0].enabled).toBeFalsy();
  expect(newTags[1].enabled).toBeTruthy();
  expect(newTags[2].enabled).toBeTruthy();
  expect(newTags[3].enabled).toBeTruthy();
});

it('metadataFilterMethods Tag - tagsIncludedInSelectedTags - empty', () => {

  const included = tagsIncludedInSelectedTags();

  expect(included).toBeFalsy();
});

it('metadataFilterMethods Tag - tagsIncludedInSelectedTags - check included', () => {

  const tag1 = createTag('tag1');
  const tag2 = createTag('tag2');
  const tag3 = createTag('tag3');

  const tags = [tag1, tag2, tag2, tag3, tag3, tag3];

  const selectedTagNames = [tag1.name, tag3.name];

  const included = tagsIncludedInSelectedTags(tags, selectedTagNames);

  expect(included).toBeTruthy();
});

it('metadataFilterMethods Tag - getPopularTags - empty', () => {
  const popularTags = getPopularTags();

  expect(popularTags).toBeDefined();
  expect(popularTags.length).toEqual(0);
});

it('metadataFilterMethods Tag - getPopularTags - check returned amount', () => {
  const datasets = getMockDatasets(false, false, true);

  const popularTags = getPopularTags(datasets);

  expect(popularTags).toBeDefined();
  expect(popularTags.length).toEqual(2);
});

it('metadataFilterMethods Tag - getPopularTags - check returned amount with minCount', () => {
  const datasets = getMockDatasets(true);

  const popularTags = getPopularTags(datasets, '', 1);

  expect(popularTags).toBeDefined();
  expect(popularTags.length).toEqual(4);
});

it('metadataFilterMethods Tag - getPopularTags - with exludeTag and minCount', () => {
  const datasets = getMockDatasets(true);

  const popularTags = getPopularTags(datasets, 'tag1', 2);

  expect(popularTags).toBeDefined();
  // popularTags.forEach((tag) => {
  //   console.log(tag.name + ' ' + tag.count);
  // });
  expect(popularTags.length).toEqual(2);
  expect(popularTags[0].count).toEqual(4);
  expect(popularTags[1].count).toEqual(3);
});
