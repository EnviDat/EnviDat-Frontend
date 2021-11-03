<template  id="MetadataRelatedDatasets">
  <expandable-text-layout :title="METADATA_DATASETS_TITLE"
                          :text="relatedDatasetsText"
                          :showPlaceholder="showPlaceholder"
                          :emptyTextColor="emptyTextColor"
                          :emptyText="emptyText"
                          class="relatedPubList"/>
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
    relatedDatasetsText: {
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
    showPlaceholder: Boolean,
  },
  computed: {
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
