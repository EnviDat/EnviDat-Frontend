// noinspection JSUnusedGlobalSymbols
/* eslint-disable */
/* eslint-disable import/no-extraneous-dependencies */

/**
 * @summary story of all the MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-10-29 20:26:06
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import MetadataHeader from '@/modules/metadata/components/Metadata/MetadataHeader.vue';

import MetadataBody from '@/modules/metadata/components/Metadata/MetadataBody.vue';
import MetadataCitation from '@/modules/metadata/components/Metadata/MetadataCitation.vue';
import MetadataDetails from '@/modules/metadata/components/Metadata/MetadataDetails.vue';
import MetadataGeo from '@/modules/metadata/components/Geoservices/MetadataGeo.vue';
import MetadataPublications from '@/modules/metadata/components/Metadata/MetadataPublications.vue';
import MetadataFunding from '@/modules/metadata/components/Metadata/MetadataFunding.vue';
import MetadataAuthors from '@/modules/metadata/components/Metadata/MetadataAuthors.vue';

import {
  createHeader,
  createCitation,
  createDetails,
  createPublications,
  createBody,
  createLocation,
} from '@/factories/metaDataFactory';

import { extractAuthorsMap, getFullAuthorsFromDataset } from '@/factories/authorFactory';

// const iconFiles = getIcons();

// metadata gets enhance in the storybook config
import metadata from './js/metadata';
import gcnetDataset from "./js/gcnetDataset";
import citationTesting from "./js/citationTesting";
import MetadataRelatedDatasets from '@/modules/metadata/components/Metadata/MetadataRelatedDatasets.vue';

import envidat_packages from './testdata/packagelist.json';

const smallHeader = createHeader(metadata[0], true);
const largeHeader = createHeader(metadata[2], false);

const citation1 = createCitation(metadata[0]);
const citation2 = createCitation(metadata[2]);
const citation3 = createCitation(gcnetDataset);
const citation4 = createCitation(citationTesting);

const genericProps1 = {
  showPlaceholder: false,
  id: citation1.id,
  citationText: citation1.citationText,
  citationXmlLink: citation1.citationBibtexXmlLink,
  citationIsoXmlLink: citation1.citationIsoXmlLink,
  citationGCMDXmlLink: citation1.citationGCMDXmlLink,
  citationBibtexXmlLink: citation1.citationBibtexXmlLink,
  citationRisXmlLink: citation1.citationRisXmlLink,
};

const genericProps2 = {
  showPlaceholder: false,
  id: citation2.id,
  citationText: citation2.citationText,
  citationXmlLink: citation2.citationBibtexXmlLink,
  citationIsoXmlLink: citation2.citationIsoXmlLink,
  citationGCMDXmlLink: citation2.citationGCMDXmlLink,
  citationBibtexXmlLink: citation2.citationBibtexXmlLink,
  citationRisXmlLink: citation2.citationRisXmlLink,
};

const citationGenericProps3 = {
  showPlaceholder: false,
  id: citation3.id,
  citationText: citation3.citationText,
  citationXmlLink: citation3.citationBibtexXmlLink,
  citationIsoXmlLink: citation3.citationIsoXmlLink,
  citationGCMDXmlLink: citation3.citationGCMDXmlLink,
  citationBibtexXmlLink: citation3.citationBibtexXmlLink,
  citationRisXmlLink: citation3.citationRisXmlLink,
};

const citationGenericProps4 = {
  showPlaceholder: false,
  id: citation4.id,
  citationText: citation4.citationText,
  citationXmlLink: citation4.citationBibtexXmlLink,
  citationIsoXmlLink: citation4.citationIsoXmlLink,
  citationGCMDXmlLink: citation4.citationGCMDXmlLink,
  citationBibtexXmlLink: citation4.citationBibtexXmlLink,
  citationRisXmlLink: citation4.citationRisXmlLink,
};

const details1 = createDetails(metadata[0]);
metadata[0].related_publications = 'blabla bla';
const publications1 = createPublications(metadata[0]);
// const details2 = createDetails(metadata[1]);

const publications2 = createPublications(metadata[1]);

// const funding1 = createFunding(metadata[0]);
const funding1 = [{ grant_number: '', institution: 'Funding not available', institution_url: '' }];
// const funding2 = createFunding(metadata[1]);
const funding2 = [
  { grant_number: 'XYZ', institution: 'WSL', institution_url: 'https://www.wsl.ch' },
  { grant_number: 'XZZ', institution: 'EAWAG', institution_url: 'https://www.eawag.ch' },
  { grant_number: '', institution: 'Aquascope', institution_url: '' },
  { grant_number: 'XYZ-ZYX', institution: 'EAWAG', institution_url: 'https://www.eawag.ch' },
  { grant_number: '', institution: 'Someone', institution_url: '' },
  { grant_number: '', institution: 'Someone you do not know with a long name', institution_url: '' },
];

const body1 = createBody(metadata[0]);
const body2 = createBody(metadata[1]);
const authorDeadInfo = {
  asciiDead: '&#8224;',
  authorPassedInfo: 'Sadly this author has passed away.',
};

const genericProps3 = {
  showPlaceholder: false,
  details: details1,
  authorDeadInfo,
};

const location1 = createLocation(metadata[2]);

const genericProps4 = {
  showPlaceholder: false,
  site: location1.geomCollection,
  mapHeight: 450,
};

const authorsMap = extractAuthorsMap(metadata);
const fullAuthors = getFullAuthorsFromDataset(authorsMap, metadata[1]);


const genericProps5 = {
  showPlaceholder: false,
  authors: fullAuthors,
  authorDetailsConfig: {
    showAuthorInfos: true,
    showDataCredits: true,
    showDataCreditScore: false,
    showDatasetCount: false,
  },
};


export default {
  title: '6 Dataset Detail Views / Metadata Detail Page View',
  decorators: [],
  parameters: {},
};

export const MetadataHeaderViews = () => ({
  components: { MetadataHeader },
  template: `
  <v-col>
    <v-row>
      Empty Metadata Header
    </v-row>

    <v-row class="py-2" >
      <v-col >
        <metadata-header metadataId="id-which-can-not-be-found" />
      </v-col>
    </v-row>

    <v-row class="py-2" >
      <v-col >
        Metadata Header with showPlaceholder
      </v-col>
    </v-row>

    <v-row class="py-2" >
      <v-col >
        <metadata-header :showPlaceholder="true" />
      </v-col>
    </v-row>

    <v-row class="py-2" >
      <v-col >
        Short Title Metadata Header
      </v-col>
    </v-row>

    <v-row class="py-2">
      <v-col >
        <metadata-header
          v-bind="smallHeader"
        />
      </v-col>
    </v-row>

    <v-row class="py-2" >
      <v-col >
        Long Title Metadata Header
      </v-col>
    </v-row>

    <v-row class="py-3">
      <v-col >
        <metadata-header
          v-bind="largeHeader"
          show-edit-button
        />
      </v-col>
    </v-row>

    <v-row class="py-2" >
      <v-col >
        Long Title Metadata Header without icons for fallback labels
      </v-col>
    </v-row>

    <v-row class="py-3">
      <v-col >
        <metadata-header
          v-bind="largeHeader"
        />
      </v-col>
    </v-row>
  </v-col>
  `,
  data: () => ({
    smallHeader,
    largeHeader,
  }),
});

export const MetadataBodyViews = () => ({
  components: { MetadataBody },
  template: `
  <v-row>

    <v-col cols="6" class="py-3">
      <metadata-body v-bind="genericPropsPlaceholder" />
    </v-col>

    <v-col cols="6" class="py-3">
      <metadata-body v-bind="genericPropsPlaceholder"
                      :showPlaceholder="genericPropsPlaceholder.showPlaceholder" />
    </v-col>

    <v-col cols="4" class="py-3">
      <metadata-body v-bind="genericPropsBody" />
    </v-col>

    <v-col cols="8" class="py-3">
      <metadata-body v-bind="genericPropsBodyLongDesc" />
    </v-col>

  </v-row>
  `,
  data: () => ({
    genericPropsPlaceholder: {
      showPlaceholder: true,
      title: 'Description',
    },
    genericPropsBody: {
      showPlaceholder: false,
      ...body1,
    },
    genericPropsBodyLongDesc: {
      showPlaceholder: false,
      ...body2,
    },
  }),
});

export const MetadataCitationViews = () => ({
  components: { MetadataCitation },
  template: `
  <v-row >

    <v-col cols="6" class="py-3">
      <metadata-citation v-bind="genericPropsPlaceholder" />
    </v-col>

    <v-col cols="6" class="py-3">
      <metadata-citation v-bind="genericPropsPlaceholder"
                          :showPlaceholder="genericPropsPlaceholder.showPlaceholder" />
    </v-col>

    <v-col cols="4" class="py-3">
      <metadata-citation v-bind="genericProps1" />
    </v-col>

    <v-col cols="8" class="py-3">
      <metadata-citation v-bind="genericProps2" />
    </v-col>

    <v-col cols="6" class="py-3">
      <metadata-citation v-bind="citationGenericProps3" />
    </v-col>

    <v-col cols="6" class="py-3">
      <metadata-citation v-bind="citationGenericProps4" />
    </v-col>

  </v-row>
  `,
  updated() {
    this.$children.forEach((child) => {
      child.$forceUpdate();
    });
  },
  data: () => ({
    genericProps1,
    genericProps2,
    genericPropsPlaceholder: {
      showPlaceholder: true,
      fixedHeight: false,
    },
    citationGenericProps3,
    citationGenericProps4,
  }),
});

export const MetadataDetailsViews = () => ({
  components: { MetadataDetails },
  template: `
  <v-row >

    <v-col cols="6" class="py-3">
      <metadata-details />
    </v-col>

    <v-col cols="6" class="py-3">
      <metadata-details v-bind="genericPropsPlaceholder"
                        :showPlaceholder="genericPropsPlaceholder.showPlaceholder"
                        :authorDeadInfo="genericPropsPlaceholder.authorDeadInfo"
      />
    </v-col>

    <v-col cols="6" class="py-3">
      <metadata-details v-bind="genericProps3" />
    </v-col>

  </v-row>
  `,
  updated() {
    this.$children.forEach((child) => {
      child.$forceUpdate();
    });
  },
  data: () => ({
    genericProps3,
    genericProps2,
    genericPropsPlaceholder: {
      details: [],
      showPlaceholder: true,
      fixedHeight: false,
      authorDeadInfo,
    },
  }),
});

export const MetadataLocationViews = () => ({
  components: { MetadataGeo },
  template: `
  <v-row >

    <v-col cols="6" class="py-3">
      <MetadataGeo v-bind="genericProps4" />
    </v-col>

    <v-col cols="6" class="py-3">
      <MetadataGeo v-bind="genericPropsPlaceholder"
                    :showPlaceholder="genericPropsPlaceholder.showPlaceholder" />
    </v-col>

  </v-row>
  `,
  data: () => ({
    genericProps4,
    genericPropsPlaceholder: {
      details: [],
      showPlaceholder: true,
      fixedHeight: false,
    },
  }),
});

export const MetadataRelatedPublicationsViews = () => ({
  components: { MetadataPublications },
  template: `
  <v-row >

    <v-col cols="6" class="py-3">
      <metadata-publications v-bind="genericPropsEmpty"
                              :showPlaceholder="genericPropsEmpty.showPlaceholder"/>
    </v-col>

    <v-col cols="6" class="py-3">
      <metadata-publications v-bind="genericPropsPlaceholder"
                              :showPlaceholder="genericPropsPlaceholder.showPlaceholder" />
    </v-col>

    <v-col cols="4" class="py-3">
      <metadata-publications v-bind="genericPropsPublications" />
    </v-col>

    <v-col cols="8" class="py-3">
      <metadata-publications v-bind="genericPropsPublications" />
    </v-col>

    <v-col cols="6" class="py-3">
      <metadata-publications v-bind="publications3"
                             :allDatasets="allDatasets" />
    </v-col>

    <v-col cols="6" class="py-3">
      <metadata-publications v-bind="publications4"
                             :allDatasets="allDatasets"
                             :maxTextLength="maxTextLength"
      />
    </v-col>

    <v-col cols="6" class="py-3">
      <metadata-publications v-bind="publications5"
                             :allDatasets="allDatasets"
                             :maxTextLength="maxTextLength"
      />
    </v-col>

    <v-col cols="6" class="py-3">
      <metadata-publications text="* wsl:21835 \n * wsl%3A22390"
                             :allDatasets="allDatasets"
                             :maxTextLength="maxTextLength"
      />
    </v-col>

    <v-col cols="6" class="py-3">
      <metadata-publications v-bind="publications6"
                             :allDatasets="allDatasets"
                             :maxTextLength="maxTextLength"
      />
    </v-col>
  
  </v-row>
  `,
  updated() {
  },
  data: () => ({
    maxTextLength: 1200,
    genericProp: {
      ...publications1,
      showPlaceholder: false,
    },
    genericPropsPlaceholder: {
      text: null,
      showPlaceholder: true,
    },
    genericPropsEmpty: {
      ...publications2,
      showPlaceholder: false,
    },
    publications3: {
      text: 'https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:14249\n',
    },
    publications4: {
      text: 'https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:14249 \n https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:21248 \n https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:32593 \n https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:32246 \n https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:32611 ',
    },
    publications5: {
      text: '* https://www.dora.lib4ri.ch/wsl/islandora/object/wsl%3A22390\r\n* https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:29664 \r\n* https://www.dora.lib4ri.ch/wsl/islandora/object/wsl%3A30382',
    },
    publications6: {
      text: '* wsl:21835 wsl%3A22390 \n * https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:29664 ',
    },
    allDatasets: envidat_packages.result,
    genericPropsPublications: {
      showPlaceholder: false,
      title: 'Related Publications',
      text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Cursus turpis massa tincidunt dui ut. Proin sagittis nisl rhoncus mattis rhoncus urna neque viverra. Quis enim lobortis scelerisque fermentum dui. Neque egestas congue quisque egestas. Malesuada proin libero nunc consequat interdum varius sit amet mattis. Volutpat blandit aliquam etiam erat. Tempor id eu nisl nunc. Lacus suspendisse faucibus interdum posuere lorem ipsum dolor sit amet. Ultricies mi eget mauris pharetra et ultrices. Eu consequat ac felis donec et odio pellentesque diam volutpat. Fames ac turpis egestas integer. Faucibus interdum posuere lorem ipsum dolor sit amet. Cursus euismod quis viverra nibh cras. Condimentum id venenatis a condimentum vitae sapien pellentesque habitant morbi. At elementum eu facilisis sed odio morbi quis. Ut sem viverra aliquet eget sit amet tellus.
      Proin nibh nisl condimentum id venenatis. Parturient montes nascetur ridiculus mus mauris vitae ultricies leo integer. Id eu nisl nunc mi ipsum faucibus vitae aliquet nec. Eu mi bibendum neque egestas congue quisque egestas diam. Eu volutpat odio facilisis mauris sit amet massa vitae tortor. Porttitor lacus luctus accumsan tortor posuere ac ut consequat. Sed velit dignissim sodales ut. Est pellentesque elit ullamcorper dignissim cras tincidunt lobortis. Sodales ut eu sem integer vitae. Ipsum nunc aliquet bibendum enim facilisis gravida neque convallis a. Augue lacus viverra vitae congue. Eget sit amet tellus cras adipiscing enim eu turpis. Pharetra vel turpis nunc eget lorem. Cras sed felis eget velit aliquet sagittis.
      Sagittis nisl rhoncus mattis rhoncus urna. Vehicula ipsum a arcu cursus vitae. Sed elementum tempus egestas sed. Nec nam aliquam sem et tortor. Enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra. Massa eget egestas purus viverra accumsan in. Integer eget aliquet nibh praesent. Ut placerat orci nulla pellentesque dignissim enim sit amet. Amet venenatis urna cursus eget. Nunc pulvinar sapien et ligula. Vel pharetra vel turpis nunc eget lorem dolor. Felis donec et odio pellentesque diam. Porttitor rhoncus dolor purus non enim.
      Facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum. A diam maecenas sed enim ut sem viverra. Ac felis donec et odio pellentesque diam volutpat commodo. Risus commodo viverra maecenas accumsan lacus vel facilisis. Vitae aliquet nec ullamcorper sit amet. Ullamcorper malesuada proin libero nunc consequat. Arcu vitae elementum curabitur vitae nunc sed velit dignissim sodales. Et tortor consequat id porta nibh venenatis. Lectus mauris ultrices eros in cursus. Tellus integer feugiat scelerisque varius morbi enim nunc faucibus a. Justo donec enim diam vulputate ut pharetra sit. Sit amet luctus venenatis lectus magna fringilla. Vulputate ut pharetra sit amet aliquam id diam maecenas ultricies. Orci dapibus ultrices in iaculis nunc sed augue lacus.
      `,
    },
  }),
});

export const MetadataRelatedDatasetsViews = () => ({
  components: { MetadataRelatedDatasets },
  template: `
  <v-row >

    <v-col cols="6" class="py-3">
      <MetadataRelatedDatasets  />
    </v-col>

    <v-col cols="6" class="py-3">
      <MetadataRelatedDatasets :showPlaceholder="true" />
    </v-col>

    <v-col cols="4" class="py-3">
      <MetadataRelatedDatasets v-bind="genericProps" />
    </v-col>

    <v-col cols="8" class="py-3">
      <MetadataRelatedDatasets :text="text2"
                                :allDatasets="allDatasets"/>
    </v-col>

    <v-col cols="8" class="py-3">
      <MetadataRelatedDatasets :text="text3" />
    </v-col>
  
  </v-row>
  `,
  computed: {
    genericProps() {
      return {
        text: this.text,
        showPlaceholder: false,
      };
    },
  },
  data: () => ({
    text3: 'https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:14249',
    text2: `https://www.envidat.ch/#/metadata/chelsa_trace
            https://www.envidat.ch/#/metadata/chelsacruts
            https://www.envidat.ch/#/metadata/chelsa_trace
            https://www.envidat.ch/#/metadata/eur11
            https://www.envidat.ch/#/metadata/chelsa_cmip5_ts
    `,
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Cursus turpis massa tincidunt dui ut. Proin sagittis nisl rhoncus mattis rhoncus urna neque viverra. Quis enim lobortis scelerisque fermentum dui. Neque egestas congue quisque egestas. Malesuada proin libero nunc consequat interdum varius sit amet mattis. Volutpat blandit aliquam etiam erat. Tempor id eu nisl nunc. Lacus suspendisse faucibus interdum posuere lorem ipsum dolor sit amet. Ultricies mi eget mauris pharetra et ultrices. Eu consequat ac felis donec et odio pellentesque diam volutpat. Fames ac turpis egestas integer. Faucibus interdum posuere lorem ipsum dolor sit amet. Cursus euismod quis viverra nibh cras. Condimentum id venenatis a condimentum vitae sapien pellentesque habitant morbi. At elementum eu facilisis sed odio morbi quis. Ut sem viverra aliquet eget sit amet tellus.
    Proin nibh nisl condimentum id venenatis. Parturient montes nascetur ridiculus mus mauris vitae ultricies leo integer. Id eu nisl nunc mi ipsum faucibus vitae aliquet nec. Eu mi bibendum neque egestas congue quisque egestas diam. Eu volutpat odio facilisis mauris sit amet massa vitae tortor. Porttitor lacus luctus accumsan tortor posuere ac ut consequat. Sed velit dignissim sodales ut. Est pellentesque elit ullamcorper dignissim cras tincidunt lobortis. Sodales ut eu sem integer vitae. Ipsum nunc aliquet bibendum enim facilisis gravida neque convallis a. Augue lacus viverra vitae congue. Eget sit amet tellus cras adipiscing enim eu turpis. Pharetra vel turpis nunc eget lorem. Cras sed felis eget velit aliquet sagittis.
    Sagittis nisl rhoncus mattis rhoncus urna. Vehicula ipsum a arcu cursus vitae. Sed elementum tempus egestas sed. Nec nam aliquam sem et tortor. Enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra. Massa eget egestas purus viverra accumsan in. Integer eget aliquet nibh praesent. Ut placerat orci nulla pellentesque dignissim enim sit amet. Amet venenatis urna cursus eget. Nunc pulvinar sapien et ligula. Vel pharetra vel turpis nunc eget lorem dolor. Felis donec et odio pellentesque diam. Porttitor rhoncus dolor purus non enim.
    Facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum. A diam maecenas sed enim ut sem viverra. Ac felis donec et odio pellentesque diam volutpat commodo. Risus commodo viverra maecenas accumsan lacus vel facilisis. Vitae aliquet nec ullamcorper sit amet. Ullamcorper malesuada proin libero nunc consequat. Arcu vitae elementum curabitur vitae nunc sed velit dignissim sodales. Et tortor consequat id porta nibh venenatis. Lectus mauris ultrices eros in cursus. Tellus integer feugiat scelerisque varius morbi enim nunc faucibus a. Justo donec enim diam vulputate ut pharetra sit. Sit amet luctus venenatis lectus magna fringilla. Vulputate ut pharetra sit amet aliquam id diam maecenas ultricies. Orci dapibus ultrices in iaculis nunc sed augue lacus.
    `,
    allDatasets: envidat_packages.result,
  }),
});

export const MetadataFundingViews = () => ({
  components: { MetadataFunding },
  template: `
  <v-row >

    <v-col cols="6" class="py-3">
      <metadata-funding v-bind="genericProp" />
    </v-col>

    <v-col cols="6" class="py-3">
      <metadata-funding v-bind="genericPropsPlaceholder"
                        :showPlaceholder="genericPropsPlaceholder.showPlaceholder" />
    </v-col>

    <v-col cols="4" class="py-3">
      <metadata-funding v-bind="genericProps2"
                          :showPlaceholder="genericProps2.showPlaceholder"/>
    </v-col>

    <v-col cols="8" class="py-3">
      <metadata-funding v-bind="genericProps2"
                        :showPlaceholder="genericProps2.showPlaceholder"/>
    </v-col>

  </v-row>
  `,
  updated() {
  },
  data: () => ({
    genericProp: {
      funding: funding1,
      showPlaceholder: false,
    },
    genericPropsPlaceholder: {
      funding: null,
      showPlaceholder: true,
    },
    genericProps2: {
      funding: funding2,
      showPlaceholder: false,
    },
  }),
});

export const MetadataAuthorsViews = () => ({
  components: { MetadataAuthors },
  template: `
  <v-row>

    <v-col cols="12" md="6" class="py-3">
      <metadata-authors  />
    </v-col>

    <v-col cols="12" md="6" class="py-3">
      <metadata-authors v-bind="genericPropsPlaceholder"
                        :showPlaceholder="genericPropsPlaceholder.showPlaceholder" />
    </v-col>

    <v-col cols="12" md="6" class="py-3">
      <metadata-authors v-bind="genericProps6" />
    </v-col>

    <v-col cols="12" class="py-3">
      <metadata-authors v-bind="genericProps5" />
    </v-col>
  
  </v-row>
  `,
  mounted() {
    setTimeout(() => {
      this.initialLoading = false;
    }, 3000)
  },
  computed: {
    genericProps6() {
      if (this.initialLoading) {
        return {
          showPlaceholder: true,
        }
      }

      return {
        ...this.genericProps5,
      };
    },
  },
  data: () => ({
    initialLoading: true,
    genericProps5,
    genericPropsPlaceholder: {
      authors: [],
      showPlaceholder: true,
    },
  }),
});
