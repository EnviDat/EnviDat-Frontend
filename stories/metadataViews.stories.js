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

import MetadataBody from '@/modules/metadata/components/Metadata/MetadataBody.vue';
import MetadataCitation from '@/modules/metadata/components/Metadata/MetadataCitation.vue';
import MetadataDetails from '@/modules/metadata/components/Metadata/MetadataDetails.vue';
import MetadataGeo from '@/modules/metadata/components/Geoservices/MetadataGeo.vue';
import MetadataPublications from '@/modules/metadata/components/Metadata/MetadataPublications.vue';
import MetadataPublicationList from '@/modules/metadata/components/Metadata/MetadataPublicationList.vue';
import MetadataFunding from '@/modules/metadata/components/Metadata/MetadataFunding.vue';
import MetadataAuthors from '@/modules/metadata/components/Metadata/MetadataAuthors.vue';

import {
  createDetails,
  createPublications,
  createBody,
  enhanceMetadatasTitleImage,
} from '@/factories/metaDataFactory';

import { createCitation } from '@/factories/citationFactory';

import {
  extractAuthorsMap,
  getFullAuthorsFromDataset,
} from '@/factories/authorFactory';

// const iconFiles = getIcons();

// metadata gets enhance in the storybook config
import metadata from './js/metadata';
import gcnetDataset from './js/gcnetDataset';
import citationTesting from './js/citationTesting';
import MetadataRelatedDatasets from '@/modules/metadata/components/Metadata/MetadataRelatedDatasets.vue';

import envidat_packages from './testdata/packagelist.json';
import { getFrontendJSONForStep } from '@/factories/mappingFactory';
import {
  EDITMETADATA_MAIN_HEADER,
  EDITMETADATA_PUBLICATION_INFO,
} from '@/factories/eventBus';
import { createLocation } from '@/factories/geoFactory';

export default {
  title: '3 Dataset / 1 Views',
  decorators: [],
  parameters: {},
};

enhanceMetadatasTitleImage(metadata);

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
const funding1 = [
  {
    grant_number: '',
    institution: 'Funding not available',
    institution_url: '',
  },
];
// const funding2 = createFunding(metadata[1]);
const funding2 = [
  {
    grant_number: 'XYZ',
    institution: 'WSL',
    institution_url: 'https://www.wsl.ch',
  },
  {
    grant_number: 'XZZ',
    institution: 'EAWAG',
    institution_url: 'https://www.eawag.ch',
  },
  { grant_number: '', institution: 'Aquascope', institution_url: '' },
  {
    grant_number: 'XYZ-ZYX',
    institution: 'EAWAG',
    institution_url: 'https://www.eawag.ch',
  },
  { grant_number: '', institution: 'Someone', institution_url: '' },
  {
    grant_number: '',
    institution: 'Someone you do not know with a long name',
    institution_url: '',
  },
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


export const MetadataBodyViews = () => ({
  components: { MetadataBody },
  template: `
  <v-row>

    <v-col cols="6" class="py-3">
      <metadata-body  />
    </v-col>

    <v-col cols="6" class="py-3">
      <metadata-body v-bind="genericPropsPlaceholder" />
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
      <metadata-citation  />
    </v-col>

    <v-col cols="6" class="py-3">
      <metadata-citation v-bind="genericPropsPlaceholder"  />
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
    this.$children.forEach(child => {
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
    this.$children.forEach(child => {
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
      ...genericProps4,
      showPlaceholder: true,
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
  updated() {},
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
      text:
        'https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:14249 \n https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:21248 \n https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:32593 \n https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:32246 \n https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:32611 ',
    },
    publications5: {
      text:
        '* https://www.dora.lib4ri.ch/wsl/islandora/object/wsl%3A22390\r\n* https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:29664 \r\n* https://www.dora.lib4ri.ch/wsl/islandora/object/wsl%3A30382',
    },
    publications6: {
      text:
        '* wsl:21835 wsl%3A22390 \n * https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:29664 ',
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
export const MetadataRelatedPublicationsListViews = () => ({
  components: { MetadataPublicationList },
  template: `
  <v-row >


    <v-col cols="4" class="py-3">
      <h6 class="text-h6">Plain Text</h6>
      <metadata-publication-list v-bind="genericPropsPublications" />
    </v-col>

    <v-col cols="4" class="py-3">
    <h6 class="text-h6">Loader</h6>
      <metadata-publication-list v-bind="genericPropsPlaceholder" />
    </v-col>


    <v-col cols="6" class="py-3">
    <h6 class="text-h6">Multiple publications with even text without PID or DOI</h6>
    <metadata-publication-list v-bind="publications4"
    :allDatasets="allDatasets" />
    </v-col>

    <v-col cols="6" class="py-3">
    <h6 class="text-h6">Multiple publications</h6>
    <metadata-publication-list v-bind="publications3"
    :allDatasets="allDatasets" />
    </v-col>

    <v-col cols="6" class="py-3">
    <h6 class="text-h6">Multiple Publications preview</h6>
    <metadata-publication-list :isPreview="true" v-bind="publications3"
    :allDatasets="allDatasets" />
    </v-col>


    <v-col cols="6" class="py-3">
    <h6 class="text-h6">Single Publication</h6>
    <metadata-publication-list v-bind="publication2"
    :allDatasets="allDatasets" />
    </v-col>


  </v-row>
  `,
  updated() {},
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
    publication2: {
      text: 'null\n- 10.1016/j.scitotenv.2023.162167"',
    },
    publications3: {
      text:
        'Gessler A., Zweifel R. (2024) Beyond source and sink control – toward an integrated approach to understand the carbon balance in plants. New Phytol. 242(3), 858-869. https://doi.org/10.1111/nph.19611 \nEtzold S., Eugster W., Braun S., Thimonier A., Waldner P., Zweifel R. (2021) Stickstoffdeposition - ab wann ist es zu viel für das Baumwachstum? Wald Holz. 102(11), 15-18.\n Shekhar A., Hörtnagl L., Paul-Limoges E., Etzold S., Zweifel R., Buchmann N., Gharun M. (2024) Contrasting impact of extreme soil and atmospheric dryness on the functioning of trees and forests. Sci. Total Environ. 916, 169931 (14 pp.). https://doi.org/10.1016/j.scitotenv.2024.169931\n Zweifel R., Pappas C., Peters R.L., Babst F., Balanzategui D., Basler D., … Sterck F. (2023) Networking the forest infrastructure towards near real-time monitoring - a white paper. Sci. Total Environ. 872, 162167 (11 pp.). https://doi.org/10.1016/j.scitotenv.2023.162167\n Etzold S., Sterck F., Bose A.K., Braun S., Buchmann N., Eugster W., … Zweifel R. (2022) Number of growth days and not length of the growth period determines radial stem growth of temperate trees. Ecol. Lett. 25(2), 427-439. https://doi.org/10.1111/ele.13933\nLuković M., Zweifel R., Thiry G., Zhang C., Schubert M. (2022) Reconstructing radial stem size changes of trees with machine learning. J. R. Soc. Interface. 19(194), 20220349 (13 pp.). https://doi.org/10.1098/rsif.2022.0349\nSalomón R.L., Peters R.L., Zweifel R., Sass-Klaassen U.G.W., Stegehuis A.I., Smiljanic M., … Steppe K. (2022) The 2018 European heatwave led to stem dehydration but not to consistent growth reductions in forests. Nat. Commun. 13(1), 28 (11 pp.). https://doi.org/10.1038/s41467-021-27579-9\nEtzold S., Eugster W., Braun S., Thimonier A., Waldner P., Zweifel R. (2021) Stickstoffdeposition - ab wann ist es zu viel für das Baumwachstum? Wald Holz. 102(11), 15-18.\nZweifel R., Etzold S., Basler D., Bischoff R., Braun S., Buchmann N., … Eugster W. (2021) TreeNet - the biological drought and growth indicator network. Front. For. Glob. Change. 4, 776905 (14 pp.). https://doi.org/10.3389/ffgc.2021.776905\nGharun M., Hörtnagl L., Paul-Limoges E., Ghiasi S., Feigenwinter I., Burri S., … Buchmann N. (2020) Physiological response of Swiss ecosystems to 2018 drought across plant types and elevation. Philos. Trans. R. Soc. B. 375(1810), 20190521 (10 pp.). https://doi.org/10.1098/rstb.2019.0521\n',
    },
    publications4: {
      text:
        'Lechler, L.., Rixen, C., Bebi, P., Bavay, M., Marty, M., Barbeito, I., Dawes, M.A., Hagedorn, F., Krumm, F., Möhl, P., Schaub, M. & Frei, E.R. 2023. Fifty years of data enhance the mechanistic understanding of ecological processes in treeline ecotones under global change. In preparation.\nBavay, M., Reisecker, M., Egger, T. & Korhammer, D. 2022. Inishell 2.0: semantically driven automatic GUI generation for scientific models. Geoscientific Model Development 15(2): 365-378. https://doi.org/10.5194/gmd-15-365-2022\nBavay, M. & Egger, T. 2014. MeteoIO 2.4.2: a preprocessing library for meteorological data. Geoscientific Model Development 7(6): 3135-3151. https://doi.org/10.5194/gmd-7-3135-2014\nSchönenberger, W. & Frey, W. 1988. Untersuchungen zur Ökologie und Technik der Hochlagenaufforstung. Forschungsergebnisse aus dem Lawinenanrissgebiet Stillberg. Schweizerische Zeitschrift für Forstwesen 139(9):735-820. https://doi.org/10.5169/seals-766744\nSchönenberger, W. 1975. Standortseinflüsse auf Versuchsaufforstungen an der alpinen Waldgrenze (Stillberg, Davos), Eidg. Anst. forstl. Versuchswes. Mitt. 51(4): 358-428. Schönenberger W. (1975) Standortseinflüsse auf Versuchsaufforstungen an der alpinen Waldgrenze. (Stillberg, Davos). Gebirgsprogramm: 13. Beitrag. Mitteilungen / Eidgenössische Anstalt für das Forstliche Versuchswesen: Vol. 51/4. Birmensdorf: Eidgenössische Anstalt für das Forstliche Versuchswesen. 358-428 p.',
    },
    publications5: {
      text:
        '* https://www.dora.lib4ri.ch/wsl/islandora/object/wsl%3A22390\r\n* https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:29664 \r\n* https://www.dora.lib4ri.ch/wsl/islandora/object/wsl%3A30382',
    },
    publications6: {
      text:
        '* wsl:21835 wsl%3A22390 \n * https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:29664 ',
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
      <metadata-funding />
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
  updated() {},
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
      <metadata-authors v-bind="genericPropsPlaceholder"  />
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
    }, 3000);
  },
  computed: {
    genericProps6() {
      if (this.initialLoading) {
        return {
          showPlaceholder: true,
        };
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
