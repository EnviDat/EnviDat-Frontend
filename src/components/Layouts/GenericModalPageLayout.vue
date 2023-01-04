<template>
  <v-dialog v-model="showDialog"
            id="GenericModalPageLayout"
            transition="dialog-bottom-transition"
            scrollable
            persistent
            style="z-index: 1030;">

    <v-card class="pa-0 ml-15" >

      <v-sheet flat
               dark
               color="primary"
               class="pa-4"
              style="height: 64px;">

        <v-row no-gutters
               justify="space-between"
                align-content="center">

          <v-col class="text-h6">
            {{ title }}
          </v-col>

          <v-col class="shrink" >

            <BaseIconButton id="GenericModalPageLayoutCloseButton"
                              material-icon-name="close"
                              icon-color="white"
                              color="white"
                              outlined
                              tooltipText="Close fullscreen view"
                              :tooltipBottom="true"
                              @clicked="closeClicked" />

          </v-col>
        </v-row>
      </v-sheet>

      <v-card-text class="pa-0"
                    :style="autoScroll ? 'overflow: auto;' : 'overflow: hidden;'" >

        <slot name="default" />

      </v-card-text>
    </v-card>

  </v-dialog>
</template>

<script>
/**
 * GenericModalPageLayout.vue renders a list of markdown objects
 *
 * @summary renders a list of markdown objects
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-02-02 14:48:10
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import {
  eventBus,
  METADATA_OPEN_MODAL,
  METADATA_CLOSE_MODAL,
} from '@/factories/eventBus';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';

export default {
  name: 'GenericModalPageLayout',
  props: {
    title: String,
    autoScroll: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    eventBus.on(METADATA_OPEN_MODAL, this.openClicked);
  },
  beforeUnmount() {
    eventBus.off(METADATA_OPEN_MODAL, this.openClicked);
  },
  methods: {
    closeClicked() {
      this.showDialog = false;

      eventBus.emit(METADATA_CLOSE_MODAL);
    },
    openClicked() {
      this.showDialog = true;
    },
  },
  components: { BaseIconButton },
  data: () => ({
    showDialog: false,
  }),
};
</script>


<style scoped>

</style>
