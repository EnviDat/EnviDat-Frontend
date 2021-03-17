<template  id="MetadataPublications">
  <expandable-text-layout :title="METADATA_PUBLICATIONS_TITLE"
                          v-bind="publications"
                          :showPlaceholder="loading"
                          :emptyTextColor="emptyTextColor"
                          :emptyText="emptyText"
                          class="relatedPubList"/>
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

import ExpandableTextLayout from '@/components/Layouts/ExpandableTextLayout';
import { METADATA_PUBLICATIONS_TITLE } from '@/factories/metadataConsts';

export default {
  name: 'MetadataPublications',
  components: {
    ExpandableTextLayout,
  },
  props: {
    genericProps: Object,
    showPlaceholder: Boolean,
  },
  computed: {
    loading() {
      return this.showPlaceholder || this.extractingIds || this.publicationsResolvingIds;
    },
    publications() {
      return this.mixinMethods_getGenericProp('publications');
    },
    extractingIds() {
      return this.mixinMethods_getGenericProp('extractingIds', false);
    },
    publicationsResolvingIds() {
      return this.mixinMethods_getGenericProp('publicationsResolvingIds', false);
    },
    emptyTextColor() {
      return this.mixinMethods_getGenericProp('emptyTextColor', 'grey');
    },
    emptyText() {
      return this.mixinMethods_getGenericProp('emptyText', 'No related publications available for this dataset.');
    },
  },
  methods: {
  },
  data: () => ({
    METADATA_PUBLICATIONS_TITLE,
  }),
};
</script>

<style scoped>
  .relatedPubList .readableText ul > * + * {
    padding: 5px 0px;
  }
</style>
