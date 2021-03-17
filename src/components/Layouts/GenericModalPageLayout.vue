<template>
  <v-dialog v-model="showDialog"
            transition="dialog-bottom-transition"
            scrollable
            persistent >

    <v-card class="pa-0 ml-15">
      
      <v-toolbar flat
                  dark
                  color="primary" >

        <v-toolbar-title>{{ title }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon
                @click="closeClicked" >
          <v-icon dark >close</v-icon>
        </v-btn>

      </v-toolbar>

      <v-card-text class="pa-0"
                    :style="autoScroll ? '' : 'overflow: hidden;'" >
        
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
    eventBus.$on(METADATA_OPEN_MODAL, this.openClicked);
    eventBus.$on(METADATA_CLOSE_MODAL, this.closeClicked);
  },
  beforeDestroy() {
    eventBus.$off(METADATA_OPEN_MODAL, this.openClicked);
    eventBus.$off(METADATA_CLOSE_MODAL, this.closeClicked);
  },
  methods: {
    closeClicked() {
      this.showDialog = false;
      this.modalContentComponent = null;
    },
    openClicked(modalContentComponent) {
      this.modalContentComponent = modalContentComponent;
      this.showDialog = true;
    },    
  },
  data: () => ({
    showDialog: false,
    modalContentComponent: null,
  }),
};
</script>
