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

export const INJECT_RESOURCE_STRATEGY = 'INJECT_RESOURCE_STRATEGY';

export const OPEN_TEXT_PREVIEW = 'OPEN_TEXT_PREVIEW';
export const INJECT_TEXT_PREVIEW = 'INJECT_TEXT_PREVIEW';
