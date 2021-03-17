<template>
  <v-card>
    <v-card-title class="metadata_title title pa-4">
      {{ projectDatasetsTitle }}
    </v-card-title>

    <v-card-text v-if="hasMetadatas"
                  class="pa-4 pt-0">

      <MetadataList ref="metadataList"
                      :listContent="listContent"
                      :showMapFilter="showMapFilter"
                      :mapFilteringPossible="mapFilteringPossible"
                      :placeHolderAmount="placeHolderAmount"
                      @clickedTag="$emit('clickedTag', $event)"
                      :allTags="allTags"
                      :selectedTagNames="selectedTagNames"
                      @clickedTagClose="$emit('clickedTagClose', $event)"
                      @clickedClear="$emit('clickedClear', $event)"
                      :defaultListControls="defaultListControls"
                      :enabledControls="enabledControls"
                      :minMapHeight="mapFilterHeight"
                      :topFilteringLayout="topFilteringLayout"
                      :showSearch="showSearch"
                      :searchCount="listContent.length"
                      @setScroll="$emit('setScroll', $event)" />
    </v-card-text>

    <v-card-text v-if="!hasMetadatas"
                  style="color: red;"
                  class="pa-4 pt-0" >
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
import MetadataList from '@/components/MetadataList';

export default {
  name: 'ProjectDatasets',
  components: {
    MetadataList,
  },
  props: {
    hasMetadatas: Boolean,
    listContent: Array,
    showMapFilter: Boolean,
    mapFilteringPossible: Boolean,
    placeHolderAmount: Number,
    allTags: Array,
    selectedTagNames: Array,
    defaultListControls: Array,
    enabledControls: Array,
    topFilteringLayout: Boolean,
    showSearch: Boolean,
  },
  computed: {
  },
  methods: {
  },
  data: () => ({
    projectDatasetsTitle: 'Related Datasets',
    projectDatasetsEmptyText: 'There are no datasets connected with this project.',
    mapFilterHeight: 400,
  }),
};
</script>
