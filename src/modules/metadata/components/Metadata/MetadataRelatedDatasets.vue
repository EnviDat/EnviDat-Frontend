<template >
  <expandable-text-layout  id="MetadataRelatedDatasets"
                           :title="METADATA_DATASETS_TITLE"
                           v-bind="datasets"
                          :showPlaceholder="showPlaceholder"
                          :emptyTextColor="emptyTextColor"
                          :emptyText="emptyText"
                          class="relatedPubList" />
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

import ExpandableTextLayout from '@/components/Layouts/ExpandableTextLayout';
import { METADATA_DATASETS_TITLE } from '@/factories/metadataConsts';

export default {
  name: 'MetadataRelatedDatasets',
  components: {
    ExpandableTextLayout,
  },
  props: {
    genericProps: Object,
    showPlaceholder: Boolean,
  },
  computed: {
    emptyTextColor() {
      return this.mixinMethods_getGenericProp('emptyTextColor', 'grey');
    },
    emptyText() {
      return this.mixinMethods_getGenericProp('emptyText', 'No related datasets available for this dataset.');
    },
    datasets() {
      return this.mixinMethods_getGenericProp('datasets');
    },
  },
  methods: {
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
