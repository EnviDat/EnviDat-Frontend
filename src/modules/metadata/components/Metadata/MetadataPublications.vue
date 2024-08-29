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

import axios from 'axios';
import { mapState } from 'vuex';

import ExpandableTextLayout from '@/components/Layouts/ExpandableTextLayout.vue';
import { METADATA_PUBLICATIONS_TITLE } from '@/factories/metadataConsts';
import {
  extractPIDMapFromText,
  getDoraPidsUrl,
  replacePIDsInText,
  resolvedCitationText,
} from '@/factories/citationFactory';

export default {
  name: 'MetadataPublications',
  components: {
    ExpandableTextLayout,
  },
  props: {
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
    showPlaceholder: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(['config']),
    loading() {
      return this.isResolving || this.showPlaceholder;
    },
    metadataConfig() {
      return this.$store ? this.config?.metadataConfig || {} : {};
    },
    publicationsConfig() {
      return this.metadataConfig?.publicationsConfig || {};
    },
    resolveBaseUrl() {
      return this.publicationsConfig?.resolveBaseUrl || 'https://www.dora.lib4ri.ch/wsl/islandora/search/json_cit_pids_wsl/';
    },
    extractedPIDMap() {
      return extractPIDMapFromText(this.text);
    },
    resolvingStatusText() {
      if (this.resolveError) {
        return `Publication could not be resolved because: ${this.resolveError}`;
      }

      return '';
    },
  },
  methods: {
    resolvedCitations(text){

      if (!this.isResolving && !this.resolveError
          && this.extractedPIDMap?.size > 0) {

        this.isResolving = true;
        this.$nextTick(() => {
          this.resolvePIDs(text, this.extractedPIDMap);
        })
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

      try {
        // get url which works with multiple PIDs
        const doraUrl = getDoraPidsUrl(pidMap, this.resolveBaseUrl);

        const response = await axios.get(doraUrl);

        const citationMap = resolvedCitationText(response.data, pidMap);
        newText = replacePIDsInText(text, citationMap, pidMap);

      } catch (e) {
        this.resolveError = e;
      } finally {
        this.isResolving = false;
      }

      this.replacedText = newText;
    },
  },
  watch: {
    text() {
      if (this.text !== this.replacedText) {
        this.replacedText = '';
      }
    },
  },
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
  padding: 5px 0;
}
</style>
