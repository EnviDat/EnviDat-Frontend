<template>
  <v-container class="pa-0"
                fluid
                tag="article" >
    <v-row >
      <v-col class="elevation-5 pa-0"
              cols="12"
              ref="header"
              style="z-index: 1; left: 0; " 
              :style="headerStyle" >

        <metadata-header v-bind="header"
                          :metadataId="metadataId"
                          :showPlaceholder="showPlaceholder"
                          :doiIcon="doiIcon"
                          :contactIcon="contactIcon"
                          :mailIcon="mailIcon"
                          :licenseIcon="licenseIcon"
                          @clickedTag="catchTagClicked"
                          @clickedBack="catchBackClicked"
                          @clickedAuthor="catchAuthorClicked"
                          @checkSize="resize"
                          :expanded="headerExpanded" />
      </v-col>
    </v-row>

    <two-column-layout :style="`position: relative; top: ${headerHeight()}px;`"
                        :first-column="firstColumn"
                        :second-column="secondColumn"
                        :show-placeholder="showPlaceholder" >

      <template v-slot:leftColumn>

        <v-row v-for="(entry, index) in firstColumn"
                :key="`left_${index}_${keyHash}`"
                no-gutters >
          <v-col class="mb-2 px-0">

          <component :is="entry"
                      :generic-props="entry.genericProps"
                      :show-placeholder="showPlaceholder"
                      :authorDeadInfo="authorDeadInfo" />
          </v-col>
        </v-row>
      </template>

      <template v-slot:rightColumn>
        <v-row v-for="(entry, index) in secondColumn"
                :key="`right_${index}_${keyHash}`"
                no-gutters >
          <v-col class="mb-2 px-0">

          <component :is="entry"
                      :generic-props="entry.genericProps"
                      :show-placeholder="showPlaceholder"
                      :authorDeadInfo="authorDeadInfo" />
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
 * Last modified  : 2019-11-28 16:03:23
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { mapGetters } from 'vuex';
import {
  BROWSE_PATH,
  METADATADETAIL_PAGENAME,
} from '@/router/routeConsts';
import {
  SET_APP_BACKGROUND,
  SET_CURRENT_PAGE,
} from '@/store/mainMutationsConsts';
import {
  METADATA_NAMESPACE,
  LOAD_METADATA_CONTENT_BY_ID,
  CLEAN_CURRENT_METADATA,
  CLEAR_SEARCH_METADATA,
} from '@/store/metadataMutationsConsts';
import {
  createHeader,
  createBody,
  createCitation,
  createLocation,
  createResources,
  createDetails,
  createFunding,
  createPublications,
} from '@/factories/metaDataFactory';
import {
  getFullAuthorsFromDataset,
} from '@/factories/authorFactory';
import TwoColumnLayout from '@/components/Layouts/TwoColumnLayout';

import MetadataHeader from './Metadata/MetadataHeader';
import MetadataBody from './Metadata/MetadataBody';
import MetadataResources from './Metadata/MetadataResources';
import MetadataLocation from './Metadata/MetadataLocation';
import MetadataDetails from './Metadata/MetadataDetails';
import MetadataCitation from './Metadata/MetadataCitation';
import MetadataPublications from './Metadata/MetadataPublications';
import MetadataFunding from './Metadata/MetadataFunding';
import MetadataAuthors from './Metadata/MetadataAuthors';
import MetadataGeo from './Geoservices/MetadataGeo';


// Might want to check https://css-tricks.com/use-cases-fixed-backgrounds-css/
// for animations between the different parts of the Metadata

// blured background?
// https://paper-leaf.com/blog/2016/01/creating-blurred-background-using-only-css/

export default {
  name: 'MetadataDetailPage',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit(SET_CURRENT_PAGE, METADATADETAIL_PAGENAME);
      vm.$store.commit(SET_APP_BACKGROUND, vm.PageBGImage);
    });
  },
  /**
     * @description load all the icons once before the first component's rendering.
     */
  beforeMount() {
    this.doiIcon = this.mixinMethods_getIcon('doi');
    this.fileSizeIcon = this.mixinMethods_getIcon('fileSize');
    this.dateCreatedIcon = this.mixinMethods_getIcon('dateCreated');
    this.lastModifiedIcon = this.mixinMethods_getIcon('dateModified');
    this.contactIcon = this.mixinMethods_getIcon('contact2');
    this.mailIcon = this.mixinMethods_getIcon('mail');
    this.licenseIcon = this.mixinMethods_getIcon('license');
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
  beforeDestroy() {
    // clean current metadata to make be empty for the next to load up
    this.$store.commit(`${METADATA_NAMESPACE}/${CLEAN_CURRENT_METADATA}`);
  },
  computed: {
    ...mapGetters({
      metadatasContent: `${METADATA_NAMESPACE}/metadatasContent`,
      metadatasContentSize: `${METADATA_NAMESPACE}/metadatasContentSize`,
      loadingMetadatasContent: `${METADATA_NAMESPACE}/loadingMetadatasContent`,
      loadingCurrentMetadataContent: `${METADATA_NAMESPACE}/loadingCurrentMetadataContent`,
      currentMetadataContent: `${METADATA_NAMESPACE}/currentMetadataContent`,
      detailPageBackRoute: `${METADATA_NAMESPACE}/detailPageBackRoute`,
      idRemapping: `${METADATA_NAMESPACE}/idRemapping`,
      authorsMap: `${METADATA_NAMESPACE}/authorsMap`,
      iconImages: 'iconImages',
      cardBGImages: 'cardBGImages',
      appScrollPosition: 'appScrollPosition',
      asciiDead: `${METADATA_NAMESPACE}/asciiDead`,
      authorPassedInfo: `${METADATA_NAMESPACE}/authorPassedInfo`,
    }),
    authorDeadInfo() {
      return {
        asciiDead: this.asciiDead,
        authorPassedInfo: this.authorPassedInfo,
      };
    },
    /**
     * @returns {String} the metadataId from the route
     */
    metadataId() {
      let id = this.$route.params.metadataid;

      if (this.idRemapping.has(id)) {
        id = this.idRemapping.get(id);
      }

      return id;
    },
    /**
     * @returns {Boolean} if the placeHolders should be shown be somethings are still loading
     */
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
        width = 83.25;
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

      if ((this.$vuetify.breakpoint.smAndDown
        && this.appScrollPosition > 20) || this.$vuetify.breakpoint.mdAndUp) {

        if (!this.showPlaceholder && this.$refs && this.$refs.header) {
          height = this.$refs.header.clientHeight;
        }
      }

      return height;
    },
    /**
     * @description
     */
    createMetadataContent() {
      const currentContent = this.currentMetadataContent;
      const { components } = this.$options;

      // always initialize because when changing the url directly the reloading
      // would not work and the old content would be loaded
      this.header = null;
      this.body = null;
      this.citation = null;
      this.resources = null;
      this.location = null;
      this.details = null;
      this.publications = null;
      this.funding = null;
      this.authors = null;

      if (currentContent && currentContent.title !== undefined) {

        this.header = createHeader(currentContent, this.$vuetify.breakpoint.smAndDown, this.authorDeadInfo);

        this.body = createBody(currentContent, this.$vuetify.breakpoint.smAndDown);

        this.citation = createCitation(currentContent);

        this.resources = createResources(currentContent);
        this.resources.doiIcon = this.doiIcon;
        this.resources.fileSizeIcon = this.fileSizeIcon;
        this.resources.dateCreatedIcon = this.dateCreatedIcon;
        this.resources.lastModifiedIcon = this.lastModifiedIcon;

        this.location = createLocation(currentContent);

        this.details = createDetails(currentContent);

        this.publications = createPublications(currentContent);
        this.funding = createFunding(currentContent);

        this.authors = getFullAuthorsFromDataset(this.authorsMap, currentContent);
      }
      const res = this.currentMetadataContent && this.currentMetadataContent.resources ? this.currentMetadataContent.resources : null;
      const geoConfig = res ? res.find(src => src.name === 'geoservices_config.json') : null;

      this.$set(components.MetadataHeader, 'genericProps', this.header);
      this.$set(components.MetadataBody, 'genericProps', { body: this.body });
      this.$set(components.MetadataCitation, 'genericProps', this.citation);
      this.$set(components.MetadataResources, 'genericProps', this.resources);
      if (geoConfig) {
        this.$set(components.MetadataGeo, 'genericProps', { ...this.location, config: geoConfig });
      } else {
        this.$set(components.MetadataLocation, 'genericProps', this.location);
      }
      this.$set(components.MetadataDetails, 'genericProps', { details: this.details });
      this.$set(components.MetadataAuthors, 'genericProps', { authors: this.authors });

      this.$set(components.MetadataPublications, 'genericProps', { publications: this.publications });
      this.$set(components.MetadataFunding, 'genericProps', { funding: this.funding });

      this.firstCol = [
        components.MetadataBody,
        components.MetadataCitation,
        components.MetadataPublications,
        components.MetadataFunding,
        components.MetadataAuthors,
      ];

      this.secondCol = [
        components.MetadataResources,
        geoConfig ? components.MetadataGeo : components.MetadataLocation,
        components.MetadataDetails,
      ];

      this.singleCol = [
        components.MetadataBody,
        components.MetadataCitation,
        components.MetadataPublications,
        components.MetadataResources,
        components.MetadataFunding,
        geoConfig ? components.MetadataGeo : components.MetadataLocation,
        components.MetadataAuthors,
        components.MetadataDetails,
      ];

      this.reRenderComponents();
    },
    /**
       * @description
       * @param {any} idOrName
       * @returns {any}
       */
    isCurrentIdOrName(idOrName) {
      return this.currentMetadataContent.id === idOrName || this.currentMetadataContent.name === idOrName;
    },
    /**
       * @description
       * @param {any} tagName
       */
    catchTagClicked(tagName) {
      const tagNames = [];
      tagNames.push(tagName);

      const tagsEncoded = this.mixinMethods_encodeTagForUrl(tagNames);
      const query = {};
      query.tags = tagsEncoded;

      // clear the search result here, in case this metadata entry
      // was part of a full text search
      this.$store.commit(`${METADATA_NAMESPACE}/${CLEAR_SEARCH_METADATA}`);

      this.$router.push({
        path: BROWSE_PATH,
        query,
      });
    },
    /**
       * @description
       * @param {any} authorName
       */
    catchAuthorClicked(authorName) {
      const query = {};
      query.search = authorName;

      this.$router.push({
        path: BROWSE_PATH,
        query,
      });
    },
    /**
       * @description
       */
    catchBackClicked() {
      // console.log(this.$router);
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
    loadMetaDataContent() {
      if (!this.loadingMetadatasContent
        && (this.currentMetadataContent.title === undefined
            || !this.isCurrentIdOrName(this.metadataId))) {
        // in case of directly entring the page load the content directly via Id
        this.$store.dispatch(`metadata/${LOAD_METADATA_CONTENT_BY_ID}`, this.metadataId);
      } else {
        this.createMetadataContent();
      }
    },
  },
  watch: {
    /* eslint-disable no-unused-vars */
    /**
       * @description
       * @param {any} to
       * @param {any} from
       */
    $route: function watchRouteChanges(to, from) {
      // react on changes of the route (browser back / forward click)

      this.loadMetaDataContent();
    },
    /**
       * @description
       */
    currentMetadataContent() {
      this.createMetadataContent();
    },
    /**
       * @description
       */
    metadatasContent() {
      // in case all the metadataContents are already loaded take it from there
      // if EnviDat is called via MetadataDetailPage URL directly

      if (!this.loadingCurrentMetadataContent) {
        this.$store.dispatch(`metadata/${LOAD_METADATA_CONTENT_BY_ID}`, this.metadataId);
      }
    },
  },
  components: {
    MetadataHeader,
    MetadataBody,
    MetadataResources,
    MetadataLocation,
    MetadataDetails,
    MetadataCitation,
    MetadataPublications,
    MetadataFunding,
    TwoColumnLayout,
    MetadataAuthors,
    MetadataGeo,
  },
  data: () => ({
    PageBGImage: './app_b_browsepage.jpg',
    header: null,
    body: null,
    citation: null,
    resources: null,
    location: null,
    details: null,
    publications: null,
    funding: null,
    authors: null,
    amountOfResourcesToShowDetailsLeft: 4,
    notFoundBackPath: 'browse',
    doiIcon: null,
    fileSizeIcon: null,
    dateCreatedIcon: null,
    lastModifiedIcon: null,
    contactIcon: null,
    mailIcon: null,
    licenseIcon: null,
    firstCol: [],
    secondCol: [],
    singleCol: [],
    keyHash: '',
  }),
};
</script>

<style>

  .metadata_title {
    font-family: 'Libre Baskerville', serif !important;
    font-weight: 700 !important;
  }

  .metadataResourceCard {
    min-height: 100px !important;
  }

  .metadataResourceCard .headline {
    font-size: 20px !important;
  }

  .resourceCardText {
    font-size: 12px;
    overflow: hidden;
  }

</style>
