<template>
  <v-card id="MetadataCustomFields">
    <v-card-title class="metadata_title text-h6 py-4">
      {{ title }}
    </v-card-title>

    <v-card-title v-if="showPlaceholder">
      <v-skeleton-loader type="paragraph" color="gray" />
    </v-card-title>

    <v-card-text
      v-if="hasCustomFields"
      class="pa-4 pt-0 readableText"
      :style="`overflow-x: hidden; scrollbar-color: ${scrollbarColorFront} ${scrollbarColorBack}`"
    >
      <v-row>
        <v-col v-for="(item, index) in filteredFields" :key="`custom_${index}`" cols="12">
          <strong>{{ item.key }}</strong>
          <span v-if="item.value">: {{ item.value }}</span>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text v-if="showPlaceholder && !hasCustomFields" class="pa-4 pt-0">
      <v-skeleton-loader type="paragraph" color="gray" />
    </v-card-text>

    <v-card-text
      v-if="!showPlaceholder && !hasCustomFields"
      class="pa-4 pt-0 readableText"
      :style="`color: ${emptyTextColor};`"
    >
      {{ emptyText }}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'MetadataCustomFields',
  data: () => ({
    filteredKeys: ['deprecatedResources'],
  }),
  props: {
    extras: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: 'Custom Fields',
    },
    emptyTextColor: {
      type: String,
      default: 'grey',
    },
    emptyText: {
      type: String,
      default: 'No custom fields available for this dataset.',
    },
    showPlaceholder: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    filteredFields() {
      if (!Array.isArray(this.extras)) {
        return [];
      }

      return this.extras.filter((entry) => !this.filteredKeys.includes(entry.key));
    },
    hasCustomFields() {
      return this.filteredFields.length > 0;
    },
    scrollbarColorFront() {
      return '#999';
    },
    scrollbarColorBack() {
      return '#eee';
    },
  },
};
</script>

<style scoped></style>
