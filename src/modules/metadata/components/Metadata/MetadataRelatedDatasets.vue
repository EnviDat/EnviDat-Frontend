<template>
  <expandable-text-layout
    id="MetadataRelatedDatasets"
    :title="METADATA_DATASETS_TITLE"
    :text="getCitationsFromRelatedDatasets(text)"
    :showPlaceholder="showPlaceholder || resolvingText"
    :emptyTextColor="emptyTextColor"
    :emptyText="emptyText"
    :maxTextLength="maxTextLength"
    class="relatedPubList"
  />
</template>

<script>
/**
 * MetadataRelatedDatasets.vue renders markdown showing the Related Datasets of the metadata entry.
 *
 * @summary shows the Related Datasets of a metadata entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-11-03 10:16:00
 * Last modified  : 2021-11-03 10:16:00
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import ExpandableTextLayout from '@/components/Layouts/ExpandableTextLayout.vue';
import { METADATA_DATASETS_TITLE } from '@/factories/metadataConsts';
import { mapGetters } from 'vuex';
import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';
import { getCitationList } from '@/factories/metaDataFactory';

export default {
  name: 'MetadataRelatedDatasets',
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
      default: 'No related datasets available for this dataset.',
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
    ...mapGetters(METADATA_NAMESPACE, [
      'allMetadatas',
      'getCitationListFromIds',
    ]),
  },
  methods: {
    getDatasetIdsFromText(text) {
      const matches = text.match(/\/#\/metadata\/[a-zA-Za_\d]+/gm);
      const ids = [];

      if (matches) {
        for (let i = 0; i < matches.length; i++) {

          const match = matches[i];
          const splits = match.split('/');

          if (splits.length > 0) {
            const id = splits[splits.length - 1];
            ids.push(id);
          }
        }
      }

      return ids;
    },
    getCitationsFromRelatedDatasets(text) {
      if (!text) {
        return '';
      }

      const ids = this.getDatasetIdsFromText(text);

      if (ids.length <= 0){
        return text;
      }

      let citations = [];
      if (this.$store) {
        citations = this.getCitationListFromIds(ids);
      } else {
        citations = getCitationList(this.allDatasets, ids);
      }

      let citationText = '';

      for (let i = 0; i < citations.length; i++) {
        citationText += `${citations[i].citationText}\n\n`;
      }

      return citationText;
    },
/*
    async LoadCitationsFromDORA(text) {
      if (!text) {
        return '';
      }

      this.resolvingText = true;

      const ids = this.getDatasetIdsFromText(text);
      const DOIs = this.getDOIsFromDatasets(ids);

    },
    getDOIsFromDatasets(datasetIds) {
      const DOIs = [];

      if (datasetIds.length <= 0){

        const datasetMatches = this.allMetadatas.filter((d) => datasetIds.includes(d.name || datasetIds.includes(d.id)));

        for (let i = 0; i < datasetMatches.length; i++) {
          const doi = datasetMatches[i].doi;
          if (doi) {
            DOIs.push(doi);
          }
        }
      }

      return DOIs;
    },
*/
  },
  data: () => ({
    METADATA_DATASETS_TITLE,
    resolvedText: null,
    resolvingText: false,
  }),
};
</script>

<style scoped>
.relatedPubList .readableText ul > * + * {
  padding: 5px 0;
}
</style>
