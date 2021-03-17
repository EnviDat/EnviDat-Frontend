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

export default {
  methods: {
    mixinMethods_isTagSelected(tagName) {
      if (!tagName || this.selectedTagNames === undefined) {
        return false;
      }

      return this.selectedTagNames.indexOf(tagName) >= 0;
    },
    mixinMethods_areArraysIdentical(arr1, arr2) {
      if (arr1.length !== arr2.length) return false;

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
        const jsonTags = JSON.parse(jsonString);

        return jsonTags;
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
     */
    mixinMethods_additiveChangeRoute(basePath, search, tags, mode) {
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

      this.$router.push({
        path: basePath,
        query,
      });
    },
    /**
     * Return the loaded webp image or instead a jpg as fallback
     *
     * @param {*} imageAssetPathName
     * @returns
     */
    mixinMethods_getWebpImage(imageAssetPathName, state) {
      const imageKey = `./${imageAssetPathName}.${state.webpIsSupported ? 'webp' : 'jpg'}`;
      
      if (state.webpIsSupported) {
        return state.webpAssets[imageKey];
      }
      
      return state.jpgAssets[imageKey];
    },
    /**
     * Loads the path to the icon image
     *
     * @param {String} iconName
     * @return {String} relative file path with extension to the icon image file
     */
    mixinMethods_getIcon(iconName) {
      const iconKey = `./${iconName}.png`;
      return this.$store.getters.iconImages[iconKey];
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
    mixinMethods_formatBytes(a, b) {
      /* eslint-disable prefer-template */
      /* eslint-disable no-restricted-properties */
      if (a === 0) return '0 Bytes';

      const c = 1024;
      const d = b || 2;

      const e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const f = Math.floor(Math.log(a) / Math.log(c));

      return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f];
    },
  },
};
