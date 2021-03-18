import axios from 'axios';

const COLORS = ['#B266E3', '#ED2D5D', '#142832', '#CB1FB2', '#85D257', '#9C6804', '#F26A70', '#2D698D', '#FE5460', '#04292C', '#2A98D1', '#7BE6BA', '#6955CA', '#036875', '#48D76E', '#112CC8', '#8774CF', '#3F36FB', '#18F88F', '#F17AA4'];

export const geoservices = {
  state: {
    basemap: 'streets',
    config: null,
    selectedLayer: null,
    splitLayer: null,
    splitScreen: false,
    show3d: false,
    show3dSplit: false,
    linkedScreens: false,
    extent: null,
    timeseries: [],
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
    setExtent(state, payload) {
      state.extent = payload;
    },
    setLinkedScreens(state, payload) {
      state.linkedScreens = payload;
    },
    setConfig(state, payload) {
      state.config = payload;
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
    setShow3d(state, payload) {
      state.show3d = payload;
      if (state.linkedScreens || !state.splitScreen) {
        state.show3dSplit = payload;
      }
    },
    setShow3dSplit(state, payload) {
      state.show3dSplit = payload;
      if (state.linkedScreens) {
        state.show3d = payload;
      }
    },
  },
  actions: {
    fetchConfig({ state, commit }, url) {
      if (!state.config) {
        axios.get(url)
          .then((res) => {
            commit('setConfig', res.data);
            commit('setSelectedLayer', res.data.layers.find(layer => layer.visibility).name);
          });
      }
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
