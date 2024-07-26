import axios from 'axios';

const matomoState = {
  siteId: 37,
  startDate: '2024-07-23',
  endDate: 'today',
  token: import.meta.env.VITE_MATOMO_TOKEN,
  baseUrl: '/api',
};

export const matomo = {
  namespaced: true,
  state: matomoState,
  actions: {
    async getResourcesDownloads({ state }, name) {
      const url = `${
        state.baseUrl
      }/index.php?module=API&method=Events.getName&idSite=${
        state.siteId
      }&period=range&date=${state.startDate},${
        state.endDate
      }&format=json&token_auth=${state.token}&label=${encodeURIComponent(
        name,
      )}`;

      try {
        const response = await axios.get(url);
        const downloadCount =
          response.data.length > 0 ? response.data[0]?.nb_events : null;
        return downloadCount;
      } catch (error) {
        console.error('Error fetching resource downloads:', error);
        return null;
      }
    },
  },
};

export function getResourcesDownloads(name) {
  return matomo.actions.getResourcesDownloads({ state: matomoState }, name);
}
