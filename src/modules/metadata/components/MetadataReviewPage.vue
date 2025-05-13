<template>
  <v-container
    id="MetadataReviewPage"
    fluid
    class="pa-0"
    tag="article">

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
                          :showPlaceholder="showPlaceholder"
                          @checkSize="resize"
                          @clickedBack="catchBackClicked"
                          :expanded="headerExpanded" />
<!--                          @clickedTag="catchTagClicked"
-->
      </v-col>
    </v-row>

    <v-row v-if="datasetNotFound"
           class="pt-4" style="z-index: 0;"
           no-gutters
    >
      <v-col cols="12">
        <v-alert type="info" >{{ labels.instructions }}</v-alert>
      </v-col>
    </v-row>

    <v-row v-if="!datasetNotFound"
      :style="`position: relative; z-index: 0;`"
      no-gutters
    >
      <v-col :class="firstColWidth" class="pt-0">
        <v-row
          v-for="(entry, index) in firstColumn"
          :key="`left_${index}_${keyHash}`"
          no-gutters
        >
          <v-col class="mb-2 px-0">
            <component :component="entry" :is="entry" v-bind="entry.props" />
          </v-col>
        </v-row>
      </v-col>

      <v-col v-if="secondColumn" class="pt-0" :class="secondColWidth">
        <v-row
          v-for="(entry, index) in secondColumn"
          :key="`right_${index}_${keyHash}`"
          no-gutters
        >
          <v-col class="mb-2 px-0">
            <!-- prettier-ignore -->
            <component :is="entry"
                       v-bind="entry.props" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/**
 * The MetadataReviewPage show a subset of the MetadataDetailPage
 * It's intended to show minimal metadata and resources.
 *
 * @summary metadata detail page
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { mapGetters, mapState } from 'vuex';

import { defineAsyncComponent, markRaw } from 'vue';
import { BROWSE_PATH } from '@/router/routeConsts';

import { USER_SIGNIN_NAMESPACE } from '@/modules/user/store/userMutationsConsts';

import {
  CLEAR_SEARCH_METADATA,
  METADATA_NAMESPACE,
} from '@/store/metadataMutationsConsts';

import { createLicense, createResources } from '@/factories/metaDataFactory';

import { getConfigFiles, getConfigUrls } from '@/factories/chartFactory';

import {
  EDITMETADATA_PUBLICATION_INFO,
  METADATA_MAIN_HEADER,
  eventBus,
} from '@/factories/eventBus';

import {
  enhanceElementsWithStrategyEvents,
  enhanceResourcesWithMetadataExtras,
  SHOW_DATA_PREVIEW_PROPERTY,
} from '@/factories/strategyFactory';

import {
  convertJSON,
  getFrontendDates,
  getFrontendJSONForStep,
} from '@/factories/mappingFactory';

import { useReviewStore } from '@/modules/metadata/store/reviewStore';
import { convertArrayToUrlString } from '@/factories/stringFactory';

import { formatDate } from '@/factories/dateFactory';
import { createDescriptionViewModel } from '@/factories/ViewModels/DescriptionViewModel';

import MetadataHeader from './Metadata/MetadataHeader.vue';

const MetadataDescription = defineAsyncComponent(
  () => import('./Metadata/MetadataDescription.vue'),
);
const MetadataResources = defineAsyncComponent(
  () => import('./Metadata/MetadataResources.vue'),
);
const MetadataCitation = defineAsyncComponent(
  () => import('./Metadata/MetadataCitation.vue'),
);
const MetadataAuthors = defineAsyncComponent(
  () => import('./Metadata/MetadataAuthors.vue'),
);

// Might want to check https://css-tricks.com/use-cases-fixed-backgrounds-css/
// for animations between the different parts of the Metadata

// blured background?
// https://paper-leaf.com/blog/2016/01/creating-blurred-background-using-only-css/

export default {
  name: 'MetadataReviewPage',
  /**
   * @description load all the icons once before the first component's rendering.
   */
  beforeMount() {
    window.scrollTo(0, 0);
  },
  /**
   * @description reset the scrolling to the top.
   */
  mounted() {
    this.loadReviewMetadataContent();

    window.scrollTo(0, 0);
  },
  /**
   * @description
   */
  beforeUnmount() {
    // clean current metadata to make be empty for the next to load up
    this.reviewStore.resetReview();
  },
  computed: {
    ...mapState(['config']),
    ...mapGetters(USER_SIGNIN_NAMESPACE, ['user']),
    ...mapGetters({
      detailPageBackRoute: `${METADATA_NAMESPACE}/detailPageBackRoute`,
      appScrollPosition: 'appScrollPosition',
    }),
    metadataContent() {
      return this.reviewStore.metadata;
    },
    metadataConfig() {
      return this.config?.metadataConfig || {};
    },
    resourcesConfig() {
      return this.metadataConfig?.resourcesConfig || {};
    },
    metadataId() {
      return this.$route.params.metadataid;
    },
    datasetNotFound() {
      return !!this.reviewStore.metadataNotFound;
    },
    showPlaceholder() {
      return this.reviewStore.loadingMetadata;
    },
    firstColumn() {
      return this.$vuetify.display.mdAndUp ? this.firstCol : this.singleCol;
    },
    secondColumn() {
      return this.$vuetify.display.mdAndUp ? this.secondCol : [];
    },
    headerExpanded() {
      if (this.$vuetify.display.mdAndUp) {
        return true;
      }

      return this.appScrollPosition < 20;
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
    createMetadataContent(metadataContent) {
      const currentContent = metadataContent;

      // always initialize because when changing the url directly the reloading
      // would not work and the old content would be loaded
      this.header = null;
      this.body = null;
      this.resources = null;

      this.configInfos = {};

      if (currentContent && currentContent.title !== undefined) {
        // const subDataset = currentContent;
        const parsedContent = convertJSON(currentContent, false);

        this.header = getFrontendJSONForStep(
          METADATA_MAIN_HEADER,
          parsedContent,
        );
        // this.header.metadataState = getMetadataVisibilityState(this.header);
        // this.header.contactName = getAuthorName(this.header);
        this.header.created = formatDate(this.header.created);
        this.header.modified = formatDate(this.header.modified);

        const publicationData = getFrontendJSONForStep(
          EDITMETADATA_PUBLICATION_INFO,
          parsedContent,
        );
        this.header.publicationYear = publicationData.publicationYear;

        // this.body = createBody(currentContent, this.$vuetify.display.smAndDown);
        this.body = createDescriptionViewModel(
          parsedContent,
          this.$vuetify.display.smAndDown,
        );

        this.loadResources(currentContent);
      }
    },
    loadResources(currentContent) {
      this.resources = createResources(currentContent, this.user) || {};

      const license = createLicense(currentContent);

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

        enhanceElementsWithStrategyEvents(
          this.resources.resources,
          SHOW_DATA_PREVIEW_PROPERTY,
        );

        this.resources.dates = getFrontendDates(this.metadataContent.date);
      }

      this.MetadataResources.props = {
        ...this.resources,
        dataLicenseId: license.id,
        dataLicenseTitle: license.title,
        dataLicenseUrl: license.url,
        resourcesConfig: this.resourcesConfig,
      };
    },
    setMetadataContent() {
      this.configInfos = getConfigUrls(this.configInfos);
      this.MetadataDescription.props = { ...this.body };

      this.MetadataCitation.props = {
        ...this.citation,
        showPlaceholder: this.showPlaceholder,
      };

      this.firstCol = [
        this.MetadataDescription,
      ];

      this.secondCol = [this.MetadataResources];

      this.singleCol = [
        this.MetadataDescription,
        this.MetadataResources,
      ];
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
      });
    },
    /**
     * @description loads the content of this metadata entry (metadataid) from the URL.
     * Either loads it from the backend via action or creates it from the localStorage.
     */
    async loadReviewMetadataContent() {
      await this.reviewStore.loadReviewMetadata(this.metadataId);

      this.$nextTick(() => {
        this.createMetadataContent(this.metadataContent);

        this.$nextTick(() => {
          this.setMetadataContent();
        });
      });
    },
  },
  watch: {
    /**
     * @description react on changes of the route (browser back / forward click)
     */
    $route: function watchRouteChanges() {
      this.loadReviewMetadataContent();
    },
    /**
     * @description watch the currentMetadataContent when it is the same as the url
     * the components will be filled with the metdata contents
     */
  },
  components: {
    MetadataHeader,
  },
  data: () => ({
    MetadataDescription: markRaw(MetadataDescription),
    MetadataResources: markRaw(MetadataResources),
    MetadataCitation: markRaw(MetadataCitation),
    MetadataAuthors: markRaw(MetadataAuthors),
    reviewStore: useReviewStore(),
    baseStationURL: 'https://www.envidat.ch/data-files/',
    baseStationURLTestdata: './testdata/',
    header: null,
    body: null,
    citation: null,
    resources: null,
    authors: null,
    amountOfResourcesToShowDetailsLeft: 4,
    notFoundBackPath: 'browse',
    modalTitle: '',
    fullScreenComponent: null,
    fullScreenConfig: null,
    eventBus,
    stationsConfig: null,
    currentStation: null,
    firstCol: [],
    secondCol: [],
    singleCol: [],
    keyHash: '',
    labels: {
      instructions: 'This content will only load if Blind-review is activated. Blind-review needs to be activated from the edit page of the dataset.',
    },
  }),
};
</script>

<style>

</style>
