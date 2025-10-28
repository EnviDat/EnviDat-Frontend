import axios from 'axios';

const matomoState = {
  siteId: 36,
  startDate: '2024-07-23',
  endDate: 'today',
  token: process.env.VITE_MATOMO_TOKEN,
  baseUrl: '/api',
  eventsBasedOnPage: null,
};

export const matomo = {
  namespaced: true,
  state: matomoState,
  actions: {
    async getResourcesDownloads({ state }, name) {
      const url = `${state.baseUrl}/index.php?module=API&method=Events.getName&idSite=${
        state.siteId
      }&period=range&date=${state.startDate},${
        state.endDate
      }&format=json&token_auth=${state.token}&label=${encodeURIComponent(name)}`;

      try {
        const response = await axios.get(url);
        const downloadCount = response.data.length > 0 ? response.data[0]?.nb_events : null;
        return downloadCount;
      } catch (error) {
        console.error('Error fetching resource downloads:', error);
        return null;
      }
    },

    async getEventsForPageAndName({ state }, pageName, eventAction) {
      try {
        // Get All events name for the page
        const getName = `${state.baseUrl}/index.php?module=API&method=Events.getName&format=JSON&idSite=${state.siteId}&period=range&date=${state.startDate},${state.endDate}&token_auth=${state.token}`;

        const eventNames = await axios.get(getName);

        // Find idsuitable for get the Actions
        const idSuitable = eventNames.data.find((event) => event.label === pageName)?.idsubdatatable;

        if (!idSuitable) return null;

        // Get Actions for the specifi page
        const getActionspage = `${state.baseUrl}/index.php?module=API&method=Events.getActionFromNameId&format=JSON&idSite=${state.siteId}&idSubtable=${idSuitable}&period=range&date=${state.startDate},${state.endDate}&token_auth=${state.token}`;
        const actionsPage = await axios.get(getActionspage);

        // filter event with eventAction
        return eventAction ? actionsPage.data.filter((event) => event.label === eventAction) : actionsPage.data;
      } catch (error) {
        console.error('Error fetching events:', error);
        return null;
      }
    },
    // async getPageViews() {},
  },
};

export function getResourcesDownloads(name) {
  return matomo.actions.getResourcesDownloads({ state: matomoState }, name);
}

export function getEventsForPageAndName(pageName, eventAction) {
  return matomo.actions.getEventsForPageAndName({ state: matomoState }, pageName, eventAction);
}

// example how to use inside the component/page

// async mounted() {
//   this.test = await getEventsForPageAndName(this.$route.fullPath, 'action1');
// },
