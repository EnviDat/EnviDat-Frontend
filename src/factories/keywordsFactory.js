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

/**
 *
 * @param {string}categoryName
 * @param {object[]}categoryCards
 * @returns {undefined|string}
 */
export function getCategoryColor(categoryName, categoryCards) {
  for (let i = 0; i < categoryCards.length; i++) {
    const cat = categoryCards[i];
    if (cat.type === categoryName) {
      return cat.color;
    }
  }

  return undefined;
}

export function getTagColor(categoryCards, tagName) {
  if (!categoryCards || !tagName) {
    return undefined;
  }

  for (let i = 0; i < categoryCards.length; i++) {
    const cat = categoryCards[i];
    const name = tagName.toLowerCase();

    if (name.includes(cat.type) || cat.alias.includes(name)) {
      return cat.darkColor;
    }
  }

  return undefined;
}

/**
 *
 * @param dataset
 * @param categoryCards
 * @returns {[any]|null}
 */
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
  active: false,
};

export function createTag(name, options = defaultTagOptions) {
  if (!name) return null;

  let enabled = options.enabled !== undefined ? options.enabled : defaultTagOptions.enabled;
  let color = options.color ? options.color : defaultTagOptions.color;
  let count = options.count ? options.count : defaultTagOptions.count;
  let active = options.active ? options.active : defaultTagOptions.active;

  if (options.tag) {
    enabled = options.enabled === undefined && options.tag.enabled !== undefined ? options.tag.enabled : enabled;
    color = options.color === undefined && options.tag.color ? options.tag.color : color;
    count = options.count === undefined && options.tag.count ? options.tag.count : count;
    active = options.active === undefined && options.tag.active ? options.tag.active : active;
  }

  // eslint-disable-next-line object-curly-newline
  return {
    name,
    enabled,
    color,
    count,
    active,
  };
}

/**
 * Goes through all the tags and checks if they are part of the content list.
 * @param {tags[]} tags
 * @param {datasets[]} content
 * @param {boolean} sortBaseOnCount
 */
export function getEnabledTags(tags, content, sortBaseOnCount = false) {
  const enabledTags = [];

  if (!tags || !content) return enabledTags;

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

    enabledTags.push(createTag(tag.name, {
      enabled: found,
      color: tag.color,
      count: tag.count,
    }));
  }

  if (sortBaseOnCount) {
    enabledTags.sort((a, b) => b.count - a.count);
  }

  return enabledTags;
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
 * @param {keyword[]} keywordScope only count these keywords in the datasets
 * @returns {any[]|*[]}
 */
export function getCountedKeywordsFuzzy(datasets, keywordScope) {
  if (!datasets || datasets.length <= 0) return [];

  const tagMap = new Map();

  for (let i = 0; i < keywordScope.length; i++) {
    const keyword = keywordScope[i];

    for (let j = 0; j < datasets.length; j++) {
      const dataset = datasets[j];

      const contains = !!dataset.tags?.filter((tag) => tag.name.includes(keyword.name))[0];

      if (contains) {
        let count = 1;
        const existingTag = tagMap.get(keyword.name);

        if (existingTag) {
          count += existingTag.count;
        }

        tagMap.set(keyword.name, createTag(keyword.name, {
          tag: existingTag,
          count,
          color: keyword.color,
        }));
      }
    }
  }

  const tagCounts = Array.from(tagMap.values());

  tagCounts.sort((a, b) => b.count - a.count);

  return tagCounts;
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
          color: tag.color,
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
  const cleandAndCounted  = [];

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


function removeMultiWorkKeywords(keywords, maxWords = 2) {
  return keywords.filter((keyword) => keyword.name.split(' ').length <= maxWords);
}

export function getKeywordsForFiltering(content, modeMetadata = undefined, maxKeywords = 30) {

  const minTagAmount = modeMetadata ? modeMetadata.minTagAmount : Math.max(5, content.length * 0.025);
  const excludeTag = modeMetadata ? modeMetadata.mainTag.name : undefined;

  let popularTags = getPopularTags(content, excludeTag, minTagAmount, content.length);
  popularTags = removeMultiWorkKeywords(popularTags);
  popularTags = popularTags.slice(0, maxKeywords - 5)

  let extraTags = modeMetadata ? modeMetadata.extraTags : mainCategoryTags;
  const popularTagNames = popularTags.map((keyword) => keyword.name)
  extraTags = extraTags.filter((keyword) => !popularTagNames.includes(keyword.name));
  if (extraTags.length > 0) {
    extraTags = getCountedKeywordsFuzzy(content, extraTags);
  }

  const mergedWithPopulars = [...popularTags, ...extraTags];
  const mergedKeywords = mergedWithPopulars.filter((item, pos, self) => self.findIndex(v => v.name === item.name) === pos);

  // check which of the tags are actually part of the content list these are enabled = true
  let enabledTags = getEnabledTags(mergedKeywords, content, true);
  enabledTags = enabledTags.filter((element) => element.enabled);
  // enabledTags = removeMultiWorkKeywords(enabledTags);

  if (enabledTags.length > maxKeywords) {
    enabledTags = enabledTags.slice(0, maxKeywords);
  }

  return enabledTags;
}
