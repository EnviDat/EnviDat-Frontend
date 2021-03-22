<template id="MetadataBody">
  <expandable-text-layout v-bind="body"
                          :showPlaceholder="showPlaceholder"
                          :maxTextLength="body.maxTextLength"
                          :emptyTextColor="body.emptyTextColor" />

</template>

<script>
/**
 * MetadataBody.vue renders markdown showing the description of the metadatas.
 *
 * @summary shows the description of a metadata entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2019-11-20 13:07:27
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import ExpandableTextLayout from '@/components/Layouts/ExpandableTextLayout';

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
      let body = this.mixinMethods_getGenericProp('body');

      if (!body) {
        body = { title: 'Description' };
      }

      return body;
    },
  },
  methods: {
  },
  data: () => ({
  }),
};
</script>

<style scoped>

  /* .heightAndScroll {
    max-height: 500px;
    overflow-y: auto !important;
  } */
</style>
