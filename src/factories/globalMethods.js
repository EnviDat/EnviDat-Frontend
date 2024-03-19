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
  },
};
