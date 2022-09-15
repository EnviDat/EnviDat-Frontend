/**
 * function factory for global methods, mainly used as a mixin to
 * provide functions for every vue component.
 *
 * @summary function factory for global methods
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:07:03
 * Last modified  : 2020-10-13 23:35:11
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable camelcase */
import { Object } from 'core-js';

import {
  DIVERSITY,
  FOREST,
  HAZARD,
  LAND,
  METEO,
  SNOW,
} from '@/store/categoriesConsts';

import {
  LOCATION_TYPE_MULTIPOINT,
  LOCATION_TYPE_POINT,
  LOCATION_TYPE_POLYGON,
} from '@/factories/metaDataFactory';


export default {
  methods: {
    mixinMethods_isFieldReadOnly(property) {

      if (this.readOnlyFields?.length > 0) {
        return this.readOnlyFields.includes(property);
      }

      return false;
    },
    mixinMethods_readOnlyHint(property) {
      let hint = '';

      if (this.mixinMethods_isFieldReadOnly(property)) {
        hint = this.readOnlyExplanation || '';
      }

      return hint;
    },
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
     * Encodes a array of tagNames via btoa() to a string.
     * Also replaces theses characters '.', '_', '-' which cause problems for urls.
     *
     * @param {array} jsonTags: array of tagNames
     * @return {String} encoded string usable for urls
     */
    mixinMethods_encodeTagForUrl(jsonTags) {
      if (jsonTags && jsonTags.length > 0) {
        const jsonString = JSON.stringify(jsonTags);

        const urlquery = btoa(jsonString);

        let urlConformString = urlquery.replace(/\+/g, '.');
        urlConformString = urlConformString.replace(/\//g, '_');
        urlConformString = urlConformString.replace(/=/g, '-');

        return urlConformString;
      }

      return '';
    },
    /**
     * Decodes a string which was encoded via mixinMethods_encodeTagForUrl().
     * Returns the original array or an empty one.
     * Also restores characters '.', '_', '-'.
     *
     * @param {String} urlquery: encoded string
     * @return {array}: array of tagNames
     */
    mixinMethods_decodeTagsFromUrl(urlquery) {
      if (urlquery) {
        let jsonConformString = urlquery.replace(/\./g, '+');
        jsonConformString = jsonConformString.replace(/_/g, '/');
        jsonConformString = jsonConformString.replace(/-/g, '=');

        const jsonString = atob(jsonConformString);
        return JSON.parse(jsonString);
      }

      // return an empty array for the selectedTagIds
      return [];
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
    mixinMethods_convertUrlStringToArray(string) {
      if (!string) {
        return [];
      }

      return string.split(',');
    },
    mixinMethods_convertArrayToUrlString(array) {

      let str = '';
      for (let i = 0; i < array.length; i++) {
        str += `${array[i]},`;
      }

      // remove the last comma
      str = str.substring(0, str.length - 1);

      return str;
    },
    /**
     * Return the loaded webp image or instead a jpg as fallback
     *
     * @param {*} imageAssetPathName
     * @param state
     * @returns
     */
    mixinMethods_getWebpImage(imageAssetPathName, state) {
      const imageKey = `./${imageAssetPathName}`;

      if (state.webpIsSupported) {
        const webpImg = state.webpAssets[`${imageKey}.webp`];

        if (webpImg) {
          return webpImg;
        }
      }

      return state.jpgAssets[`${imageKey}.jpg`];
    },
    /**
     * Loads the path to the icon image
     *
     * @param {String} iconName
     * @return {String} relative file path with extension to the icon image file
     */
    mixinMethods_getIcon(iconName) {
      const iconKey = `./${iconName}.png`;
      return this.$store?.getters?.iconImages[iconKey] || null;
    },
    /**
     * Loads the path to the icon image representing a file extension
     *
     * @param {*} iconName
     * @return {string} relative file path to the icon image file
     */
    mixinMethods_getIconFileExtension(fileExtension) {
      const ext = fileExtension.toLowerCase();
      const iconKey = `./file${ext}.png`;

      return this.$store.getters.iconImages[iconKey];
    },
    /**
     * Loads the file path to given images into a Map.
     *
     * @param {Map<string, string>} imgs imageContext which is loaded via require.context() (ex. require.context('./assets/', false, /\.jpg$/);)
     * @param {String} checkForString
     *
     * @return {Map<string, string>} Image cache
     */
    mixinMethods_importImages(imgs, checkForString) {
      if (!imgs) {
        // console.log(`Got empty imgs for ${checkForString}`);
        return null;
      }
      const imgCache = {};

      imgs.keys().forEach((key) => {
        if (!checkForString || (checkForString && key.includes(checkForString))) {
          imgCache[key] = imgs(key);
        }
      });

      return imgCache;
    },
    mixinMethods_getGeoJSONIcon(type) {
      if (type) {

        if (type === LOCATION_TYPE_POINT) {
          return this.mixinMethods_getIcon('marker');
        }

        if (type === LOCATION_TYPE_MULTIPOINT) {
          return this.mixinMethods_getIcon('markerMulti');
        }

        if (type === LOCATION_TYPE_POLYGON) {
          return this.mixinMethods_getIcon('polygons');
        }
      }

      return null;
    },
    mixinMethods_getGenericProp(propName, defaultValue = null) {
      if (!this.genericProps) {
        return defaultValue;
      }

      return this.genericProps[propName] ? this.genericProps[propName] : defaultValue;
    },
    /**
     *
     * for details: https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
     * @param {*} a
     * @param {*} b
     */
    mixinMethods_formatBytes(a, b = 2) {
      /* eslint-disable prefer-template */
      /* eslint-disable no-restricted-properties */
      if (a === 0) return '0 Bytes';

      const c = 1024;

      const e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const f = Math.floor(Math.log(a) / Math.log(c));

      return parseFloat((a / Math.pow(c, f)).toFixed(b)) + ' ' + e[f];
    },
    mixinMethods_getCardBackgrounds(useWebp = false) {
      const bgs = {};

      if (useWebp) {
        bgs[LAND] = this.mixinMethods_importImages(require.context('@/assets/cards/landscape/', false, /\.webp$/));
        bgs[FOREST] = this.mixinMethods_importImages(require.context('@/assets/cards/forest/', false, /\.webp$/));
        bgs[SNOW] = this.mixinMethods_importImages(require.context('@/assets/cards/snow/', false, /\.webp$/));
        bgs[DIVERSITY] = this.mixinMethods_importImages(require.context('@/assets/cards/diversity/', false, /\.webp$/));
        bgs[HAZARD] = this.mixinMethods_importImages(require.context('@/assets/cards/hazard/', false, /\.webp$/));
        bgs[METEO] = this.mixinMethods_importImages(require.context('@/assets/cards/meteo/', false, /\.webp$/));
      } else {
        bgs[LAND] = this.mixinMethods_importImages(require.context('@/assets/cards/landscape/', false, /\.jpg$/));
        bgs[FOREST] = this.mixinMethods_importImages(require.context('@/assets/cards/forest/', false, /\.jpg$/));
        bgs[SNOW] = this.mixinMethods_importImages(require.context('@/assets/cards/snow/', false, /\.jpg$/));
        bgs[DIVERSITY] = this.mixinMethods_importImages(require.context('@/assets/cards/diversity/', false, /\.jpg$/));
        bgs[HAZARD] = this.mixinMethods_importImages(require.context('@/assets/cards/hazard/', false, /\.jpg$/));
        bgs[METEO] = this.mixinMethods_importImages(require.context('@/assets/cards/meteo/', false, /\.jpg$/));
      }

      return bgs;
    },
  },
};
