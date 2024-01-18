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
                          :showPlaceholder="showPlaceholder"
                          @checkSize="resize"
                          :expanded="headerExpanded" />
        <!--                          @clickedTag="catchTagClicked"
                                  @clickedBack="catchBackClicked"
                                  @clickedAuthor="catchAuthorClicked"-->
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

import { BROWSE_PATH, METADATAREVIEW_PAGENAME } from '@/router/routeConsts';

import {
  USER_NAMESPACE,
  USER_SIGNIN_NAMESPACE,
} from '@/modules/user/store/userMutationsConsts';
import { SET_APP_BACKGROUND, SET_CURRENT_PAGE } from '@/store/mainMutationsConsts';
import {
  CLEAR_SEARCH_METADATA,
  METADATA_NAMESPACE,
} from '@/store/metadataMutationsConsts';
import {
  createBody,
  createCitation,
  createHeader,
  createLicense,
  createResources,
} from '@/factories/metaDataFactory';

import { getFullAuthorsFromDataset } from '@/factories/authorFactory';

import { getConfigFiles, getConfigUrls } from '@/factories/chartFactory';

import {
  AUTHOR_SEARCH_CLICK,
  EDITMETADATA_PUBLICATION_INFO,
  eventBus,
} from '@/factories/eventBus';

import { enhanceElementsWithStrategyEvents, enhanceResourcesWithMetadataExtras } from '@/factories/strategyFactory';

import TwoColumnLayout from '@/components/Layouts/TwoColumnLayout.vue';

import { convertJSON, getFrontendDates, getFrontendJSONForStep } from '@/factories/mappingFactory';

import { useReviewStore } from '@/modules/metadata/store/reviewStore';
import MetadataHeader from './Metadata/MetadataHeader.vue';
import MetadataBody from './Metadata/MetadataBody.vue';
import MetadataResources from './Metadata/MetadataResources.vue';
import MetadataCitation from './Metadata/MetadataCitation.vue';
import MetadataAuthors from './Metadata/MetadataAuthors.vue';

// Might want to check https://css-tricks.com/use-cases-fixed-backgrounds-css/
// for animations between the different parts of the Metadata

// blured background?
// https://paper-leaf.com/blog/2016/01/creating-blurred-background-using-only-css/

export default {
  name: 'MetadataReviewPage',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit(SET_CURRENT_PAGE, METADATAREVIEW_PAGENAME);
      vm.$store.commit(SET_APP_BACKGROUND, vm.PageBGImage);
    });
  },
  created() {
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
  mounted() {
    this.loadMetaDataContent();

    window.scrollTo(0, 0);
  },
  /**
   * @description
   */
/*
  beforeDestroy() {
    // clean current metadata to make be empty for the next to load up
    this.$store.commit(`${METADATA_NAMESPACE}/${CLEAN_CURRENT_METADATA}`);

    eventBus.off(AUTHOR_SEARCH_CLICK, this.catchAuthorCardAuthorSearch);
  },
*/
  computed: {
    ...mapState(['config']),
    ...mapState(USER_NAMESPACE, [
      'userDatasets',
    ]),
    ...mapGetters(USER_SIGNIN_NAMESPACE, [
      'user',
      'userLoading',
    ]),
    ...mapGetters({
      detailPageBackRoute: `${METADATA_NAMESPACE}/detailPageBackRoute`,
      authorsMap: `${METADATA_NAMESPACE}/authorsMap`,
      appScrollPosition: 'appScrollPosition',
      asciiDead: `${METADATA_NAMESPACE}/asciiDead`,
      authorPassedInfo: `${METADATA_NAMESPACE}/authorPassedInfo`,
    }),
    metadataContent() {
      return {
        ...this.reviewStore.metadata,
        resources: this.reviewStore.resources,
      };
    },
    metadataConfig() {
      return this.config?.metadataConfig || {};
    },
    authorDetailsConfig() {
      return this.metadataConfig.authorDetailsConfig || {};
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
    metadataId() {
      return this.$route.params.metadataid;
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

      const matches = this.userDatasets.filter(dSet => dSet.name === this.metadataId || dSet.id === this.metadataId);

      return matches.length > 0;
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
    headerHeight() {
      let height = -2;

      if ((this.$vuetify.breakpoint.smAndDown && this.appScrollPosition > 20)
        || this.$vuetify.breakpoint.mdAndUp ) {
        if (this.$refs && this.$refs.header) {
          height = this.$refs.header.clientHeight;
        }
      }

      return height;
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
      this.citation = null;
      this.resources = null;
      this.authors = null;

      this.configInfos = {};

      if (currentContent && currentContent.title !== undefined) {
        const subDataset = currentContent;
        delete subDataset.author;
        delete subDataset.maintainer;
        delete subDataset.organization;

        this.header = createHeader(
          subDataset,
          this.$vuetify.breakpoint.smAndDown,
          this.authorDeadInfo,
        );

        const parsedContent = convertJSON(currentContent, false);
        const publicationData = getFrontendJSONForStep(EDITMETADATA_PUBLICATION_INFO, parsedContent);
        this.header.publicationYear = publicationData.publicationYear;

        this.body = createBody(
          currentContent,
          this.$vuetify.breakpoint.smAndDown,
        );

/*
        this.citation = createCitation(currentContent);
*/

        this.loadResources(currentContent);

        // authors are going to be loaded via the watch when the AuthorsMap is available
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
        });
      });

    },
    loadResources(currentContent) {
      const { components } = this.$options;

      this.resources = createResources(currentContent, this.user) || {};

      const license = createLicense(currentContent);

      this.resources.fileSizeIcon = this.fileSizeIcon;
      this.resources.fileIcon = this.fileIcon;

      if (this.resources.resources) {
        this.configInfos = getConfigFiles(this.resources.resources);

        enhanceElementsWithStrategyEvents(this.resources.resources, undefined, true);
        enhanceResourcesWithMetadataExtras(this.metadataContent.extras, this.resources.resources);

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

      this.$set(components.MetadataHeader, 'genericProps', this.header);
      this.$set(components.MetadataBody, 'genericProps', { body: this.body });
      this.$set(components.MetadataCitation, 'genericProps', {
        ...this.citation,
        showPlaceholder: this.showPlaceholder,
      });

      this.firstCol = [
        components.MetadataBody,
/*
        components.MetadataCitation,
        components.MetadataAuthors,
*/
      ];

      this.secondCol = [
        components.MetadataResources,
      ];

      this.singleCol = [
        components.MetadataBody,
/*
        components.MetadataCitation,
*/
        components.MetadataResources,
/*
        components.MetadataAuthors,
*/
      ];
    },
    /**
     * @description
     * @param {any} idOrName
     * @returns {any}
     */
    isCurrentIdOrName(idOrName) {
      return this.metadataContent?.id === idOrName || this.metadataContent?.name === idOrName;
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
      });
    },
    /**
     * @description loads the content of this metadata entry (metadataid) from the URL.
     * Either loads it from the backend via action or creates it from the localStorage.
     */
    async loadMetaDataContent() {
      await this.reviewStore.loadReviewMetadata(this.metadataId);
      await this.reviewStore.loadReviewResources(this.metadataId)

      console.log(this.metadataContent);

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
      this.loadMetaDataContent();
    },
    /**
     * @description watch the currentMetadataContent when it is the same as the url
     * the components will be filled with the metdata contents
     */
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
    TwoColumnLayout,
    MetadataAuthors,
  },
  data: () => ({
    reviewStore: useReviewStore(),
    PageBGImage: 'app_b_browsepage',
    baseStationURL: 'https://www.envidat.ch/data-files/',
    baseStationURLTestdata: './testdata/',
    header: null,
    body: null,
    citation: null,
    resources: null,
    authors: null,
    amountOfResourcesToShowDetailsLeft: 4,
    notFoundBackPath: 'browse',
    fileSizeIcon: null,
    fileIcon: null,
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
