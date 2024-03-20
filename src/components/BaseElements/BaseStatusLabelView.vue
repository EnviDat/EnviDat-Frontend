<template>
  <v-container
    fluid
    :id="`BaseStatusLabelView_${status}`"
    class="pa-0"
    :style="expanded ? `border: solid 1px ${statusTextColor};` : ''"
  >
    <v-row v-show="loading"
           no-gutters justify="start" class="align-center">
      <v-col class="flex-grow-0 pa-1 pt-2">
        <div class="skeleton skeleton-animation-shimmer">
          <div style="width: 24px; height: 24px;" class="bone bone-type-image bone-style-round"></div>
        </div>
      </v-col>

      <v-col class="px-2">
        <div class="skeleton skeleton-animation-shimmer">
          <div style="width: 100%; height: 15px;"  class="bone bone-type-heading" ></div>
        </div>
      </v-col>
    </v-row>

    <v-row v-show="!loading"
           no-gutters justify="start" class="align-center">
      <v-col class="flex-grow-0 px-2">
        <BaseIcon :color="statusColor"
                  :icon="statusIcon"
                v-on="expandedText ? { click: () => { expanded = !expanded } } : {}"
        />
      </v-col>

      <v-col
        class="grow text-caption"
        :style="expandedText ? 'cursor: pointer;' : ''"
        v-on="expandedText ? { click: () => { expanded = !expanded } } : {}"
      >
        {{ statusText }}
      </v-col>

      <v-col v-show="showExpandIcon"
             class="flex-grow-0">
        <BaseIconButton
          :icon="mdiMenuDown"
          iconColor="primary"
          outlined
          small
          :rotated="expanded"
          @clicked="expanded = !expanded"
        />
      </v-col>
    </v-row>

    <!-- <v-expand-y-transition v-show="expanded"
                            transition="scroll-y-transition" > -->
    <v-row
      v-show="expanded && expandedText"
      no-gutters
      justify="start"
      class="align-center py-1 px-2 text-caption"
    >
      <v-alert :icon="statusIcon" :type="status" variant="tonal">{{ expandedText }}</v-alert>
    </v-row>
    <!-- </v-expand-y-transition> -->
  </v-container>
</template>

<script>
/**
 * BaseStatusLabelView.vue a Label with a status icon and an expand button with expanded text.
 *
 * @summary status icon with label and text
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00
 * Last modified  : 2019-11-28 16:15:58
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import {mdiAlertCircle, mdiCheckCircle, mdiCloseCircle, mdiInformation, mdiMenuDown} from '@mdi/js';
import BaseIcon from '@/components/BaseElements/BaseIcon.vue';

export default {
  name: 'BaseStatusLabelView',
  props: {
    loading: { type: Boolean, default: false },
    expandedText: String,
    status: String,
    statusColor: String,
    statusText: String,
    showExpandIcon: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    statusTextColor() {
      return (
        this.$vuetify.theme.themes.light[this.statusColor] || this.statusColor
      );
    },
    statusIcon() {
      if (this.status === 'check') {
        return mdiCheckCircle;
      }
      if (this.status === 'info') {
        return mdiInformation;
      }
      if (this.status === 'warning') {
        return mdiAlertCircle;
      }
      if (this.status === 'error') {
        return mdiCloseCircle;
      }

      return mdiInformation;
    },
  },
  data: () => ({
    mdiMenuDown,
    mdiInformation,
    mdiAlertCircle,
    mdiCloseCircle,
    mdiCheckCircle,
    expanded: false,
  }),
  components: {
    BaseIcon,
    BaseIconButton,
  },
};
</script>

<style></style>
