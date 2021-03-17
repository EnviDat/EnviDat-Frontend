/* eslint-disable object-property-newline */
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

/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import MetadataHeader from '@/modules/metadata/components/Metadata/MetadataHeader.vue';
import MetadataBody from '@/modules/metadata/components/Metadata/MetadataBody.vue';
import MetadataCitation from '@/modules/metadata/components/Metadata/MetadataCitation.vue';
import MetadataDetails from '@/modules/metadata/components/Metadata/MetadataDetails.vue';
import MetadataLocation from '@/modules/metadata/components/Metadata/MetadataLocation.vue';
import MetadataPublications from '@/modules/metadata/components/Metadata/MetadataPublications.vue';
import MetadataFunding from '@/modules/metadata/components/Metadata/MetadataFunding.vue';
import MetadataAuthors from '@/modules/metadata/components/Metadata/MetadataAuthors.vue';

import doiIcon from '@/assets/icons/doi.png';
import mailIcon from '@/assets/icons/mail.png';
import contactIcon from '@/assets/icons/contact2.png';
import licenseIcon from '@/assets/icons/license.png';

import {
  createHeader,
  createCitation,
  createDetails,
  createPublications,
  createBody,
  createLocation,
} from '@/factories/metaDataFactory';
import { createAuthors } from '@/factories/authorFactory';

// metadata gets enhance in the storybook config
import metadata from './js/metadata';

const smallHeader = createHeader(metadata[0], true);
const largeHeader = createHeader(metadata[1], false);

const citation1 = createCitation(metadata[0]);
const citation2 = createCitation(metadata[2]);

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
  id: location1.id,
  name: location1.name,
  title: location1.title,
  pointArray: location1.pointArray,
  isPolygon: location1.isPolygon,
  isPoint: location1.isPoint,
  isMultiPoint: location1.isMultiPoint,
  geoJSON: location1.geoJSON,
};

const authors = createAuthors(metadata[2]);

const genericProps5 = {
  showPlaceholder: false,
  authors,
};

export const methods = {
  onCardClick: action('clicked on card'),
  onTagClick: action('clicked on tag'),
};

storiesOf('6 Detail Views / Metadata', module)
  .add('Metadata Header', () => ({
    components: { MetadataHeader },
    template: `
    <v-col>
      <v-row>
        Empty Metadata Header
      </v-row>

      <v-row class="py-3" >
      <v-col >
        <metadata-header metadataId="id-which-can-not-be-found" />
      </v-col>
      </v-row>

      <v-row class="py-3" >
      <v-col >
        Metadata Header with showPlaceholder
      </v-col>
      </v-row>

      <v-row class="py-3" >
      <v-col >
        <metadata-header :showPlaceholder="true" />
      </v-col>
      </v-row>

      <v-row class="py-3">
      <v-col >
        <metadata-header
          v-bind="smallHeader"
          :doiIcon="doiIcon"
          :contactIcon="contactIcon"
          :mailIcon="mailIcon"
          :licenseIcon="licenseIcon"
        />
      </v-col>
      </v-row>        

      <v-row class="py-3">
      <v-col >
        <metadata-header
          v-bind="largeHeader"
          :doiIcon="doiIcon"
          :contactIcon="contactIcon"
          :mailIcon="mailIcon"
          :licenseIcon="licenseIcon"
        />
      </v-col>
      </v-row>        

    </v-col>
    `,
    methods,
    data: () => ({
      smallHeader,
      largeHeader,
      doiIcon,
      contactIcon,
      licenseIcon,
      mailIcon,
    }),
  })).add('Metadata Body', () => ({
    components: { MetadataBody },
    template: `
    <v-row>

      <v-col cols="6" class="py-3">
        <metadata-body :genericProps="genericPropsPlaceholder" />
      </v-col>

      <v-col cols="6" class="py-3">
        <metadata-body :genericProps="genericPropsPlaceholder"
                        :showPlaceholder="genericPropsPlaceholder.showPlaceholder" />
      </v-col>

      <v-col cols="4" class="py-3">
        <metadata-body :genericProps="genericPropsBody" />
      </v-col>

      <v-col cols="8" class="py-3">
        <metadata-body :genericProps="genericPropsBodyLongDesc" />
      </v-col>

    </v-row>        
    `,
    methods,
    data: () => ({
      genericPropsPlaceholder: {
        showPlaceholder: true,
        body: {
          title: 'Description',
        },
      },
      genericPropsBody: {
        showPlaceholder: false,
        body: body1,
      },
      genericPropsBodyLongDesc: {
        showPlaceholder: false,
        body: body2,
      },
    }),
  })).add('Metadata Citation', () => ({
    components: { MetadataCitation },
    template: `
    <v-row >

      <v-col cols="6" class="py-3">
        <metadata-citation :genericProps="genericPropsPlaceholder" />
      </v-col>

      <v-col cols="6" class="py-3">
        <metadata-citation :genericProps="genericPropsPlaceholder"
                            :showPlaceholder="genericPropsPlaceholder.showPlaceholder" />
      </v-col>

      <v-col cols="4" class="py-3">
        <metadata-citation :genericProps="genericProps1" />
      </v-col>

      <v-col cols="8" class="py-3">
        <metadata-citation :genericProps="genericProps2" />
      </v-col>

    </v-row>        
    `,
    updated() {
      this.$children.forEach((child) => {
        child.$forceUpdate();
      });
    },
    methods: {
    },
    data: () => ({
      genericProps1,
      genericProps2,
      genericPropsPlaceholder: {
        showPlaceholder: true,
        fixedHeight: false,
      },
    }),
  }))
.add('Metadata Details', () => ({
    components: { MetadataDetails },
    template: `
    <v-row >

      <v-col cols="6" class="py-3">
        <metadata-details />
      </v-col>

      <v-col cols="6" class="py-3">
        <metadata-details :genericProps="genericPropsPlaceholder"
                          :showPlaceholder="genericPropsPlaceholder.showPlaceholder"
                          :authorDeadInfo="genericPropsPlaceholder.authorDeadInfo"
        />
      </v-col>

      <v-col cols="6" class="py-3">
        <metadata-details :genericProps="genericProps3" />
      </v-col>

    </v-row>        
    `,
    updated() {
      this.$children.forEach((child) => {
        child.$forceUpdate();
      });
    },
    methods: {
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
  }))
.add('Metadata Location', () => ({
    components: { MetadataLocation },
    template: `
    <v-row >

      <v-col cols="6" class="py-3">
        <metadata-location :genericProps="genericProps4" />
      </v-col>

      <v-col cols="6" class="py-3">
        <metadata-location :genericProps="genericPropsPlaceholder"
                            :showPlaceholder="genericPropsPlaceholder.showPlaceholder" />
      </v-col>

    </v-row>        
    `,
    updated() {
      this.$children.forEach((child) => {
        child.$forceUpdate();
      });
    },
    methods: {
    },
    data: () => ({
      genericProps4,
      genericPropsPlaceholder: {
        details: [],
        showPlaceholder: true,
        fixedHeight: false,
      },
    }),
  }))
.add('Metadata Publications', () => ({
    components: { MetadataPublications },
    template: `
    <v-row >

      <v-col cols="6" class="py-3">
        <metadata-publications :genericProps="genericPropsEmpty"
                                :showPlaceholder="genericPropsEmpty.showPlaceholder"/>
      </v-col>

      <v-col cols="6" class="py-3">
        <metadata-publications :genericProps="genericPropsPlaceholder"
                                :showPlaceholder="genericPropsPlaceholder.showPlaceholder" />
      </v-col>

      <v-col cols="4" class="py-3">
        <metadata-publications :genericProps="genericPropsPublications" />
      </v-col>

      <v-col cols="8" class="py-3">
        <metadata-publications :genericProps="genericPropsPublications" />
      </v-col>
      
    </v-row>
    `,
    updated() {
    },
    methods: {
    },
    data: () => ({
      genericProp: {
        publications: publications1,
        showPlaceholder: false,
      },
      genericPropsPlaceholder: {
        publications: null,
        showPlaceholder: true,
      },
      genericPropsEmpty: {
        publications: publications2,
        showPlaceholder: false,
      },
      genericPropsPublications: {
        showPlaceholder: false,
        publications: {
          title: 'Related Publications',
          text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Cursus turpis massa tincidunt dui ut. Proin sagittis nisl rhoncus mattis rhoncus urna neque viverra. Quis enim lobortis scelerisque fermentum dui. Neque egestas congue quisque egestas. Malesuada proin libero nunc consequat interdum varius sit amet mattis. Volutpat blandit aliquam etiam erat. Tempor id eu nisl nunc. Lacus suspendisse faucibus interdum posuere lorem ipsum dolor sit amet. Ultricies mi eget mauris pharetra et ultrices. Eu consequat ac felis donec et odio pellentesque diam volutpat. Fames ac turpis egestas integer. Faucibus interdum posuere lorem ipsum dolor sit amet. Cursus euismod quis viverra nibh cras. Condimentum id venenatis a condimentum vitae sapien pellentesque habitant morbi. At elementum eu facilisis sed odio morbi quis. Ut sem viverra aliquet eget sit amet tellus.
          Proin nibh nisl condimentum id venenatis. Parturient montes nascetur ridiculus mus mauris vitae ultricies leo integer. Id eu nisl nunc mi ipsum faucibus vitae aliquet nec. Eu mi bibendum neque egestas congue quisque egestas diam. Eu volutpat odio facilisis mauris sit amet massa vitae tortor. Porttitor lacus luctus accumsan tortor posuere ac ut consequat. Sed velit dignissim sodales ut. Est pellentesque elit ullamcorper dignissim cras tincidunt lobortis. Sodales ut eu sem integer vitae. Ipsum nunc aliquet bibendum enim facilisis gravida neque convallis a. Augue lacus viverra vitae congue. Eget sit amet tellus cras adipiscing enim eu turpis. Pharetra vel turpis nunc eget lorem. Cras sed felis eget velit aliquet sagittis.
          Sagittis nisl rhoncus mattis rhoncus urna. Vehicula ipsum a arcu cursus vitae. Sed elementum tempus egestas sed. Nec nam aliquam sem et tortor. Enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra. Massa eget egestas purus viverra accumsan in. Integer eget aliquet nibh praesent. Ut placerat orci nulla pellentesque dignissim enim sit amet. Amet venenatis urna cursus eget. Nunc pulvinar sapien et ligula. Vel pharetra vel turpis nunc eget lorem dolor. Felis donec et odio pellentesque diam. Porttitor rhoncus dolor purus non enim.
          Facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum. A diam maecenas sed enim ut sem viverra. Ac felis donec et odio pellentesque diam volutpat commodo. Risus commodo viverra maecenas accumsan lacus vel facilisis. Vitae aliquet nec ullamcorper sit amet. Ullamcorper malesuada proin libero nunc consequat. Arcu vitae elementum curabitur vitae nunc sed velit dignissim sodales. Et tortor consequat id porta nibh venenatis. Lectus mauris ultrices eros in cursus. Tellus integer feugiat scelerisque varius morbi enim nunc faucibus a. Justo donec enim diam vulputate ut pharetra sit. Sit amet luctus venenatis lectus magna fringilla. Vulputate ut pharetra sit amet aliquam id diam maecenas ultricies. Orci dapibus ultrices in iaculis nunc sed augue lacus.
          `,
        },
      },
    }),
  }))
.add('Metadata Funding', () => ({
    components: { MetadataFunding },
    template: `
    <v-row >

      <v-col cols="6" class="py-3">
        <metadata-funding :genericProps="genericProp" />
      </v-col>

      <v-col cols="6" class="py-3">
        <metadata-funding :genericProps="genericPropsPlaceholder"
                          :showPlaceholder="genericPropsPlaceholder.showPlaceholder" />
      </v-col>
    
      <v-col cols="4" class="py-3">
        <metadata-funding :genericProps="genericProps2"
                            :showPlaceholder="genericProps2.showPlaceholder"/>
      </v-col>

      <v-col cols="8" class="py-3">
        <metadata-funding :genericProps="genericProps2"
                          :showPlaceholder="genericProps2.showPlaceholder"/>
      </v-col>

    </v-row>        
    `,
    updated() {
    },
    methods: {
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
  }))
.add('Metadata Authors', () => ({
    components: { MetadataAuthors },
    template: `
    <v-row>

      <v-col cols="12" md="6" class="py-3">
        <metadata-authors  />
      </v-col>

      <v-col cols="12" md="6" class="py-3">
        <metadata-authors :genericProps="genericPropsPlaceholder"
                          :showPlaceholder="genericPropsPlaceholder.showPlaceholder" />
      </v-col>

      <v-col cols="12" md="6" class="py-3">
        <metadata-authors :genericProps="genericProps5" />
      </v-col>

    </v-row>        
    `,
    methods: {
    },
    data: () => ({
      genericProps5,
      genericPropsPlaceholder: {
        authors: [],
        showPlaceholder: true,
      },
    }),
}));
