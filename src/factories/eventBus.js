import Vue from 'vue';

export const eventBus = new Vue(
  // {
  // name: 'eventBus',
  // }
);
eventBus.$name = 'eventBus';

export const METADATA_OPEN_MODAL = 'METADATA_OPEN_MODAL';
export const METADATA_CLOSE_MODAL = 'METADATA_CLOSE_MODAL';

export const GCNET_OPEN_DETAIL_CHARTS = 'GCNET_OPEN_DETAIL_CHARTS';
export const GCNET_INJECT_MICRO_CHARTS = 'GCNET_INJECT_MICRO_CHARTS';
