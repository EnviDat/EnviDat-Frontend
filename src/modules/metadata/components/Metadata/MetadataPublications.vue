<template id="MetadataPublications">
  <expandable-text-layout
    :title="METADATA_PUBLICATIONS_TITLE"
    :text="replacedText || resolvedCitations"
    :showPlaceholder="loading"
    :emptyTextColor="emptyTextColor"
    :emptyText="emptyText"
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
import { extractPIDsFromText } from '@/factories/metaDataFactory';
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
      return 'https://www.envidat.ch/dora/';
      // return this.publicationsConfig?.resolveBaseUrl;
    },
    resolvedCitations(){
      const pids = extractPIDsFromText(this.text);

      if (pids?.length > 0) {
        this.resolvePids(this.text, pids);
      }

      return this.text;
    },
  },
  methods: {
    async resolvePids(text, pids) {

      this.resolveError = null;
      this.replacedText = null;
      let newText = null;
      this.isResolving = true;

      const requests = [];
      pids.forEach((id) => {
        const url = this.resolveBaseUrl + id;
        requests.push(axios.get(url));
      });

      try {
        const responses = await Promise.all(requests);
        let resolvedPubs = {};

        for (let i = 0; i < responses.length; i++) {
          const response = responses[i];
          resolvedPubs = { ...resolvedPubs, ...response.data };
        }

        const resolvedPublications = this.resolvedCitationText(resolvedPubs, pids);
        newText = this.replacePidsInText(text, resolvedPublications, pids);

      } catch (e) {
        this.resolveError = e;
      } finally {
        this.isResolving = false;
      }

      this.replacedText = newText;
    },
    resolvedCitationText(resolvedPubs, pids) {
      const newPubs = {};

      pids.forEach((id) => {
        const resolvedObject = resolvedPubs[id];
        const text = resolvedObject?.citation?.ACS;
        if (text) {
          newPubs[id] = text;
        }
      });

      return newPubs;
    },
    replacePidsInText(text, resolvedPublications, pids) {

      let newText = text;

      if (text) {

        pids.forEach((id) => {
          const citation = resolvedPublications[id];
          if (citation) {
            newText = newText.replace(id, citation);
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
  }),
};
</script>

<style scoped>
.relatedPubList .readableText ul > * + * {
  padding: 5px 0px;
}
</style>
