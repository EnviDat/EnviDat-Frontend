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

import {
  DIVERSITY,
  FOREST,
  HAZARD,
  LAND,
  METEO,
  SNOW,
} from '@/store/categoriesConsts';

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

        // console.log(`resolving ${imageKey} found ${webpImg}`);

        if (webpImg) {
          return webpImg;
        }

        console.warn(`Wanted to get ${imageKey}, but didn't find it`);
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
     * @param {*} fileExtension
     * @return {string|null} relative file path to the icon image file
     */
    mixinMethods_getIconFileExtension(fileExtension) {
      const ext = fileExtension.toLowerCase();
      const iconKey = `./file${ext}.png`;

      const iconString = this.$store.getters.iconImages[iconKey];
      return iconString || null;
    },
    /**
     * Loads the file path to given images into a Map.
     *
     * @param {Map<string, string>} imgPaths imageContext which is loaded via import.meta.glob (ex. import.meta.glob('./assets/*.jpg');)
     * @param {String} checkForString
     *
     * @return {Map<string, string>} Image cache
     */
    mixinMethods_importImages(imgPaths, checkForString) {
      if (!imgPaths) {
        // console.log(`Got empty imgs for ${checkForString}`);
        return null;
      }
      const imgCache = {};

      imgPaths.keys().forEach((key) => {
        if (!checkForString || (checkForString && key.includes(checkForString))) {
          // imgCache[key] = imgPaths(key).default;

          const imgPath = imgPaths(key)?.default || '';
          const imgUrl = new URL(imgPath, import.meta.url)
          imgCache[key] = imgUrl.href;
        }
      });

      return imgCache;
    },
    /**
     * Loads the file path to given images into a Map.
     *
     * @param {Map<string, string>} imgsPaths imageContext which is loaded via import.meta.glob (ex. import.meta.glob('./assets/*.jpg');)
     * @param {String} checkForString
     *
     * @return {Map<string, string>} Image cache
     */
    mixinMethods_importGlobImages(imgPaths, checkForString) {
      if (!imgPaths) {
        // console.log(`Got empty imgs for ${checkForString}`);
        return null;
      }
      const imgCache = {};

      for (const path in imgPaths) {
        if (path) {
          if (!checkForString || (checkForString && path.includes(checkForString))) {

            const splits = path.split('/');
            const imgName = splits[splits.length - 1];

            const imgUrl = new URL(path, import.meta.url)
            imgCache[imgName] = imgUrl.href;
          }
        }
      }

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
