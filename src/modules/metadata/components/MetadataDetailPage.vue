<template>
  <v-container class="pa-0" fluid tag="article" id="MetadataDetailPage">
    <v-row no-gutters>
      <!-- prettier-ignore -->
      <v-col class="elevation-5 pa-0"
             cols="12"
             ref="header"
             style="z-index: 1; left: 0"
             :style="headerStyle" >
        <!-- prettier-ignore -->
        <MetadataHeader v-bind="header"
                          :metadataId="metadataId"
                          :pageViews="events"
                          :showPlaceholder="showPlaceholder"
                          @clickedTag="catchTagClicked"
                          @clickedBack="catchBackClicked"
                          :showEditButton="showEditButton"
                          @clickedEdit="catchEditClicked"
                          @clickedAuthor="catchAuthorClicked"
                          @checkSize="resize"
                          :expanded="headerExpanded" />
      </v-col>
    </v-row>

    <!-- prettier-ignore -->
    <two-column-layout :style="`position: relative; top: ${headerHeight()}px;`"
                       :first-column="firstColumn"
                       :second-column="secondColumn"
                       :show-placeholder="showPlaceholder" >

      <template v-slot:leftColumn>

        <v-row v-for="(entry, index) in firstColumn"
                :key="`left_${index}_${keyHash}`"
                no-gutters >
          <v-col class="mb-2 px-0">

          <!-- prettier-ignore -->
          <component :is="entry"
                     v-bind="entry.genericProps"
                     :generic-props="entry.genericProps"
                     :show-placeholder="showPlaceholder" />
          </v-col>
        </v-row>
      </template>

      <template v-slot:rightColumn>
        <v-row v-for="(entry, index) in secondColumn"
                :key="`right_${index}_${keyHash}`"
                no-gutters >
          <v-col class="mb-2 px-0">

          <!-- prettier-ignore -->
          <component :is="entry"
                     v-bind="entry.genericProps"
                     :generic-props="entry.genericProps"
                     :show-placeholder="showPlaceholder" />
          </v-col>
        </v-row>

      </template>
    </two-column-layout>
  </v-container>
</template>

<script>
/**
 * The MetadataDetailPage shows all the important information of a metadata entry.
 * It consists of all the MetadataDetailViews.
 *
 * @summary metadata detail page
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:12:30
 * Last modified  : 2021-02-11 13:31:07
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import axios from 'axios';
import rewind from '@turf/rewind';
import { mapGetters, mapState } from 'vuex';
import { useModeStore } from '@/modules/browse/store/modeStore';

import {
  BROWSE_PATH,
  METADATADETAIL_PAGENAME,
  METADATAEDIT_PAGENAME,
} from '@/router/routeConsts';

import {
  ACTION_USER_SHOW,
  FETCH_USER_DATA,
  USER_GET_DATASETS,
  USER_NAMESPACE,
  USER_SIGNIN_NAMESPACE,
} from '@/modules/user/store/userMutationsConsts';
import {
  SET_APP_BACKGROUND,
  SET_CURRENT_PAGE,
} from '@/store/mainMutationsConsts';
import {
  CLEAN_CURRENT_METADATA,
  CLEAR_SEARCH_METADATA,
  EDNA_MODE,
  LOAD_METADATA_CONTENT_BY_ID,
  METADATA_NAMESPACE,
} from '@/store/metadataMutationsConsts';

import {
  createBody,
  createFunding,
  createHeader,
  createLicense,
  createLocation,
  createPublications,
  createRelatedDatasets,
  createResources,
} from '@/factories/metaDataFactory';

import { createCitation } from '@/factories/citationFactory';

import { getFullAuthorsFromDataset } from '@/factories/authorFactory';

import {
  getConfigFiles,
  getConfigUrls,
  getFeatureCollectionFromGcNetStations,
} from '@/factories/chartFactory';

import {
  AUTHOR_SEARCH_CLICK,
  EDITMETADATA_PUBLICATION_INFO,
  eventBus,
  GCNET_INJECT_MICRO_CHARTS,
  GCNET_OPEN_DETAIL_CHARTS,
  GCNET_PREPARE_DETAIL_CHARTS,
} from '@/factories/eventBus';

import {
  enhanceElementsWithStrategyEvents,
  enhanceResourcesWithMetadataExtras,
} from '@/factories/strategyFactory';

import { getEventsForPageAndName } from '@/modules/matomo/store/matomoStore';

import TwoColumnLayout from '@/components/Layouts/TwoColumnLayout.vue';

import MetadataGeo from '@/modules/metadata/components/Geoservices/MetadataGeo.vue';
import MetadataRelatedDatasets from '@/modules/metadata/components/Metadata/MetadataRelatedDatasets.vue';
import {
  ORGANIZATIONS_NAMESPACE,
  USER_GET_ORGANIZATION_IDS,
  USER_GET_ORGANIZATIONS,
} from '@/modules/organizations/store/organizationsMutationsConsts';

import {
  convertJSON,
  getFrontendDates,
  getFrontendJSONForStep,
} from '@/factories/mappingFactory';

import MetadataHeader from './Metadata/MetadataHeader.vue';
import MetadataBody from './Metadata/MetadataBody.vue';
import MetadataResources from './Metadata/MetadataResources.vue';
import MetadataCitation from './Metadata/MetadataCitation.vue';
import MetadataPublicationList from './Metadata/MetadataPublicationList.vue';
import MetadataPublications from './Metadata/MetadataPublications.vue';
import MetadataFunding from './Metadata/MetadataFunding.vue';
import MetadataAuthors from './Metadata/MetadataAuthors.vue';

// Might want to check https://css-tricks.com/use-cases-fixed-backgrounds-css/
// for animations between the different parts of the Metadata

// blured background?
// https://paper-leaf.com/blog/2016/01/creating-blurred-background-using-only-css/

export default {
  name: 'MetadataDetailPage',
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.commit(SET_CURRENT_PAGE, METADATADETAIL_PAGENAME);
      vm.$store.commit(SET_APP_BACKGROUND, vm.PageBGImage);
    });
  },
  created() {
    this.modeStore = useModeStore();
    this.modeStore.init(this.$store.getters.cardBGImages);

    eventBus.on(GCNET_PREPARE_DETAIL_CHARTS, this.prepareGCNetChartModal);
    eventBus.on(AUTHOR_SEARCH_CLICK, this.catchAuthorCardAuthorSearch);
  },
  /**
   * @description load all the icons once before the first component's rendering.
   */
  beforeMount() {
    this.fileSizeIcon = this.mixinMethods_getIcon('fileSize');
    this.fileIcon = this.mixinMethods_getIcon('file');

    window.scrollTo(0, 0);
  },
  /**
   * @description reset the scrolling to the top.
   */
  async mounted() {
    this.loadMetaDataContent();

    // await this.setPageViews(this.$route.fullPath, 'Visit');

    window.scrollTo(0, 0);

    this.$nextTick(() => {
      this.fetchUserOrganisationData();
      this.fetchUserDatasets();
    });
  },
  /**
   * @description
   */
  beforeDestroy() {
    // clean current metadata to make be empty for the next to load up
    this.$store.commit(`${METADATA_NAMESPACE}/${CLEAN_CURRENT_METADATA}`);

    eventBus.off(GCNET_PREPARE_DETAIL_CHARTS, this.prepareGCNetChartModal);
    eventBus.off(AUTHOR_SEARCH_CLICK, this.catchAuthorCardAuthorSearch);
  },
  computed: {
    ...mapState(['config']),
    ...mapState(USER_NAMESPACE, ['userDatasets']),
    ...mapState(ORGANIZATIONS_NAMESPACE, ['userOrganizationIds']),
    ...mapGetters(USER_SIGNIN_NAMESPACE, ['user', 'userLoading']),
    ...mapGetters({
      metadatasContent: `${METADATA_NAMESPACE}/metadatasContent`,
      metadatasContentSize: `${METADATA_NAMESPACE}/metadatasContentSize`,
      loadingMetadatasContent: `${METADATA_NAMESPACE}/loadingMetadatasContent`,
      loadingCurrentMetadataContent: `${METADATA_NAMESPACE}/loadingCurrentMetadataContent`,
      currentMetadataContent: `${METADATA_NAMESPACE}/currentMetadataContent`,
      detailPageBackRoute: `${METADATA_NAMESPACE}/detailPageBackRoute`,
      authorsMap: `${METADATA_NAMESPACE}/authorsMap`,
      appScrollPosition: 'appScrollPosition',
      asciiDead: `${METADATA_NAMESPACE}/asciiDead`,
      authorPassedInfo: `${METADATA_NAMESPACE}/authorPassedInfo`,
    }),
    pageViews() {
      return this.events;
    },
    authorAlreadyExist() {
      if (this.authors) {
        return !!this.authors.find(a => a.email === this.header.contactEmail);
      }
      return false;
    },
    // This placeholder is used to display the author placeholder card in preview mode for the author who does not yet have a published dataset.
    placeHolderAuthor() {
      if (this.header) {
        const nameString = this.header?.contactName.split(' ');

        const firstName = nameString[0];
        const lastName = nameString.slice(1).join(' ');
        return {
          fullName: this.header.contactName,
          email: this.header.contactEmail,
          firstName,
          lastName,
        };
      }
      return {};
    },
    metadataContent() {
      if (this.mode) {
        // TODO: check with Dominik
        return this.modeDataset !== undefined
          ? this.modeDataset
          : this.currentMetadataContent;
      }

      return this.currentMetadataContent;
    },
    hasGcnetStationConfig() {
      return this.configInfos?.stationsConfigUrl !== null;
    },
    metadataConfig() {
      return this.config?.metadataConfig || {};
    },
    authorDetailsConfig() {
      return this.metadataConfig.authorDetailsConfig || {};
    },
    publicationsConfig() {
      return this.metadataConfig?.publicationsConfig || {};
    },
    useListResolving() {
      return this.publicationsConfig?.useListResolving || false;
    },
    resourcesConfig() {
      return this.metadataConfig?.resourcesConfig || {};
    },
    authorDeadInfo() {
      return {
        asciiDead: this.asciiDead,
        authorPassedInfo: this.authorPassedInfo,
      };
    },
    generateFileList() {
      const fileList = [];

      if (!this.currentStation || !this.fileObjects) {
        // handle empty case, just return the empty list
        return fileList;
      }

      for (let i = 0; i < this.fileObjects.length; i++) {
        const fileObj = this.fileObjects[i];

        const fileObjectTemplate = {
          fileName: `${this.baseUrl}${this.currentStation.id}${fileObj.fileName}`,
          chartTitle: fileObj.chartTitle,
          numberFormat: fileObj.numberFormat,
          dateFormatTime: fileObj.dateFormatTime,
          preload: fileObj.preload,
          showDisclaimer: fileObj.showDisclaimer,
          seriesNumberFormat: fileObj.seriesNumberFormat,
        };

        fileList.push(fileObjectTemplate);
      }

      return fileList;
    },
    baseUrl() {
      return import.meta.env.PROD
        ? this.baseStationURL
        : this.baseStationURLTestdata;
    },
    metadataId() {
      return this.$route.params.metadataid;
    },
    mode() {
      return this.$route.query.mode
        ? this.$route.query.mode.toLowerCase()
        : undefined;
    },
    showPlaceholder() {
      return this.loadingMetadatasContent || this.loadingCurrentMetadataContent;
    },
    firstColumn() {
      return this.$vuetify.breakpoint.mdAndUp ? this.firstCol : this.singleCol;
    },
    secondColumn() {
      return this.$vuetify.breakpoint.mdAndUp ? this.secondCol : [];
    },
    headerStyle() {
      let width = 82.25;
      let margin = '0px 8.33333%';

      if (this.$vuetify.breakpoint.mdAndDown) {
        width = 100;
        margin = '0';
      }

      if (this.$vuetify.breakpoint.lg) {
        width = 82.5;
      }

      let pos = 'position: ';
      if (this.$vuetify.breakpoint.mdAndUp) {
        pos += 'absolute';
      } else if (this.appScrollPosition > 20) {
        pos += 'fixed';
      } else {
        pos += 'relative';
      }
      // const pos = `position: ${this.appScrollPosition > 20 ? 'fixed' : this.$vuetify.breakpoint.smAndDown ? 'relative' : 'absolute'}`;

      return `${pos}; width: ${width}%; margin: ${margin}; `;
    },
    headerExpanded() {
      if (this.$vuetify.breakpoint.mdAndUp) {
        return true;
      }

      return this.appScrollPosition < 20;
    },
    showEditButton() {
      const userId = this.user?.id;

      if (!userId || !this.userDatasets || this.userDatasets.length <= 0) {
        return false;
      }

      const matches = this.userDatasets.filter(
        dSet => dSet.name === this.metadataId || dSet.id === this.metadataId,
      );

      return matches.length > 0;
    },
  },
  methods: {
    async setPageViews(pageName, eventName) {
      this.events = await getEventsForPageAndName(pageName, eventName);
    },
    setGeoServiceLayers(location, layerConfig) {
      try {
        location = location ? rewind(location.geoJSON) : null;
      } catch (error) {
        this.geoServiceLayersError = error;
      }

      this.geoServiceConfig = {
        site: location,
        layerConfig,
        error: this.geoServiceLayersError,
        ...(this.hasGcnetStationConfig && { isGcnet: true }),
      };

      this.geoServiceConfig = {
        ...this.geoServiceConfig,
        mapHeight: this.mapHeight,
        mapEditable: this.mapEditable,
        mapDivId: this.mapDivId,
        showFullscreenButton: this.showFullscreenButton,
      };
      const { components } = this.$options;
      this.$set(components.MetadataGeo, 'genericProps', this.geoServiceConfig);
    },
    loadGeoServiceLayers(url) {
      this.geoServiceLayers = null;
      this.geoServiceLayersError = null;

      axios
        .get(url)
        .then(response => {
          this.geoServiceLayers = response.data;
        })
        .catch(error => {
          this.geoServiceLayersError = error;
        });
    },
    loadStationsConfig(url, successCallback) {
      this.stationsConfig = null;

      axios
        .get(url)
        .then(response => {
          this.stationsConfig = response.data;

          const stations = response.data;
          const featureCollection = getFeatureCollectionFromGcNetStations(
            stations,
          );

          // Override location with stations FeatureCollection, creating shallow copy
          const locationOverride = { ...this.location };
          locationOverride.geoJSON = featureCollection;
          this.setGeoServiceLayers(locationOverride, null);

          successCallback();
        })
        .catch(error => {
          this.stationsConfigError = error;
        });
    },
    loadParameterJson(url) {
      this.fileObjects = null;
      this.graphStyling = null;

      axios
        .get(url)
        .then(response => {
          this.fileObjects = response.data.fileObjects;
          this.graphStyling = response.data.graphStyling;
        })
        .catch(error => {
          this.stationParametersError = error;
        });
    },
    getCurrentStation(stationId) {
      for (let i = 0; i < this.stationsConfig.length; i++) {
        const station = this.stationsConfig[i];
        if (station.id === stationId || station.alias === stationId) {
          return station;
        }
      }

      return null;
    },
    reRenderComponents() {
      // this.keyHash = Date.now().toString;
      this.$forceUpdate();
    },
    resize() {
      this.reRenderComponents();
    },
    headerHeight() {
      let height = -2;

      if (
        (this.$vuetify.breakpoint.smAndDown && this.appScrollPosition > 20) ||
        this.$vuetify.breakpoint.mdAndUp
      ) {
        if (this.$refs && this.$refs.header) {
          height = this.$refs.header.clientHeight;
        }
      }

      return height;
    },
    /**
     * @description
     */
    createMetadataContent() {
      const currentContent = this.metadataContent;

      // always initialize because when changing the url directly the reloading
      // would not work and the old content would be loaded
      this.header = null;
      this.body = null;
      this.citation = null;
      this.resources = null;
      this.location = null;
      this.publications = null;
      this.relatedDatasets = null;
      this.funding = null;
      this.authors = null;

      this.configInfos = {
        stationsConfigUrl: null,
        stationParametersUrl: null,
        geoUrl: null,
      };

      if (currentContent && currentContent.title !== undefined) {
        this.header = createHeader(
          currentContent,
          this.$vuetify.breakpoint.smAndDown,
          this.authorDeadInfo,
        );

        const parsedContent = convertJSON(currentContent, false);
        const publicationData = getFrontendJSONForStep(
          EDITMETADATA_PUBLICATION_INFO,
          parsedContent,
        );
        this.header.publicationYear = publicationData.publicationYear;

        this.body = createBody(
          currentContent,
          this.$vuetify.breakpoint.smAndDown,
        );

        this.citation = createCitation(currentContent);

        this.loadResources();

        this.location = createLocation(currentContent);

        this.publications = createPublications(currentContent);

        this.relatedDatasets = createRelatedDatasets(currentContent);

        this.funding = createFunding(currentContent);

        const authorMapSize = Object.keys(this.authorsMap).length || 0;

        if (authorMapSize > 0) {
          // if the authorMap is not loaded (direct loading of the this page) without
          // loading the whole app first, the author loading happens via the watch when the AuthorsMap
          this.loadAuthors(currentContent);
        }
      }
    },
    loadAuthors(currentContent) {
      const { components } = this.$options;

      this.authors = getFullAuthorsFromDataset(this.authorsMap, currentContent);

      this.$nextTick(() => {
        this.$set(components.MetadataAuthors, 'genericProps', {
          authors: this.authors,
          authorDetailsConfig: this.authorDetailsConfig,
          authorDeadInfo: this.authorDeadInfo,
          showPlaceholder: this.showPlaceholder,
          authorPlaceHolder: !this.authorAlreadyExist
            ? this.placeHolderAuthor
            : null,
        });
      });
    },
    loadResources() {
      const { components } = this.$options;
      const currentContent = this.metadataContent;

      this.resources =
        createResources(currentContent, this.user, this.userOrganizationIds) ||
        {};

      const license = createLicense(currentContent);

      this.resources.fileSizeIcon = this.fileSizeIcon;
      this.resources.fileIcon = this.fileIcon;

      if (this.resources.resources) {
        this.configInfos = getConfigFiles(this.resources.resources);

        enhanceElementsWithStrategyEvents(
          this.resources.resources,
          undefined,
          true,
        );
        enhanceResourcesWithMetadataExtras(
          this.metadataContent.extras,
          this.resources.resources,
        );

        this.resources.dates = getFrontendDates(this.metadataContent.date);
      }

      this.$nextTick(() => {
        this.$set(components.MetadataResources, 'genericProps', {
          ...this.resources,
          dataLicenseId: license.id,
          dataLicenseTitle: license.title,
          dataLicenseUrl: license.url,
          resourcesConfig: this.resourcesConfig,
        });
      });
    },
    setMetadataContent() {
      const { components } = this.$options;

      this.configInfos = getConfigUrls(this.configInfos);

      if (this.configInfos?.stationsConfigUrl) {
        this.loadStationsConfig(this.configInfos.stationsConfigUrl, () => {
          this.injectMicroCharts();
        });
      }

      if (this.configInfos?.stationParametersUrl) {
        this.loadParameterJson(this.configInfos.stationParametersUrl);
      }

      if (this.configInfos?.geoConfigUrl) {
        // the setting of the MetadataGeo genericProps is done via watch on the geoServiceLayers
        this.loadGeoServiceLayers(this.configInfos.geoConfigUrl);
      } else {
        this.setGeoServiceLayers(this.location, null);
      }

      this.$set(components.MetadataHeader, 'genericProps', this.header);
      this.$set(components.MetadataBody, 'genericProps', { body: this.body });
      this.$set(components.MetadataCitation, 'genericProps', {
        ...this.citation,
        showPlaceholder: this.showPlaceholder,
      });

      if (this.useListResolving) {
        // new component which shows the list of citationViews, maybe it's MetadataPublicationsList?
        this.$set(components.MetadataPublicationList, 'genericProps', {
          ...this.publications,
          metadataConfig: this.metadataConfig,
        });
      } else {
        this.$set(components.MetadataPublications, 'genericProps', {
          ...this.publications,
          metadataConfig: this.metadataConfig,
        });
      }

      this.$set(components.MetadataRelatedDatasets, 'genericProps', {
        ...this.relatedDatasets,
      });

      this.$set(components.MetadataFunding, 'genericProps', {
        funding: this.funding,
      });

      this.firstCol = [
        components.MetadataBody,
        components.MetadataCitation,
        this.useListResolving
          ? components.MetadataPublicationList
          : components.MetadataPublications,
        components.MetadataRelatedDatasets,
        components.MetadataFunding,
        components.MetadataAuthors,
      ];

      this.secondCol = [components.MetadataResources, components.MetadataGeo];

      this.singleCol = [
        components.MetadataBody,
        components.MetadataCitation,
        components.MetadataResources,
        components.MetadataGeo,
        components.MetadataAuthors,
        this.useListResolving
          ? components.MetadataPublicationList
          : components.MetadataPublications,
        components.MetadataPublications,
        components.MetadataRelatedDatasets,
      ];
    },
    prepareGCNetChartModal(stationId) {
      this.currentStation = this.getCurrentStation(stationId);

      eventBus.emit(GCNET_OPEN_DETAIL_CHARTS, {
        currentStation: this.currentStation,
        fileObjects: this.fileObjects,
        graphStyling: this.graphStyling,
        config: this.config,
      });
    },
    async injectMicroCharts() {
      const MicroChartList = (
        await import('@/modules/metadata/components/GC-Net/MicroChartList.vue')
      ).default;

      eventBus.emit(GCNET_INJECT_MICRO_CHARTS, {
        component: MicroChartList,
        config: this.stationsConfig,
      });
    },
    /**
     * @description
     * @param {any} idOrName
     * @returns {any}
     */
    isCurrentIdOrName(idOrName) {
      return (
        this.metadataContent?.id === idOrName ||
        this.metadataContent?.name === idOrName
      );
    },
    /**
     * @description
     * @param {any} tagName
     */
    catchTagClicked(tagName) {
      const stringTags = this.mixinMethods_convertArrayToUrlString([tagName]);

      const query = this.$route.query;
      query.tags = stringTags;

      // clear the search result here, in case this metadata entry
      // was part of a full text search
      this.$store.commit(`${METADATA_NAMESPACE}/${CLEAR_SEARCH_METADATA}`);

      this.$router.push({
        path: BROWSE_PATH,
        query,
      });
    },
    catchAuthorCardAuthorSearch(fullName) {
      const cleanFullName = fullName.replace(`(${this.asciiDead})`, '').trim();

      const query = {
        search: cleanFullName,
        isAuthorSearch: true,
      };

      this.$router.push({
        path: BROWSE_PATH,
        query,
      });
    },
    catchAuthorClicked(authorGivenName, authorLastName) {
      const query = this.$route.query;

      // make sure to remove the ascii marker for dead authors for the search
      // so the special characters won't case issues
      const given = authorGivenName.replace(`(${this.asciiDead})`, '').trim();
      const lastName = authorLastName.replace(`(${this.asciiDead})`, '').trim();

      query.search = `${given} ${lastName}`;
      query.isAuthorSearch = true;

      this.$router.push({
        path: BROWSE_PATH,
        query,
      });
    },
    catchBackClicked() {
      const backRoute = this.detailPageBackRoute;

      if (backRoute) {
        this.$router.push({
          path: backRoute.path,
          query: backRoute.query,
          params: backRoute.params,
        });
        return;
      }

      this.$router.push({
        path: BROWSE_PATH,
        query: this.$route.query,
      });
    },
    catchEditClicked() {
      this.$router.push({
        name: METADATAEDIT_PAGENAME,
        params: {
          metadataid: this.metadataId,
        },
        query: {
          backPath: this.$route.fullPath,
        },
      });
    },
    /**
     * @description loads the content of this metadata entry (metadataid) from the URL.
     * Either loads it from the backend via action or creates it from the localStorage.
     */
    async loadMetaDataContent() {
      if (this.mode) {
        if (this.mode === EDNA_MODE) {
          const modeMetadata = this.modeStore.getModeMetadata(this.mode);
          modeMetadata.isShallow = !this.isRealdataset();
        }
        const modeDatasets = this.modeStore.getDatasets(this.mode);
        let datasets = Object.values(modeDatasets);
        if (datasets.length <= 0) {
          datasets = await this.modeStore.loadModeDatasets(this.mode);
        }
        this.modeDataset = datasets.filter(
          entry => entry.name === this.metadataId,
        )[0];
      }

      if (
        !this.loadingMetadatasContent &&
        !this.isCurrentIdOrName(this.metadataId)
      ) {
        // in case of navigating into the page load the content directly via Id
        await this.$store.dispatch(
          `${METADATA_NAMESPACE}/${LOAD_METADATA_CONTENT_BY_ID}`,
          {
            metadataId: this.metadataId,
          },
        );
      } else {
        // in case of entring the page directly via Url without having loaded the rest of the app.
        // this call is to initialize the components in the their loading state
        this.$nextTick(() => {
          this.createMetadataContent();

          this.$nextTick(() => {
            this.setMetadataContent();
          });
        });
      }
    },
    isRealdataset() {
      if (this.mode && this.mode === EDNA_MODE) {
        const contents = Object.values(this.metadatasContent);

        const localEntry = contents.filter(
          entry => entry.name === this.metadataId,
        );
        return localEntry.length === 1;
      }
      return false;
    },
    async fetchUserOrganisationData() {
      const userId = this.user?.id;
      if (!userId) {
        return;
      }

      await this.$store.dispatch(
        `${ORGANIZATIONS_NAMESPACE}/${USER_GET_ORGANIZATION_IDS}`,
        userId,
      );
      // always call the USER_GET_ORGANIZATIONS action because it resolves the store & state also when userOrganizationIds is empty
      await this.$store.dispatch(
        `${ORGANIZATIONS_NAMESPACE}/${USER_GET_ORGANIZATIONS}`,
        this.userOrganizationIds,
      );
    },
    fetchUserDatasets() {
      const userId = this.user?.id;
      if (!userId) {
        return;
      }

      this.$store.dispatch(`${USER_NAMESPACE}/${FETCH_USER_DATA}`, {
        action: ACTION_USER_SHOW,
        body: {
          id: userId,
          include_datasets: true,
        },
        commit: true,
        mutation: USER_GET_DATASETS,
      });
    },
  },
  watch: {
    geoServiceLayers() {
      this.setGeoServiceLayers(this.location, this.geoServiceLayers);
    },
    geoServiceLayersError() {
      if (this.geoServiceLayersError) {
        this.setGeoServiceLayers(null, null);
      }
    },
    /**
     * @description react on changes of the route (browser back / forward click)
     */
    $route: function watchRouteChanges() {
      this.loadMetaDataContent();
    },
    /**
     * @description watch the currentMetadataContent when it is the same as the url
     * the components will be filled with the metdata contents
     */
    currentMetadataContent() {
      if (this.isCurrentIdOrName(this.metadataId)) {
        this.createMetadataContent();
        this.$nextTick(() => {
          this.setMetadataContent();
        });
      }
    },
    /**
     * in case all the metadataContents are already loaded take it from there
     * if EnviDat is called via MetadataDetailPage URL directly
     */
    async metadatasContent() {
      if (
        !this.loadingMetadatasContent &&
        !this.loadingCurrentMetadataContent &&
        !this.isCurrentIdOrName(this.metadataId)
      ) {
        await this.$store.dispatch(
          `${METADATA_NAMESPACE}/${LOAD_METADATA_CONTENT_BY_ID}`,
          {
            metadataId: this.metadataId,
          },
        );
      }
    },
    userLoading() {
      if (!this.userLoading && this.userOrganizationIds?.length <= 0) {
        this.fetchUserOrganisationData();
        this.fetchUserDatasets();
      }
    },
    authorsMap() {
      if (this.authorsMap) {
        this.loadAuthors(this.metadataContent);
      }
    },
  },
  components: {
    MetadataHeader,
    MetadataBody,
    MetadataResources,
    MetadataCitation,
    MetadataPublicationList,
    MetadataPublications,
    MetadataRelatedDatasets,
    MetadataFunding,
    TwoColumnLayout,
    MetadataAuthors,
    MetadataGeo,
  },
  data: () => ({
    events: null,
    modeStore: null,
    modeDataset: null,
    PageBGImage: 'app_b_browsepage',
    baseStationURL: 'https://www.envidat.ch/data-files/',
    baseStationURLTestdata: './testdata/',
    geoConfigUrl: '',
    fileObjects: null,
    graphStyling: null,
    stationsConfigError: null,
    stationParametersError: null,
    configInfos: null,
    geoServiceConfig: null,
    geoServiceLayers: null,
    geoServiceLayersError: null,
    header: null,
    body: null,
    citation: null,
    resources: null,
    location: null,
    publications: null,
    relatedDatasets: null,
    funding: null,
    authors: null,
    amountOfResourcesToShowDetailsLeft: 4,
    notFoundBackPath: 'browse',
    fileSizeIcon: null,
    fileIcon: null,
    eventBus,
    stationsConfig: null,
    currentStation: null,
    firstCol: [],
    secondCol: [],
    singleCol: [],
    keyHash: '',
    mapEditable: false,
    mapHeight: 450,
    mapDivId: 'metadata-map-small',
    showFullscreenButton: true,
  }),
};
</script>

<style>
.metadata_title {
  line-height: 1rem !important;
}

.metadataResourceCard {
  min-height: 100px !important;
}

.metadataResourceCard .headline {
  font-size: 20px !important;
}

.resourceCardText {
  color: rgba(255, 255, 255, 0.87) !important;
  overflow: hidden;
}

.resourceCardText a {
  color: #ffd740;
}
</style>
