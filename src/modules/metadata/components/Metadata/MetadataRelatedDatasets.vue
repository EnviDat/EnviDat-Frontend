<template>
  <expandable-text-layout
      id="MetadataRelatedDatasets"
      :title="METADATA_DATASETS_TITLE"
      :text="getCitationsFromRelatedDatasets(text)"
      :showPlaceholder="showPlaceholder"
      :emptyTextColor="emptyTextColor"
      :emptyText="emptyText"
      :maxTextLength="maxTextLength"
      :sanitizeHTML="false"
      class="relatedPubList"
  />
<!--
  <v-card flat>

    <v-card-text>
      <expandable-text-layout
        id="MetadataRelatedDatasets"
        :title="METADATA_DATASETS_TITLE"
        :text="getCitationsFromRelatedDatasets(text)"
        :showPlaceholder="showPlaceholder"
        :emptyTextColor="emptyTextColor"
        :emptyText="emptyText"
        :maxTextLength="maxTextLength"
        :sanitizeHTML="false"
        class="relatedPubList"
      />
    </v-card-text>

    <v-card-text v-if="relatedMetadata.length > 0">
      <v-row>
        <v-col v-for="(dataset, index) in relatedMetadata"
                  :key="index">
          <MetadataCard v-bind="dataset"
          ></MetadataCard>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
-->

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

import { mapGetters } from 'vuex';
import ExpandableTextLayout from '@/components/Layouts/ExpandableTextLayout.vue';
import { METADATA_DATASETS_TITLE } from '@/factories/metadataConsts';
import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';
import { extractDatasetIdsFromText, getCitationList } from '@/factories/citationFactory';

export default {
  name: 'MetadataRelatedDatasets',
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
    showPlaceholder: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(METADATA_NAMESPACE, [
      'getCitationListFromIds',
    ]),
    relatedDatasetIds() {
      return extractDatasetIdsFromText(this.text);
    },
  },
  methods: {
    getCitationsFromRelatedDatasets(text) {
      if (!text) {
        return '';
      }

      const ids = this.relatedDatasetIds;

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
  },
  data: () => ({
    METADATA_DATASETS_TITLE,
  }),
};
</script>

<style scoped>
.relatedPubList .readableText ul > * + * {
  padding: 5px 0;
}
</style>
