<template id="MetadataBody">
  <expandable-text-layout :title="METADATA_BODY_TITLE"
                          :text="body ? body.text : undefined"
                          :showPlaceholder="showPlaceholder"
                          :maxTextLength="body ? body.maxTextLength : undefined"
                          :emptyTextColor="emptyTextColor"
                          :emptyText="emptyText" />

</template>

<script>
/**
 * MetadataBody.vue renders markdown showing the description of the metadatas.
 *
 * @summary shows the description of a metadata entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2020-10-15 19:10:50
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import ExpandableTextLayout from '@/components/Layouts/ExpandableTextLayout';
import { METADATA_BODY_TITLE } from '@/factories/metadataConsts';

export default {
  name: 'MetadataBody',
  components: {
    ExpandableTextLayout,
  },
  props: {
    genericProps: Object,
    showPlaceholder: Boolean,
  },
  computed: {
    body() {
      return this.mixinMethods_getGenericProp('body');
    },
    emptyTextColor() {
      return this.mixinMethods_getGenericProp('emptyTextColor', 'red');
    },
    emptyText() {
      return this.mixinMethods_getGenericProp('emptyText', 'No description found for this dataset.');
    },
  },
  methods: {
  },
  data: () => ({
    METADATA_BODY_TITLE,
  }),
};
</script>

<style scoped>

  /* .heightAndScroll {
    max-height: 500px;
    overflow-y: auto !important;
  } */
</style>
