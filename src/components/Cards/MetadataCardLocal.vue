<template>
  <div class="localCard"
       :style="`border: 2px dashed ${$vuetify.theme.themes.light.colors.secondary};`">
    <MetadataCard v-bind="$props"
                  @clickedEvent="$emit('clickedEvent')"
                  @clickedTag="$emit('clickedTag')"
                  @openButtonClicked="$emit('openButtonClicked')"/>
  </div>
</template>

<script>
/**
 * MetadataCardLocal.vue is a decorator for a local only MetadataCard / dataset
 *
 * @summary local only decorator for MetadataCard
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import MetadataCard from '@/components/Cards/MetadataCard.vue';

export default {
  name: 'MetadataCardLocal',
  props: {
    id: String,
    title: String,
    subtitle: String,
    name: String,
    type: Number,
    restricted: Boolean,
    tags: {
      type: Array,
      default: null,
    },
    titleImg: String,
    dark: Boolean,
    flatLayout: Boolean,
    compactLayout: Boolean,
    fileIconString: String,
    lockedIconString: String,
    unlockedIconString: String,
    geoJSONIcon: String,
    categoryColor: String,
    showGenericOpenButton: {
      type: Boolean,
      default: false,
    },
    openButtonTooltip: String,
    openButtonIcon: {
      type: String,
      default: 'preview',
    },
    state: {
      type: String,
      default: '',
    },
    organization: {
      type: String,
      default: '',
    },
    organizationTooltip: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: '',
    },
    showOrganizationOnHover: {
      type: Boolean,
      default: undefined,
    },
  },
  computed: {
  },
  methods: {
  },
  components: {
    MetadataCard,
  },
  data: () => ({
  }),
};
</script>

<style scoped>

  .localCard {
    background-color: white;
  }
</style>
