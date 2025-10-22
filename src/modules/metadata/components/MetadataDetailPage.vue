<template>
  <v-container id="MetadataDetailPage" fluid class="pa-0" tag="article">
    <v-row no-gutters>
      <!-- prettier-ignore -->
      <v-col class="elevation-5 pa-0"
             cols="12"
             ref="header"
             style="z-index: 1; left: 0"
             >
        <!-- prettier-ignore -->
        <MetadataHeader v-bind="header"
                          :metadataId="metadataId"
                          :pageViews="pageViewEvents"
                          :showPlaceholder="showPlaceholder"
                          @clickedTag="catchTagClicked"
                          @clickedBack="catchBackClicked"
                          :showEditButton="showEditButton"
                          @clickedEdit="catchEditClicked"
                          @clickedAuthor="catchAuthorClicked"
                          @organizationClicked="catchOrganizationClick"
                          @checkSize="resize"
                          :expanded="true" />
      </v-col>
    </v-row>
    <!-- mobile close button: is displayed only if the scroll is more than 400. -->
    <div v-if="showCloseButton">
      <base-icon-button
        class="ma-2 closeIcon"
        :class="{ 'mx-1': $vuetify.display.smAndDown }"
        style="position: absolute; top: 60px; right: 10px; z-index: 2"
        :icon="mdiClose"
        :elevated="true"
        icon-color="white"
        color="secondary"
        outline-color="primary"
        outlined
        tooltip-text="Close metadata view"
        tooltip-bottom
      />
    </div>

    <v-row :style="`position: relative; z-index: 0;`" no-gutters>
      <v-col :class="firstColWidth" class="pt-0">
        <v-row
          v-for="(entry, index) in firstColumn"
          :key="`left_${index}_${keyHash}`"
          no-gutters
        >
          <v-col v-if="entry" class="mb-2 px-0">
            <component
              :component="entry"
              :is="entry"
              v-bind="entry.props"
              :showPlaceholder="showPlaceholder"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col v-if="secondColumn" class="pt-0" :class="secondColWidth">
        <v-row
          v-for="(entry, index) in secondColumn"
          :key="`right_${index}_${keyHash}`"
          no-gutters
        >
          <v-col v-if="entry" class="mb-2 px-0">
            <component
              :component="entry"
              :is="entry"
              v-bind="entry.props"
              :showPlaceholder="showPlaceholder"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
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

import { defineAsyncComponent, markRaw } from 'vue';

import axios from 'axios';
import { mapGetters, mapState } from 'vuex';
import { mdiClose } from '@mdi/js';
import { useModeStore } from '@/modules/browse/store/modeStore';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';

import { useOrganizationsStore } from '@/modules/organizations/store/organizationsStorePinia';

import {
  BROWSE_PATH,
  METADATAEDIT_PAGENAME,
  ORGANIZATIONS_PAGENAME,
} from '@/router/routeConsts';

import {
  ACTION_USER_SHOW,
  FETCH_USER_DATA,
  USER_GET_DATASETS,
  USER_NAMESPACE,
  USER_SIGNIN_NAMESPACE,
} from '@/modules/user/store/userMutationsConsts';
import {
  CLEAN_CURRENT_METADATA,
  CLEAR_SEARCH_METADATA,
  EDNA_MODE,
  LOAD_METADATA_CONTENT_BY_ID,
  METADATA_NAMESPACE,
} from '@/store/metadataMutationsConsts';

import {
  createFunding,
  createLicense,
  createPublications,
  createRelatedDatasets,
} from '@/factories/metaDataFactory';
import { createResources } from '@/factories/resourceHelpers';

import { createCitation } from '@/factories/citationFactory';

import {
  getFullAuthorsFromDataset,
  replaceAuthorDeadAscii,
} from '@/factories/authorFactory';

import {
  getConfigFiles,
  getConfigUrls,
  getFeatureCollectionFromGcNetStations,
} from '@/factories/chartFactory';

import {
  AUTHOR_SEARCH_CLICK,
  eventBus,
  GCNET_INJECT_MICRO_CHARTS,
  GCNET_OPEN_DETAIL_CHARTS,
  GCNET_PREPARE_DETAIL_CHARTS,
} from '@/factories/eventBus';

import {
  enhanceElementsWithStrategyEvents,
  enhanceResourcesWithMetadataExtras,
  SHOW_DATA_PREVIEW_PROPERTY,
} from '@/factories/strategyFactory';

import { getEventsForPageAndName } from '@/modules/matomo/store/matomoStore';

import { convertJSON, } from '@/factories/convertJSON';
import { getFrontendDates } from '@/factories/mappingFactory';

import { convertArrayToUrlString } from '@/factories/stringFactory';

import MetadataHeader from '@/modules/metadata/components/Metadata/MetadataHeader.vue';
import { createLocation } from '@/factories/geoFactory';

import { createHeaderViewModel } from '@/factories/ViewModels/HeaderViewModel';
import { createDescriptionViewModel } from '@/factories/ViewModels/DescriptionViewModel';
import { getResourcesForDataViz } from '@/modules/charts/middelware/chartServiceLayer.ts';

const MetadataDescription = defineAsyncComponent(
  () =>
    import('@/modules/metadata/components/Metadata/MetadataDescription.vue'),
);

const MetadataResources = defineAsyncComponent(
  () => import('./Metadata/MetadataResources.vue'),
);

const MetadataCitation = defineAsyncComponent(
  () => import('./Metadata/MetadataCitation.vue'),
);
const MetadataPublications = defineAsyncComponent(
  () => import('./Metadata/MetadataPublications.vue'),
);
const MetadataPublicationList = defineAsyncComponent(
  () => import('./Metadata/MetadataPublicationList.vue'),
);
const MetadataFunding = defineAsyncComponent(
  () => import('./Metadata/MetadataFunding.vue'),
);
const MetadataAuthors = defineAsyncComponent(
  () => import('./Metadata/MetadataAuthors.vue'),
);
const MetadataGeo = defineAsyncComponent(
  () => import('@/modules/metadata/components/Geoservices/MetadataGeo.vue'),
);
const MetadataRelatedDatasets = defineAsyncComponent(
  () =>
    import(
      '@/modules/metadata/components/Metadata/MetadataRelatedDatasets.vue'
    ),
);

const ResourceDataVizListAsync = defineAsyncComponent(
  () => import('@/modules/charts/components/ResourceDataVizList.vue'),
);

// Might want to check https://css-tricks.com/use-cases-fixed-backgrounds-css/
// for animations between the different parts of the Metadata

// blured background?
// https://paper-leaf.com/blog/2016/01/creating-blurred-background-using-only-css/

export default {
  name: 'MetadataDetailPage',
  created() {
    this.modeStore = useModeStore();
    this.modeStore.init(this.$store.getters.cardBGImages);
    this.organizationsStore = useOrganizationsStore();

    eventBus.on(GCNET_PREPARE_DETAIL_CHARTS, this.prepareGCNetChartModal);
    eventBus.on(AUTHOR_SEARCH_CLICK, this.catchAuthorCardAuthorSearch);

    this.loadMetaDataContent();
  },
  /**
   * @description load all the icons once before the first component's rendering.
   */
  beforeMount() {
    window.scrollTo(0, 0);
  },
  /**
   * @description reset the scrolling to the top.
   */
  async mounted() {
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
  beforeUnmount() {
    // clean current metadata to make be empty for the next to load up
    this.$store.commit(`${METADATA_NAMESPACE}/${CLEAN_CURRENT_METADATA}`);

    eventBus.off(GCNET_PREPARE_DETAIL_CHARTS, this.prepareGCNetChartModal);
    eventBus.off(AUTHOR_SEARCH_CLICK, this.catchAuthorCardAuthorSearch);
  },
  computed: {
    ...mapState(['config']),
    ...mapState(USER_NAMESPACE, ['userDatasets']),
    // ...mapState(ORGANIZATIONS_NAMESPACE, ['userOrganizationIds']),
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
    }),
    metadataContent() {
      if (this.mode) {
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
    showCloseButton() {
      if (this.$vuetify.display.mdAndUp) {
        return false;
      }

      return this.appScrollPosition > 40;
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
      return import.meta.env?.MODE === 'production'
        ? this.baseStationURL
        : this.baseStationURLTestdata;
    },
    /**
     * @returns {String} the metadataId from the route
     */
    metadataId() {
      return this.$route.params.metadataid;
    },
    mode() {
      return this.$route.query.mode
        ? this.$route.query.mode.toLowerCase()
        : undefined;
    },
    showPlaceholder() {
      return this.loadingCurrentMetadataContent || this.loadingMetadatasContent;
    },
    firstColumn() {
      return this.$vuetify.display.mdAndUp ? this.firstCol : this.singleCol;
    },
    secondColumn() {
      return this.$vuetify.display.mdAndUp ? this.secondCol : [];
    },
    showEditButton() {
      const userId = this.user?.id;

      if (!userId || !this.userDatasets || this.userDatasets.length <= 0) {
        return false;
      }

      const matches = this.userDatasets.filter(
        (dSet) => dSet.name === this.metadataId || dSet.id === this.metadataId,
      );

      return matches.length > 0;
    },
    firstColWidth() {
      let bindings =
        this.secondColumn && this.secondColumn.length > 0
          ? {
              'v-col-6': true,
              'pr-1': this.$vuetify.display.mdAndUp,
            }
          : {
              'v-col-12': true,
            };

      bindings = { ...bindings };

      return bindings;
    },
    secondColWidth() {
      let bindings =
        this.secondColumn && this.secondColumn.length > 0
          ? {
              'v-col-6': true,
              'pl-1': this.$vuetify.display.mdAndUp,
            }
          : {};

      bindings = { ...bindings };

      return bindings;
    },
  },
  methods: {
    async setPageViews(pageName, eventName) {
      this.pageViewEvents = await getEventsForPageAndName(pageName, eventName);
    },
    setGeoServiceLayers(location, layerConfig) {
      let geoJSON;

      try {
        geoJSON = location ? location.geoJSON : null;
      } catch (error) {
        this.geoServiceLayersError = error;
      }

      this.geoServiceConfig = {
        site: geoJSON,
        layerConfig,
        error: this.geoServiceLayersError,
        ...(this.hasGcnetStationConfig && { isGcnet: true }),
        mapHeight: this.mapHeight,
        mapEditable: this.mapEditable,
        mapDivId: this.mapDivId,
        showFullscreenButton: this.showFullscreenButton,
      };

      this.MetadataGeo.props = this.geoServiceConfig;
    },
    loadGeoServiceLayers(url) {
      this.geoServiceLayers = null;
      this.geoServiceLayersError = null;

      axios
        .get(url)
        .then((response) => {
          this.geoServiceLayers = response.data;
        })
        .catch((error) => {
          this.geoServiceLayersError = error;
        });
    },
    loadStationsConfig(url, successCallback) {
      this.stationsConfig = null;

      axios
        .get(url)
        .then((response) => {
          this.stationsConfig = response.data;

          const stations = response.data;
          const featureCollection =
            getFeatureCollectionFromGcNetStations(stations);

          // Override location with stations FeatureCollection, creating shallow copy
          const locationOverride = { ...this.location };
          locationOverride.geoJSON = featureCollection;
          this.setGeoServiceLayers(locationOverride, null);

          successCallback();
        })
        .catch((error) => {
          this.stationsConfigError = error;
        });
    },
    loadParameterJson(url) {
      this.fileObjects = null;
      this.graphStyling = null;

      axios
        .get(url)
        .then((response) => {
          this.fileObjects = response.data.fileObjects;
          this.graphStyling = response.data.graphStyling;
        })
        .catch((error) => {
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
    /**
     * @description
     */
    createMetadataContent() {
      const currentContent = this.metadataContent;

      // always initialize because when changing the url directly the reloading
      // would not work and the old content would be loaded
      this.header = null;
      this.descriptionData = null;
      this.citation = null;
      this.resourceData = null;
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
        const parsedContent = convertJSON(currentContent, false);
        const isSmallScreen = this.$vuetify.display.smAndDown;

        this.header = createHeaderViewModel(
          parsedContent,
          isSmallScreen,
          currentContent.categoryColor,
          currentContent.titleImg,
        );

        // this.descriptionData = createBody(currentContent, this.$vuetify.display.smAndDown);
        this.descriptionData = createDescriptionViewModel(
          parsedContent,
          isSmallScreen,
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
      this.authors = getFullAuthorsFromDataset(this.authorsMap, currentContent);

      this.MetadataAuthors.props = {
        authors: this.authors,
        authorDetailsConfig: this.authorDetailsConfig,
      };
    },
    loadResources() {
      const currentContent = this.metadataContent;

      this.resourceData =
        createResources(currentContent, this.user, this.userOrganizationIds) ||
        {};

      const license = createLicense(currentContent);

      if (this.resourceData.resources) {
        this.configInfos = getConfigFiles(this.resourceData.resources);

        enhanceElementsWithStrategyEvents(
          this.resourceData.resources,
          undefined,
          true,
        );
        enhanceResourcesWithMetadataExtras(
          this.metadataContent.extras,
          this.resourceData.resources,
        );

        enhanceElementsWithStrategyEvents(
          this.resourceData.resources,
          SHOW_DATA_PREVIEW_PROPERTY,
        );

        this.resourceData.dates = getFrontendDates(this.metadataContent.date);

        if (this.resourcesConfig.loadDataViz) {
          this.resourcesForDataViz = getResourcesForDataViz(
            this.resourceData.resources,
          );
        }
      }

      this.MetadataResources.props = {
        ...this.resourceData,
        dataLicenseId: license.id,
        dataLicenseTitle: license.title,
        dataLicenseUrl: license.url,
        resourcesConfig: this.resourcesConfig,
        compactList: true,
      };
    },
    setMetadataContent() {
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

      this.MetadataDescription.props = {
        ...this.descriptionData,
      };

      this.MetadataCitation.props = {
        ...this.citation,
        showCitation: this.metadataContent.showShallowCitation,
      };

      let publicationList;

      if (this.useListResolving) {
        // new component which shows the list of citationViews, maybe it's MetadataPublicationsList?
        this.MetadataPublicationList.props = {
          ...this.publications,
          metadataConfig: this.metadataConfig,
        };
        publicationList = this.MetadataPublicationList;
      } else {
        this.MetadataPublications.props = {
          ...this.publications,
          metadataConfig: this.metadataConfig,
        };
        publicationList = this.MetadataPublications;
      }

      this.MetadataRelatedDatasets.props = {
        ...this.relatedDatasets,
      };

      this.MetadataFunding.props = {
        funding: this.funding,
      };

      let resourceDataViz;

      if (this.resourcesConfig.loadDataViz) {
        resourceDataViz = ResourceDataVizListAsync;
        resourceDataViz.props = {
          resources: this.resourcesForDataViz,
        };
      }

      this.firstCol = [
        this.MetadataDescription,
        this.MetadataCitation,
        publicationList,
        this.MetadataFunding,
        this.MetadataAuthors,
      ];

      this.secondCol = [
        this.MetadataResources,
        resourceDataViz,
        this.MetadataGeo,
        this.MetadataRelatedDatasets,
      ];

      if (this.$vuetify.display.smAndDown) {
        this.singleCol = [
          this.MetadataDescription,
          this.MetadataCitation,
          this.MetadataResources,
          resourceDataViz,
          this.MetadataGeo,
          this.MetadataAuthors,
          this.MetadataFunding,
          publicationList,
          this.MetadataRelatedDatasets,
        ];
      }
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
      const GcNetMicroChartList = (
        await import(
          '@/modules/metadata/components/GC-Net/GcNetMicroChartList.vue'
        )
      ).default;

      eventBus.emit(GCNET_INJECT_MICRO_CHARTS, {
        component: GcNetMicroChartList,
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
      const stringTags = convertArrayToUrlString([tagName]);

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
      const cleanFullName = replaceAuthorDeadAscii(fullName);

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
      const given = replaceAuthorDeadAscii(authorGivenName);
      const lastName = replaceAuthorDeadAscii(authorLastName);

      query.search = `${given} ${lastName}`;
      query.isAuthorSearch = true;
      if (query.mode) {
        query.mode = undefined;
      }

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
          query: backRoute.query || {},
          params: backRoute.params || {},
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
    catchOrganizationClick(organization) {
      this.$router.push({
        name: ORGANIZATIONS_PAGENAME,
        params: {
          organization,
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
          (entry) => entry.name === this.metadataId,
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
          (entry) => entry.name === this.metadataId,
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

      await this.organizationsStore.UserGetOrgIds(userId);

      // this.organizationsStore.UserGetOrgIds(userId);
      // await this.$store.dispatch(
      //   `${ORGANIZATIONS_NAMESPACE}/${UserGetOrgIds}`,
      //   userId,
      // );
      // always call the UserGetOrg action because it resolves the store & state also when userOrganizationIds is empty
      await this.organizationsStore.UserGetOrg(this.userOrganizationIds);
      // await this.$store.dispatch(
      //   `${ORGANIZATIONS_NAMESPACE}/${UserGetOrg}`,
      //   this.userOrganizationIds,
      // );
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
    BaseIconButton,
  },
  data: () => ({
    organizationsStore: null,
    mdiClose,
    MetadataDescription: markRaw(MetadataDescription),
    MetadataResources: markRaw(MetadataResources),
    MetadataCitation: markRaw(MetadataCitation),
    MetadataPublications: markRaw(MetadataPublications),
    MetadataPublicationList: markRaw(MetadataPublicationList),
    MetadataRelatedDatasets: markRaw(MetadataRelatedDatasets),
    MetadataFunding: markRaw(MetadataFunding),
    MetadataAuthors: markRaw(MetadataAuthors),
    MetadataGeo: markRaw(MetadataGeo),
    pageViewEvents: null,
    modeStore: null,
    modeDataset: null,
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
    descriptionData: null,
    citation: null,
    resourceData: null,
    resourcesForDataViz: [],
    location: null,
    publications: null,
    relatedDatasets: null,
    funding: null,
    authors: null,
    amountOfResourcesToShowDetailsLeft: 4,
    notFoundBackPath: 'browse',
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

<style></style>
