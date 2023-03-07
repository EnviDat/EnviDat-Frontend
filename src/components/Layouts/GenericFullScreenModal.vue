<template>
  <v-dialog v-model="showModal"
            id="GenericFullScreenModalF"
            transition="dialog-bottom-transition"
            scrollable
            fullscreen
            class="pa-2"
            style="z-index: 2030;">

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

          <v-col class="shrink" >

            <BaseIconButton id="GenericFullScreenModalCloseButton"
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
import {
  eventBus,
  OPEN_FULLSCREEN_MODAL,
  CLOSE_FULLSCREEN_MODAL,
  GCNET_OPEN_DETAIL_CHARTS,
  OPEN_TEXT_PREVIEW,
  OPEN_DATA_PREVIEW_IFRAME,
  INJECT_MAP_FULLSCREEN,
} from '@/factories/eventBus';

import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import { getPreviewStrategy, getPreviewStrategyFromUrlExtension } from '@/factories/strategyFactory';

const MetadataMapFullscreen = () => import('@/modules/metadata/components/Geoservices/MetadataMapFullscreen.vue');
const DetailChartsList = () => import('@/modules/metadata/components/GC-Net/DetailChartsList.vue');

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
  },
  beforeDestroy() {
    eventBus.off(OPEN_FULLSCREEN_MODAL, this.openModal);
    eventBus.off(CLOSE_FULLSCREEN_MODAL, this.closeModal);
    eventBus.off(GCNET_OPEN_DETAIL_CHARTS, this.showGCNetModal);
    eventBus.off(OPEN_TEXT_PREVIEW, this.showTextPreviewModal);
    eventBus.off(OPEN_DATA_PREVIEW_IFRAME, this.showDataPreviewIframe);
    eventBus.off(INJECT_MAP_FULLSCREEN, this.showFullscreenMapModal);
  },
  computed: {
  },
  methods: {
    closeClicked() {
      eventBus.emit(CLOSE_FULLSCREEN_MODAL);
    },
    showGCNetModal({ currentStation, fileObjects, graphStyling, config }) {
      this.currentComponent = DetailChartsList;
      this.modalTitle = `Sensor measurements for ${currentStation ? currentStation.name : '' } station`;

      this.genericProps = {
        currentStation,
        fileObjects,
        graphStyling,
        config,
      };

      eventBus.emit(OPEN_FULLSCREEN_MODAL);
    },
    showTextPreviewModal(url) {

      const previewStrat = getPreviewStrategyFromUrlExtension(url);
      this.currentComponent = previewStrat.component;
      this.genericProps = { url };

      const splits = url.split('/');
      const fileName = splits[splits.length - 1];

      this.modalTitle = `Preview of ${fileName}`;

      eventBus.emit(OPEN_FULLSCREEN_MODAL);
    },
    showDataPreviewIframe({ previewProperty, url }) {

      const previewStrat = getPreviewStrategy(previewProperty);
      this.currentComponent = previewStrat.component;
      this.genericProps = { url };

      const splits = url.split('/');
      const fileName = splits[splits.length - 1];

      this.modalTitle = `Data Preview of ${fileName}`;

      eventBus.emit(OPEN_FULLSCREEN_MODAL);
    },
    showFullscreenMapModal({ site, layerConfig }) {

      // this.modalTitle = `Fullscreen Map for ${metadataTitle}`;
      this.modalTitle = 'Fullscreen Map';

      this.currentComponent = MetadataMapFullscreen;
      this.genericProps = {
        site,
        layerConfig,
      };

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
    showModal: false,
    genericProps: {},
    currentComponent: null,
    modalTitle: '',
  }),
};
</script>


<style scoped>

</style>
