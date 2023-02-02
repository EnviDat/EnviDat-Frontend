<template id="MetadataPublications">
  <expandable-text-layout
    :title="METADATA_PUBLICATIONS_TITLE"
    :text="replacedText || resolvedCitations(text)"
    :showPlaceholder="loading"
    :emptyTextColor="emptyTextColor"
    :emptyText="emptyText"
    :maxTextLength="maxTextLength"
    :sanitizeHTML="false"
    :statusText="resolvingStatusText"
    class="relatedPubList"
  />
</template>

<script>
/**
 * MetadataPublications.vue renders markdown showing the Related Publications of the metadatas.
 *
 * @summary shows the Related Publications of a metadata entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2020-10-22 14:52:49
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import ExpandableTextLayout from '@/components/Layouts/ExpandableTextLayout.vue';
import { METADATA_PUBLICATIONS_TITLE } from '@/factories/metadataConsts';
import { mapState } from 'vuex';
import {
  extractPIDsFromUrls,
  extractUrlsFromText,
} from '@/factories/metaDataFactory';
import axios from 'axios';

export default {
  name: 'MetadataPublications',
  components: {
    ExpandableTextLayout,
  },
  props: {
    showPlaceholder: Boolean,
    text: {
      type: String,
      default: '',
    },
    emptyText: {
      type: String,
      default: 'No related publications available for this dataset.',
    },
    emptyTextColor: {
      type: String,
      default: 'grey',
    },
    maxTextLength: {
      type: Number,
      default: undefined,
    },
    allDatasets: {
      // this is only for testing & implementation via storybook
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState(['config']),
    loading() {
      return this.isResolving || this.showPlaceholder;
    },
    publications() {
      return this.mixinMethods_getGenericProp('publications');
    },
    publicationsResolvingIds() {
      return this.mixinMethods_getGenericProp(
        'publicationsResolvingIds',
        false,
      );
    },
    metadataConfig() {
      return this.$store ? this.config?.metadataConfig || {} : {};
    },
    publicationsConfig() {
      return this.metadataConfig?.publicationsConfig || {};
    },
    resolveBaseUrl() {
      return this.publicationsConfig?.resolveBaseUrl || 'https://www.dora.lib4ri.ch/wsl/islandora/search/json_cit_pids/';
    },
    extractedUrls() {
      return extractUrlsFromText(this.text);
    },
    extractedPIDMap() {
      return extractPIDsFromUrls(this.extractedUrls);
    },
    resolvingStatusText() {
      if (this.resolveError) {
        return `Publication could not be resolved because: ${this.resolveError}`;
      }

      if (this.isResolving) {
        return 'Publications resolving on going';
      }

      if (!this.isResolving && this.replacedText && this.extractedPIDMap?.size > 0) {
        return 'Publications are resolved';
      }

      return '';
    },
  },
  methods: {
    resolvedCitations(text){

      if (!this.isResolving && !this.resolveError
          && this.extractedPIDMap?.size > 0) {
        this.resolvePIDs(text, this.extractedPIDMap);
      }

      return text;
    },
    /**
     * 
     * @param text
     * @param {null|Map<string, string>} pidMap
     * @returns {Promise<void>}
     */
    async resolvePIDs(text, pidMap) {
      if (!text || !pidMap) {
        return;
      }

      this.replaceMap = {};
      this.resolveError = null;
      this.replacedText = null;
      let newText = null;
      this.isResolving = true;

      const requests = [];
      pidMap.forEach((pid, url) => {
        const resolveServiceUrl = this.resolveBaseUrl + pid;
        requests.push(axios.get(resolveServiceUrl));
      });

      try {
        const responses = await Promise.all(requests);
        let resolvedPubs = {};

        for (let i = 0; i < responses.length; i++) {
          const response = responses[i];
          resolvedPubs = { ...resolvedPubs, ...response.data };
        }

        const citationMap = this.resolvedCitationText(resolvedPubs, pidMap);
        newText = this.replacePIDsInText(text, citationMap, pidMap);

      } catch (e) {
        this.resolveError = e;
      } finally {
        this.isResolving = false;
      }

      this.replacedText = newText;
    },
    /**
     *
     * @param resolvedPubs
     * @param pidMap
     * @returns {Map<any, any>} Map keys are the PID with the citation text as value
     */
    resolvedCitationText(resolvedPubs, pidMap) {
      const citationMap = new Map();

      pidMap.forEach((pid, url) => {
        const resolvedObject = resolvedPubs[pid];
        const acsCitation = resolvedObject?.citation?.ACS;
        if (acsCitation) {
          citationMap.set(pid, acsCitation);
        }
      });

      return citationMap;
    },
    /**
     *
     * @param text
     * @param {Map<any, any>} citationMap Map keys are the PID with the citation text as value
     * @param {Map<string, string>} pidMap Map keys are the url with the PID as value
     * @returns {*}
     */
    replacePIDsInText(text, citationMap, pidMap) {

      let newText = text;

      if (text) {

        pidMap.forEach((pid, url) => {
          const citation = citationMap.get(pid);
          if (citation) {
            // newText = `<p>${newText.replace(url, citation)}  </p>`;
            newText = newText.replace(url, `${citation} \n`);
          }
        });

      }

      return newText;
    },
  },
/*
  watch: {
    /!**
     * @description watcher on idsToResolve start resolving them, if not already in the works
     *!/
    idsToResolve() {
      if (this.idsToResolve?.length > 0
          && !this.publicationsResolvingIds) {
        
        const ids = extractPIDsFromText(this.text)

        this.$store.dispatch(
            `${METADATA_NAMESPACE}/${PUBLICATIONS_RESOLVE_IDS}`,
            {
              idsToResolve: this.idsToResolve,
              resolveBaseUrl: this.publicationsConfig?.resolveBaseUrl,
            },
        );
      }
    },
  },
*/
  data: () => ({
    METADATA_PUBLICATIONS_TITLE,
    isResolving: false,
    resolveError: null,
    replacedText: null,
    replaceMap: {},
  }),
};
</script>

<style scoped>
.relatedPubList .readableText ul > * + * {
  padding: 5px 0px;
}
</style>
