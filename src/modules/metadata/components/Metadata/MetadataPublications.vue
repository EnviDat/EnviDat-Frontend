<template  id="MetadataPublications">
  <expandable-text-layout v-bind="publications"
                            :showPlaceholder="showPlaceholder"
                            :maxTextLength="publications.maxTextLength"
                            :emptyTextColor="publications.emptyTextColor" />
</template>

<script>
/**
 * MetadataPublications.vue renders markdown showing the Related Publications of the metadatas.
 *
 * @summary shows the Related Publications of a metadata entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2019-11-28 16:02:25
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import ExpandableTextLayout from '@/components/Layouts/ExpandableTextLayout';

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
    publications() {
      let pub = this.mixinMethods_getGenericProp('publications');

      if (!pub) {
        pub = {
          title: 'Related Publications', 
          emptyTextColor: 'black',
          emptyText: 'No related publications available for this dataset.',
        };
      }

      return pub;
    },
  },
  methods: {
  },
  data: () => ({
  }),
};
</script>
