import axios from 'axios';
import { createWmsCatalog } from './catalogWms';

const COLORS = ['#B266E3', '#ED2D5D', '#142832', '#CB1FB2', '#85D257', '#9C6804', '#F26A70', '#2D698D', '#FE5460', '#04292C', '#2A98D1', '#7BE6BA', '#6955CA', '#036875', '#48D76E', '#112CC8', '#8774CF', '#3F36FB', '#18F88F', '#F17AA4'];

export const geoservices = {
  state: {
    basemap: 'streets',
    layerConfig: null,
    selectedLayer: null,
    splitLayer: null,
    splitScreen: false,
    show3d: false,
    show3dSplit: false,
    timeseries: [],
    site: null,
  },
  getters: {
    coords(state) {
      return state.timeseries.length > 0 ? state.timeseries.map(t => t.coords) : [];
    },
  },
  mutations: {
    setTimeseries(state, payload) {
      state.timeseries = payload;
    },
    addTimeSeries(state, payload) {
      state.timeseries.push({ ...payload, id: state.timeseries.length, color: COLORS[state.timeseries.length] });
    },
    removeTimeseries(state, id) {
      state.timeseries = state.timeseries.filter(t => t.id === id);
    },
    setLayerConfig(state, payload) {
      state.layerConfig = payload;
    },
    setSelectedLayer(state, payload) {
      state.selectedLayer = payload;
    },
    setSplitLayer(state, payload) {
      state.splitLayer = payload;
    },
    setSplitScreen(state, payload) {
      state.splitScreen = payload;
    },
    setBasemap(state, payload) {
      state.basemap = payload;
    },
    setSite(state, payload) {
      state.site = payload;
    },
    setShow3d(state, payload) {
      state.show3d = payload;
    },
    setShow3dSplit(state, payload) {
      state.show3dSplit = payload;
    },
  },
  actions: {
    fetchLayerConfig({ state, commit }, url) {
      if (!state.layerConfig) {
        axios.get(url)
          .then((res) => {
            commit('setLayerConfig', res.data);
            commit('setSelectedLayer', res.data.layers.find(layer => layer.visibility).name);
            commit('setSplitLayer', res.data.layers.find(layer => layer.visibility).name);
          });
      }
    },
    fetchWmsConfig({ commit }, url) {
      createWmsCatalog(url)
        .then((res) => {
          commit('setLayerConfig', res);
          commit('setSelectedLayer', res.layers[0].name);
        });
    },
    startSplitScreen({ state, commit }) {
      commit('setSplitLayer', state.selectedLayer);
      commit('setSplitScreen', true);
    },
    closeFeatureInfo({ commit }) {
      commit('setTimeseries', []);
    },
  },
};