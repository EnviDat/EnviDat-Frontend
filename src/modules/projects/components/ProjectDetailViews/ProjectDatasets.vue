<template>
  <v-card>
    <v-card-title class="metadata_title text-h6 pa-4">
      {{ projectDatasetsTitle }}
    </v-card-title>

    <v-card-text v-if="hasMetadatas" class="pa-4 pt-0">
      <MetadataList
        ref="metadataList"
        :listContent="listContent"
        :mapFilteringPossible="mapFilteringPossible"
        :placeHolderAmount="placeHolderAmount"
        @clickedTag="$emit('clickedTag', $event)"
        :allTags="allTags"
        :selectedTagNames="selectedTagNames"
        @clickedTagClose="$emit('clickedTagClose', $event)"
        @clickedClear="$emit('clickedClear', $event)"
        @clickedCard="catchMetadataClicked"
        :prePinnedIds="prePinnedIds"
        @pinnedIds="catchPinnedIds"
        :defaultListControls="defaultListControls"
        :enabledControls="enabledControls"
        :minMapHeight="mapFilterHeight"
        :topFilteringLayout="topFilteringLayout"
        :showSearch="showSearch"
        :searchCount="listContent.length"
        :metadatasContent="metadatasContent"
        @setScroll="$emit('setScroll', $event)"
      />
    </v-card-text>

    <v-card-text v-if="!hasMetadatas" style="color: red;" class="pa-4 pt-0">
      {{ projectDatasetsEmptyText }}
    </v-card-text>
  </v-card>
</template>

<script>
/**
 * ProjectDatasets.vue renders a list of datasets or shows the empty state
 *
 * @summary shows the projects datasets
 * @author Dominik Haas-Artho
 *
 * Created at     : 2020-10-29 10:10:45
 * Last modified  : 2021-01-06 11:56:56
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import MetadataList from '@/components/MetadataList.vue';

export default {
  name: 'ProjectDatasets',
  components: {
    MetadataList,
  },
  props: {
    hasMetadatas: Boolean,
    listContent: Array,
    mapFilteringPossible: Boolean,
    placeHolderAmount: Number,
    allTags: Array,
    selectedTagNames: Array,
    defaultListControls: Array,
    enabledControls: Array,
    topFilteringLayout: Boolean,
    showSearch: Boolean,
    metadatasContent: Object,
    prePinnedIds: Array,
    loading: Boolean,
  },
  computed: {},
  methods: {
    catchPinnedIds(newPins) {
      this.$emit('pinnedIds', newPins);
    },
    catchMetadataClicked(datasetName) {
      this.$emit('clickedCard', datasetName);
    },
  },
  data: () => ({
    selectedPins: [],
    projectDatasetsTitle: 'Related Datasets',
    projectDatasetsEmptyText:
      'There are no datasets connected with this project.',
    mapFilterHeight: 400,
  }),
};
</script>
