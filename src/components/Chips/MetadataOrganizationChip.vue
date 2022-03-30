<template>
  <v-chip class="organizationChip text--black px-2"
          :outlined="!showContent"
          color="black"
          @mouseover="hover = true"
          @mouseleave="hover = false"
          @click="$emit('organizationClicked', organization)">

    <v-tooltip v-if="tooltip"
               bottom>
      <template v-slot:activator="{ on }">
        <div v-on="on" >
          <v-icon size="18">home_filled</v-icon>
          {{ showContent ? organizationText : '' }}
        </div>
      </template>
      
      <span>{{ toolTipText }}</span>
    </v-tooltip>

    <div v-if="!tooltip">
      <v-icon size="18">home_filled</v-icon>
      {{ showContent ? organizationText : '' }}
    </div>

  </v-chip>
</template>

<script>
/**
 * MetadataOrganizationChip.vue shows Organization
 *
 * @summary shows Organization
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-12-14 14:19:00
 * Last modified  : 2021-12-14 14:19:00
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

export default {
  name: 'MetadataOrganizationChip',
  props: {
    organization: {
      type: String,
      default: '',
    },
    tooltip: {
      type: String,
      default: '',
    },
    showOnHover: {
      type: Boolean,
      default: false,
    },
    clickCallback: Function,
  },
  computed: {
    organizationText() {
      return this.organization?.toUpperCase() || '';
    },
    toolTipText() {
      return `Is part of the ${this.tooltip} organization`;
    },
    showContent() {
      return !this.showOnHover || (this.showOnHover && this.hover);
    },
  },
  data: () => ({
    hover: false,
  }),
};
</script>

<style scoped>
  .organizationChip{
    height: 1.5rem;
    font-size: 0.75rem;
    max-width: 120px;
    background-color: #e0e0e0 !important;
  }

  .organizationChip > .v-chip__content > div:nth-child(1) {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .organizationChip .v-icon {
    top: -1px;
    left: -0.5px;
  }
</style>
