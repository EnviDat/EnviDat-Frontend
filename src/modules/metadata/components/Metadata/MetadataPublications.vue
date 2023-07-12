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
  extractDOIMapFromText,
  extractPIDMapFromText,
  replaceIdsInText,
  resolveDoiCitationObjectsViaDora,
  resolvePidCitationObjectsViaDora,
} from '@/factories/citationFactory';


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
    /* prop to use without the $store in the storybook context */
    resolveBaseUrl: {
      type: String,
      default: undefined,
    },
    /* prop to use without the $store in the storybook context */
    resolveBaseDOIUrl: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    ...mapState(['config']),
    metadataConfig() {
      return this.$store ? this.config?.metadataConfig || {} : {};
    },
    publicationsConfig() {
      return this.metadataConfig?.publicationsConfig || {};
    },
    resolveBaseUrlField() {
      return this.publicationsConfig?.resolveBaseUrl || this.resolveBaseUrl;
    },
    resolveBaseDOIUrlField() {
      return this.publicationsConfig?.resolveBaseDOIUrl || this.resolveBaseDOIUrl;
    },
    loading() {
      return this.isResolving || this.showPlaceholder;
    },
    publications() {
      return this.mixinMethods_getGenericProp('publications');
    },
    extractedPIDMap() {
      return extractPIDMapFromText(this.text);
    },
    extractedDOIMap() {
      return extractDOIMapFromText(this.text);
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

      if (text && !this.isResolving && !this.resolveError ) {
        this.isResolving = true;
        this.resolveError = null;
        this.replacedText = '';

        this.$nextTick(async () => {

          await this.resolvePIDs(text, this.extractedPIDMap);
          await this.resolveDOIs(text, this.extractedDOIMap);

          const idsMap = new Map([...this.extractedPIDMap, ...this.extractedDOIMap]);
          const citationsMap = new Map([...this.pidCitationMap, ...this.doiCitationMap]);

          this.replacedText = replaceIdsInText(text, citationsMap, idsMap);

          this.isResolving = false;
        })
      }

      return text;
    },
    async resolvePIDs(text, pidMap) {
      if (!text || !pidMap) {
        return;
      }

      try {
        this.pidCitationMap = await resolvePidCitationObjectsViaDora(pidMap, this.resolveBaseUrlField);

      } catch (e) {
        this.resolveError = e;
      }
    },
    async resolveDOIs(text, doiMap) {
      if (!text || !doiMap) {
        return;
      }

      try {
        this.doiCitationMap = await resolveDoiCitationObjectsViaDora(doiMap, this.resolveBaseDOIUrlField);

      } catch (e) {
        this.resolveError = e;
      }

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
    replacedText: '',
    pidCitationMap: null,
    doiCitationMap: null,
  }),
};
</script>

<style scoped>
.relatedPubList .readableText ul > * + * {
  padding: 5px 0;
}
</style>
