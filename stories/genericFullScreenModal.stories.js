/**
 * @summary story of GenericFullScreenModal sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-08-25 12:21:22
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

// eslint-disable-next-line import/extensions
import { envidatViewportParameters, mobileLargeViewportParams, mobileViewportParams, tabletViewportParams } from './js/envidatViewports';
import GenericFullScreenModal from '@/components/Layouts/GenericFullScreenModal.vue';
import {
  eventBus,
  GCNET_OPEN_DETAIL_CHARTS,
  INJECT_MAP_FULLSCREEN,
  OPEN_DATA_PREVIEW_IFRAME,
  OPEN_TEXT_PREVIEW,
} from '@/factories/eventBus';

import { createLocation } from '@/factories/metaDataFactory';
import { getFeatureCollectionFromGcNetStations } from '@/factories/chartFactory';
import txtPreviewFile from './js/previewTextFile.txt';

import stationsConfig from './testdata/stationsConfig.json';
import gcnetDataset from './js/gcnetDataset';
import stationParameters from './testdata/stationParameters.json'

const gcNetLocation = createLocation(gcnetDataset);
const fileObjects = stationParameters.fileObjects;
const graphStyling = stationParameters.graphStyling;

const featureCollection = getFeatureCollectionFromGcNetStations(stationsConfig);
const locationOverride = { ...gcNetLocation };
locationOverride.geoJSON = featureCollection;

const geoServiceConfig = {
  site: locationOverride,
/*
  error: this.geoServiceLayersError,
*/
  isGcnet: true,
};

export default {
  title: '13 Layouts / Generic Fullscreen Modal',
  // component: TextCardListLayout,
  decorators: [],
  parameters: {
    ...envidatViewportParameters,
  },
};


const loadTextPreview = () => {
  eventBus.emit(OPEN_TEXT_PREVIEW, txtPreviewFile);
}

const loadFullScreenMap = () => {
  eventBus.emit(INJECT_MAP_FULLSCREEN, geoServiceConfig);
}

const getCurrentStation = (stationId) => {
  for (let i = 0; i < stationsConfig.length; i++) {
    const station = stationsConfig[i];
    if (station.id === stationId || station.alias === stationId) {
      return station;
    }
  }

  return null;
};

const loadGcNetCharts = () => {

  eventBus.emit(GCNET_OPEN_DETAIL_CHARTS, {
    currentStation: getCurrentStation(0),
    fileObjects,
    graphStyling,
  });
}

const loadDataPreview = () => {
  const url = 'http://pointclouds.s3-website-zh.os.switch.ch/20220321_Ramerenwald_Benchmark/vis/Ramerenwald_Benchmark_FP05/Ramerenwald_Benchmark_FP05.html';
  eventBus.emit(OPEN_DATA_PREVIEW_IFRAME, url);
}

const Template = (args, { argTypes }) => ({
  components: { GenericFullScreenModal },
  props: Object.keys(argTypes),
  template: `<div>
    <v-btn v-bind="$props" 
      @click="$props.buttonClick" >
      {{ $props.buttonText }}
    </v-btn>
    <GenericFullScreenModal v-bind="$props" />
  </div>`,
});


export const TextPreviewModal = Template.bind({});
TextPreviewModal.args = {
  buttonClick: loadTextPreview,
  buttonText: 'load txt preview',
}

export const MobileTextPreviewModal = Template.bind({});
MobileTextPreviewModal.args = { ...TextPreviewModal.args };
MobileTextPreviewModal.parameters = mobileViewportParams;

export const MobileLargeTextPreviewModal = Template.bind({});
MobileLargeTextPreviewModal.args = { ...TextPreviewModal.args };
MobileLargeTextPreviewModal.parameters = mobileLargeViewportParams;

export const TabletTextPreviewModal = Template.bind({});
TabletTextPreviewModal.args = { ...TextPreviewModal.args };
TabletTextPreviewModal.parameters = tabletViewportParams;


export const MapFullscreenModal = Template.bind({});
MapFullscreenModal.args = {
  buttonClick: loadFullScreenMap,
  buttonText: 'load fullScreen map',
};

export const MobileMapFullscreenModal = Template.bind({});
MobileMapFullscreenModal.args = { ...MapFullscreenModal.args };
MobileMapFullscreenModal.parameters = mobileViewportParams;

export const MobileLargeMapFullscreenModal = Template.bind({});
MobileLargeMapFullscreenModal.args = { ...MapFullscreenModal.args };
MobileLargeMapFullscreenModal.parameters = mobileLargeViewportParams;

export const TabletMapFullscreenModal = Template.bind({});
TabletMapFullscreenModal.args = { ...MapFullscreenModal.args };
TabletMapFullscreenModal.parameters = tabletViewportParams;

export const GcNetDetailChartsModal = Template.bind({});
GcNetDetailChartsModal.args = {
  buttonClick: loadGcNetCharts,
  buttonText: 'load chart list',
};

export const MobileGcNetDetailChartsModal = Template.bind({});
MobileGcNetDetailChartsModal.args = { ...GcNetDetailChartsModal.args };
MobileGcNetDetailChartsModal.parameters = mobileViewportParams;

export const MobileLargeGcNetDetailChartsModal = Template.bind({});
MobileLargeGcNetDetailChartsModal.args = { ...GcNetDetailChartsModal.args };
MobileLargeGcNetDetailChartsModal.parameters = mobileLargeViewportParams;

export const TabletTextGcNetDetailChartsModal = Template.bind({});
TabletTextGcNetDetailChartsModal.args = { ...GcNetDetailChartsModal.args };
TabletTextGcNetDetailChartsModal.parameters = tabletViewportParams;

export const DataPreviewModal = Template.bind({});
DataPreviewModal.args = {
  buttonClick: loadDataPreview,
  buttonText: 'load data preview',
};

export const MobileDataPreviewModal = Template.bind({});
MobileDataPreviewModal.args = { ...DataPreviewModal.args };
MobileDataPreviewModal.parameters = mobileViewportParams;

export const MobileLargeDataPreviewModal = Template.bind({});
MobileLargeDataPreviewModal.args = { ...DataPreviewModal.args };
MobileLargeDataPreviewModal.parameters = mobileLargeViewportParams;

export const TabletDataPreviewModal = Template.bind({});
TabletDataPreviewModal.args = { ...DataPreviewModal.args };
TabletDataPreviewModal.parameters = tabletViewportParams;
