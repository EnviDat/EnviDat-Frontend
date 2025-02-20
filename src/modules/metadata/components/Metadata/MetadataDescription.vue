<template id="MetadataDescription">
  <expandable-text-layout
    :title="METADATA_BODY_TITLE"
    :text="description"
    :showPlaceholder="showPlaceholder"
    :maxTextLength="maxTextLength"
    :emptyTextColor="emptyTextColor"
    :emptyText="emptyText"
    :showFullscreenButton="description?.length > maxTextLength"
    @fullscreenClick="triggerFullscreen"
  />
</template>

<script>
/**
 * MetadataDescription.vue renders markdown showing the description of the metadatas.
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

import { defineAsyncComponent } from 'vue';
import ExpandableTextLayout from '@/components/Layouts/ExpandableTextLayout.vue';
import { METADATA_BODY_TITLE } from '@/factories/metadataConsts';
import { eventBus, INJECT_GENERIC_COMPONENT } from '@/factories/eventBus';

const MetadataDescriptionAsync = defineAsyncComponent(() =>
  // eslint-disable-next-line import/no-self-import
  import('@/modules/metadata/components/Metadata/MetadataDescription.vue'),
)

export default {
  name: 'MetadataDescription',
  components: {
    ExpandableTextLayout,
  },
  props: {
    description: {
      type: String,
      default: undefined,
    },
    maxTextLength: {
      type: Number,
      default: undefined,
    },
    emptyTextColor: {
      type: String,
      default: 'red',
    },
    emptyText: {
      type: String,
      default: 'No description found for this dataset.',
    },
    showPlaceholder: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
  },
  methods: {
    triggerFullscreen() {
      // define the new max length very long for the fullscreen component
      // to avoid showing the fullscreen button again and show all the text at once
      const maxTextLength = 50000;

      eventBus.emit(INJECT_GENERIC_COMPONENT, {
        asyncComponent: MetadataDescriptionAsync,
        props: {
          ...this.$props,
          maxTextLength,
        },
      });
    },
  },
  data: () => ({
    METADATA_BODY_TITLE,
  }),
};
</script>

<style scoped></style>
