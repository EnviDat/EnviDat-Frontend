<template>
  <v-dialog v-model="showModal"
            id="GenericFullScreenModalF"
            transition="dialog-bottom-transition"
            scrollable
            fullscreen
            class="pa-2"
            :style="`z-index: 2030; scrollbar-width: thin; scrollbar-color: ${scrollbarColorFront} ${scrollbarColorBack};`"
            >

    <v-card class="fill-height pa-0" >

      <v-sheet flat
               dark
               color="primary"
               class="pa-4"
              style="height: 64px;">

        <v-row no-gutters
               justify="space-between"
                align-content="center">

          <v-col class="text-xs-body-1 text-sm-h6">
            {{ modalTitle }}
          </v-col>

          <v-col class="flex-grow-0" >

            <BaseIconButton
              class="genericFullScreenModalCloseButton"
              :icon="mdiClose"
              icon-color="white"
              color="white"
              outlined
              tooltip-text="Close fullscreen view"
              :tooltip-bottom="true"
              @clicked="closeClicked"
            />

          </v-col>
        </v-row>
      </v-sheet>

      <v-card-text class="pa-0"
                    style="overflow: auto;" >

          <component :is="currentComponent"
                      v-bind="genericProps" />

      </v-card-text>
    </v-card>


  </v-dialog>
</template>

<script>
/**
 * GenericFullScreenModal.vue provides the layout
 * for any component to be shown in a fullscreen modal
 *
 * @summary fullscreen modal page
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-02-02 14:48:10
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import { mdiClose } from '@mdi/js';
import { defineAsyncComponent } from 'vue';
import {
  eventBus,
  OPEN_FULLSCREEN_MODAL,
  CLOSE_FULLSCREEN_MODAL,
  GCNET_OPEN_DETAIL_CHARTS,
  OPEN_TEXT_PREVIEW,
  OPEN_DATA_PREVIEW_IFRAME,
  INJECT_MAP_FULLSCREEN,
  INJECT_GENERIC_COMPONENT,
} from '@/factories/eventBus';

import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import {
  getPreviewStrategy,
  getPreviewStrategyFromUrlExtension,
  SHOW_DATA_PREVIEW_PROPERTY,
} from '@/factories/strategyFactory';

const GcNetDetailChartsList = defineAsyncComponent(() =>
  import('@/modules/metadata/components/GC-Net/GcNetDetailChartsList.vue'),
)

const MetadataMapFullscreen = defineAsyncComponent(() =>
  import('@/modules/metadata/components/Geoservices/MetadataMapFullscreen.vue'),
)

export default {
  name: 'GenericFullScreenModal',
  props: {
    autoScroll: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    eventBus.on(OPEN_FULLSCREEN_MODAL, this.openModal);
    eventBus.on(CLOSE_FULLSCREEN_MODAL, this.closeModal);
    eventBus.on(GCNET_OPEN_DETAIL_CHARTS, this.showGCNetModal);
    eventBus.on(OPEN_TEXT_PREVIEW, this.showTextPreviewModal);
    eventBus.on(OPEN_DATA_PREVIEW_IFRAME, this.showDataPreviewIframe);
    eventBus.on(INJECT_MAP_FULLSCREEN, this.showFullscreenMapModal);
    eventBus.on(INJECT_GENERIC_COMPONENT, this.showGenericComponent);
  },
  beforeUnmount() {
    eventBus.off(OPEN_FULLSCREEN_MODAL, this.openModal);
    eventBus.off(CLOSE_FULLSCREEN_MODAL, this.closeModal);
    eventBus.off(GCNET_OPEN_DETAIL_CHARTS, this.showGCNetModal);
    eventBus.off(OPEN_TEXT_PREVIEW, this.showTextPreviewModal);
    eventBus.off(OPEN_DATA_PREVIEW_IFRAME, this.showDataPreviewIframe);
    eventBus.off(INJECT_MAP_FULLSCREEN, this.showFullscreenMapModal);
    eventBus.on(INJECT_GENERIC_COMPONENT, this.showGenericComponent);
  },
  computed: {
    scrollbarColorFront() {
      return this.$vuetify ? this.$vuetify.theme.themes.light.colors.highlight : 'auto';
    },
    scrollbarColorBack() {
      return this.$vuetify ? '#F0F0F0' : 'auto';
    },
  },
  methods: {
    closeClicked() {
      eventBus.emit(CLOSE_FULLSCREEN_MODAL);
    },
    showGCNetModal({ currentStation, fileObjects, graphStyling, config }) {
      this.currentComponent = GcNetDetailChartsList;

      this.genericProps = {
        currentStation,
        fileObjects,
        graphStyling,
        config,
      };

      this.modalTitle = `Sensor measurements for ${currentStation ? currentStation.name : '' } station`;

      eventBus.emit(OPEN_FULLSCREEN_MODAL);
    },
    showTextPreviewModal(url) {

      const previewStrat = getPreviewStrategyFromUrlExtension(url);

      if (previewStrat) {
        this.currentComponent = previewStrat.component;
        this.genericProps = { url };

        const splits = url.split('/');
        const fileName = splits[splits.length - 1];

        this.modalTitle = `Preview of ${fileName}`;

        eventBus.emit(OPEN_FULLSCREEN_MODAL);
      }
    },
    showDataPreviewIframe(url) {

      const previewStrat = getPreviewStrategy(SHOW_DATA_PREVIEW_PROPERTY);

      if (previewStrat) {
        this.currentComponent = previewStrat.component;
        this.genericProps = { url };

        const splits = url.split('/');
        const fileName = splits[splits.length - 1];

        this.modalTitle = `Data Preview of ${fileName}`;

        eventBus.emit(OPEN_FULLSCREEN_MODAL);
      }
    },
    showFullscreenMapModal({ site, layerConfig }) {

      // this.modalTitle = `Fullscreen Map for ${metadataTitle}`;
      this.modalTitle = 'Fullscreen Map';

      this.genericProps = {
        site,
        layerConfig,
      };

      this.currentComponent = MetadataMapFullscreen;

      eventBus.emit(OPEN_FULLSCREEN_MODAL);
    },
    showGenericComponent({ asyncComponent, props }) {
      this.genericProps = props;
      this.modalTitle = 'Fullscreen';
      
      this.currentComponent = asyncComponent;

      eventBus.emit(OPEN_FULLSCREEN_MODAL);
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.genericProps = {};
      this.currentComponent = null;
      this.modalTitle = '';
    },
  },
  components: { BaseIconButton },
  data: () => ({
    mdiClose,
    showModal: false,
    genericProps: {},
    currentComponent: null,
    modalTitle: '',
  }),
};
</script>


<style scoped>

</style>
