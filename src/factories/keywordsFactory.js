import { DIVERSITY, FOREST, HAZARD, LAND, METEO, SNOW } from '@/store/categoriesConsts';
import mainCategoryTags from '@/modules/metadata/store/metadataTags';

/**
 * @param {Array} tags
 *
 * @return {String} category based on tags array
 */
export function guessTagCategory(tags) {
  if (!tags) {
    return LAND;
  }

  for (let i = 0; i < tags.length; i++) {
    const element = tags[i];
    const name = element.name;

    switch (true) {
      case name.includes('HAZARD'):
      case name.includes('ACCIDENTS'):
      case name.includes('FATALITIES'):
        return HAZARD;
      case name.includes('DIVERSITY'):
        return DIVERSITY;
      case name.includes('FOREST'):
        return FOREST;
      case name.includes('SNOW'):
      case name.includes('AVALANCHE'):
        return SNOW;
      case name.includes('METEO'):
      case name.includes('CLIMATE'):
        return METEO;
      case name.includes('LAND'):
        return LAND;
      default:
    }
  }

  return LAND;
}

export function convertTags(tagsStringArray, tagsEnabled) {
  const tagObjs = [];

  tagsStringArray.forEach((element) => {
    tagObjs.push({
      name: element,
      enabled: tagsEnabled,
    });
  });

  return tagObjs;
}

export function getCategoryColor(categoryCards, categoryName) {
  for (let i = 0; i < categoryCards.length; i++) {
    const cat = categoryCards[i];
    if (cat.type === categoryName) {
      return cat.color;
    }
  }

  return null;
}

export function getTagColor(categoryCards, tagName) {
  if (!categoryCards || !tagName) {
    return '';
  }

  for (let i = 0; i < categoryCards.length; i++) {
    const cat = categoryCards[i];
    const name = tagName.toLowerCase();

    if (name.includes(cat.type) || cat.alias.includes(name)) {
      return cat.darkColor;
    }
  }

  return '#e0e0e0';
}

export function enhanceTags(dataset, categoryCards) {
  if (!dataset || !categoryCards) {
    return null;
  }

  if (dataset.tags && dataset.tags instanceof Array) {
    for (let j = 0; j < dataset.tags.length; j++) {
      const tag = dataset.tags[j];
      tag.color = getTagColor(categoryCards, tag.name);
    }
  }

  return dataset;
}

/**
 * function factory for filtering methods by parsing
 * the json from the backend.
 *
 * @summary function factory for filtering methods
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:07:03
 * Last modified  : 2020-10-29 21:16:48
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
const defaultTagOptions = {
  enabled: true,
  color: '#e0e0e0',
  count: 0,
};

export function createTag(name, options = defaultTagOptions) {
  if (!name) return null;

  let enabled = options.enabled !== undefined ? options.enabled : defaultTagOptions.enabled;
  let color = options.color ? options.color : defaultTagOptions.color;
  let count = options.count ? options.count : defaultTagOptions.count;

  if (options.tag) {
    enabled = options.enabled === undefined && options.tag.enabled !== undefined ? options.tag.enabled : enabled;
    color = options.color === undefined && options.tag.color ? options.tag.color : color;
    count = options.count === undefined && options.tag.count ? options.tag.count : count;
  }

  // eslint-disable-next-line object-curly-newline
  return {
    name,
    enabled,
    color,
    count,
  };
}

/**
 * Goes through all the tags and checks if they are part of the content list.
 * @param {tags[]} tags
 * @param {datasets[]} content
 * @param {boolean} sortBaseOnCount
 */
export function getEnabledTags(tags, content, sortBaseOnCount = false) {
  const updatedTags = [];

  if (!tags || !content) return updatedTags;

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    let found = false;

    for (let j = 0; j < content.length; j++) {
      const el = content[j];

      if (el.tags && el.tags.length > 0) {
        const index = el.tags.findIndex(obj => obj.name.includes(tag.name));

        if (index >= 0) {
          found = true;
          break;
        }
      }
    }

    updatedTags.push(createTag(tag.name, {
      enabled: found,
      color: tag.color,
      count: tag.count,
    }));
  }

  if (sortBaseOnCount) {
    updatedTags.sort((a, b) => b.count - a.count);
  }

  return updatedTags;
}

/**
 *
 * @param {object[]} tags
 * @param {string[]} selectedTagNames
 * @returns {boolean}
 */
export function tagsIncludedInSelectedTags(tags, selectedTagNames) {
  if (!tags || !selectedTagNames) return false;

  let selectedTagFound = 0;

  for (let j = 0; j < selectedTagNames.length; j++) {
    const el = selectedTagNames[j];

    for (let k = 0; k < tags.length; k++) {
      const tag = tags[k];

      if (tag.name.includes(el)) {
        selectedTagFound++;
        break;
      }
    }
  }

  return selectedTagFound === selectedTagNames.length;
}

/**
 * Returns a sorted array of tags / keywords objects with a property count
 * which represents how many times it's part of the datasets array
 *
 * @param datasets
 * @returns {any[]|*[]}
 */
export function getCountedKeywords(datasets) {
  if (!datasets || datasets.length <= 0) return [];

  const tagMap = new Map();

  for (let i = 0; i < datasets.length; i++) {
    const dataset = datasets[i];

    if (dataset.tags) {
      for (let j = 0; j < dataset.tags.length; j++) {
        const tag = dataset.tags[j];

        let count = 1;
        const existingTag = tagMap.get(tag.name);

        if (existingTag) {
          count += existingTag.count;
        }

        tagMap.set(tag.name, createTag(tag.name, {
          tag: existingTag,
          count,
        }));
      }
    }
  }

  const tagCounts = Array.from(tagMap.values());

  tagCounts.sort((a, b) => b.count - a.count);

  return tagCounts;
}

export function getPopularTags(datasets, excludeTag = '', minCount = 5, maxCount = 0) {
  if (!datasets || datasets.length <= 0) return [];

  const tagCounted = getCountedKeywords(datasets);
  const cleandAndCounted = [];

  for (let i = 0; i < tagCounted.length; i++) {
    const tag = tagCounted[i];
    // console.log(tag.name + ' ' + tag.count + ' minCount ' + minCount + ' count? ' + (tag.count >= minCount) + ' excludeTag ' + (excludeTag === '' || (excludeTag && tag.name.toLowerCase() !== excludeTag.toLowerCase())) + ' maxCount ' + (maxCount === 0 || (maxCount > 0 && tag.count < maxCount)) );

    if (tag.count >= minCount) {
      const notExcluded = (excludeTag === '' || (excludeTag && tag.name.toLowerCase() !== excludeTag.toLowerCase()));
      const notMaxCount = (maxCount === 0 || (maxCount > 0 && tag.count < maxCount));

      if (notExcluded && notMaxCount) {
        cleandAndCounted.push(tag);
      }
    }
  }

  return cleandAndCounted;
}

export function enhanceTagsOrganizationDatasetFromAllDatasets(organizationDatasets, datasetMap) {

  for (let i = 0; i < organizationDatasets.length; i++) {
    const orgaDataset = organizationDatasets[i];

    const dataset = datasetMap[orgaDataset.id];
    if (dataset) {
      orgaDataset.tags = dataset.tags;
    }
  }

  return organizationDatasets;
}


export function getTagsMergedWithExtras(tags, modeData) {
  if (!modeData) return null;

  try {
    const mergedTags = [...tags, ...modeData.extraTags];
    return mergedTags.filter((item, pos, self) => self.findIndex(v => v.name === item.name) === pos);
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function getKeywordsForFiltering(content, allTags = undefined, modeMetadata = undefined, maxKeywords = 25) {

  const minTagAmount = modeMetadata ? modeMetadata.minTagAmount : 5;
  const excludeTag = modeMetadata ? modeMetadata.mainTag.name : undefined;
  const tags = allTags || mainCategoryTags;

  let allWithExtras = [];

  const mergedExtraTags = modeMetadata ? getTagsMergedWithExtras(tags, modeMetadata) : undefined;
  if (mergedExtraTags) {
    const popularTags = getPopularTags(content, excludeTag, minTagAmount, content.length);
//    const mergedWithPopulars = [...mergedExtraTags, ...popularTags.slice(0, 15)];
    const mergedWithPopulars = [...mergedExtraTags, ...popularTags];

    const mergedWithoutDublicates = mergedWithPopulars.filter((item, pos, self) => self.findIndex(v => v.name === item.name) === pos);
    // tags with the same count as the content have no use, remove them
    // allWithExtras = mergedWithoutDublicates.filter((item) => { item.count >= filteredContent.length});
    allWithExtras = mergedWithoutDublicates;
  } else {
    allWithExtras = mainCategoryTags;
  }

  // check which of the tags are actually part of the content list these are enabled = true
  let updatedTags = getEnabledTags(allWithExtras, content, true);
  updatedTags = updatedTags.filter((element) => element.enabled);

  if (updatedTags.length > maxKeywords) {
    updatedTags = updatedTags.slice(0, maxKeywords);
  }

  return updatedTags;
}
