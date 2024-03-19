/**
 * function factory for global methods, mainly used as a mixin to
 * provide functions for every vue component.
 *
 * @summary function factory for global methods
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {
  LOCATION_TYPE_MULTIPOINT,
  LOCATION_TYPE_POINT,
  LOCATION_TYPE_POLYGON,
} from '@/factories/metadataConsts';

export const isFieldReadOnly = (props, property) => {
  if (props?.readOnlyFields?.length > 0) {
    return props.readOnlyFields.includes(property);
  }

  return false;
}

 export const readOnlyHint = (props, property) => {
  let hint = '';

  if (isFieldReadOnly(property)) {
    hint = props?.readOnlyExplanation || '';
  }

  return hint;
}

export default {
  methods: {
    mixinMethods_isTagSelected(tagName) {
      if (!tagName || this.selectedTagNames === undefined) {
        return false;
      }

      return this.selectedTagNames.indexOf(tagName) >= 0;
    },
    mixinMethods_loadRouteTags(tags, selectedTagNames) {

      if (tags && !(tags instanceof Array)) {
        if (tags.includes(',')) {
          tags = tags.split(',');
        } else {
          tags = [tags];
        }
      }

      if (tags) {
        for (let i = 0; i < tags.length; i++) {
          tags[i] = tags[i].toUpperCase();
        }

        if (!this.mixinMethods_areArraysIdentical(selectedTagNames, tags)) {
          return tags;
        }
      }

      return false;
    },
    mixinMethods_areArraysIdentical(arr1, arr2) {
      if (arr1.length !== arr2.length) {
        return false;
      }

      for (let i = arr1.length; i >= 0; i--) {
        if (arr1[i] !== arr2[i]) return false;
      }

      return true;
    },
    /**
     * Changes the route via this.$router.push();
     * The search and tag parameter are added as query parameters.
     * urlSubPath is added as the path.
     *
     * @param {String} basePath the path of the route
     * @param {String} search search term
     * @param {String} tags encoded string
     * @param {String} mode which defines the mode for the special view
     * @param {Array} pins array of ids for the pinned metadatas
     * @param {String} isAuthorSearch if true the search term will only be compared against authors
     */
    mixinMethods_additiveChangeRoute(basePath, search, tags, mode = undefined, pins = undefined, isAuthorSearch = undefined) {
      const query = {};
      Object.assign(query, this.$route.query);

      if (search !== undefined) {
        query.search = search;
      }

      if (tags !== undefined) {
        query.tags = tags;
      }

      if (mode !== undefined) {
        query.mode = mode;
      }

      if (pins !== undefined) {
        query.pins = pins;
      }

      if (isAuthorSearch !== undefined) {
        query.isAuthorSearch = typeof isAuthorSearch !== 'string' ? isAuthorSearch.toString() : isAuthorSearch;
      }

      this.$router.push({
        path: basePath,
        query,
      });
    },
    mixinMethods_convertUrlStringToArray(string, toUpperCase = true, toLowerCase = false) {
      if (!string) {
        return [];
      }

      const splits = string.split(',');

      for (let i = 0; i < splits.length; i++) {
        if (toUpperCase) {
          splits[i] = splits[i].toUpperCase();
        }

        if (toLowerCase) {
          splits[i] = splits[i].toLowerCase();
        }
      }

      return splits;
    },
    mixinMethods_convertArrayToUrlString(array, toUpperCase = true, toLowerCase = false) {

      let str = '';
      for (let i = 0; i < array.length; i++) {
        if (toUpperCase) {
          str += `${array[i].toUpperCase()},`;
        }

        if (toLowerCase) {
          str += `${array[i].toLowerCase()},`;
        }
      }

      // remove the last comma
      str = str.substring(0, str.length - 1);

      return str;
    },
    mixinMethods_getGenericProp(propName, defaultValue = null) {
      if (!this.genericProps) {
        return defaultValue;
      }

      return this.genericProps[propName] ? this.genericProps[propName] : defaultValue;
    },
  },
};
