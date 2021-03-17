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
const defaultTagOptions = { enabled: true, color: '#e0e0e0', count: 0 };

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
  return { name, enabled, color, count };
}

/**
 * Goes through all the tags and checks if they are part of the content list.
 * @param {array} tags 
 * @param {array} content 
 */
export function getEnabledTags(tags, content) {
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

    updatedTags.push(createTag(tag.name, { enabled: found, color: tag.color, count: tag.count }));
  }

  return updatedTags;
}

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

export function countTags(datasets) {
  if (!datasets || datasets.length <= 0) return [];

  const tagMap = new Map();

  for (let i = 0; i < datasets.length; i++) {
    const dataset = datasets[i];

    for (let j = 0; j < dataset.tags.length; j++) {
      const tag = dataset.tags[j];

      let count = 1;
      const existingTag = tagMap.get(tag.name);

      if (existingTag) {
        count += existingTag.count;
      }

      tagMap.set(tag.name, createTag(tag.name, { tag: existingTag, count }));
    }
  }

  const tagCounts = Array.from(tagMap.values());

  tagCounts.sort((a, b) => b.count - a.count);

  return tagCounts;
}

export function getPopularTags(datasets, excludeTag = '', minCount = 5, maxCount = 0) {
  if (!datasets || datasets.length <= 0) return [];

  const tagCounted = countTags(datasets);
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
