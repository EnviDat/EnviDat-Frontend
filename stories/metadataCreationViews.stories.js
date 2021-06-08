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

import MetadataHeader from '@/modules/metadata/components/Metadata/MetadataHeader';
import MetadataBody from '@/modules/metadata/components/Metadata/MetadataBody';
// import MetadataCitation from '@/modules/metadata/components/Metadata/MetadataCitation';
// import MetadataDetails from '@/modules/metadata/components/Metadata/MetadataDetails';
// import MetadataLocation from '@/modules/metadata/components/Metadata/MetadataLocation';
// import MetadataPublications from '@/modules/metadata/components/Metadata/MetadataPublications';
// import MetadataFunding from '@/modules/metadata/components/Metadata/MetadataFunding';
// import MetadataAuthors from '@/modules/metadata/components/Metadata/MetadataAuthors';

import doiIcon from '@/assets/icons/doi.png';
import mailIcon from '@/assets/icons/mail.png';
import contactIcon from '@/assets/icons/contact2.png';
import licenseIcon from '@/assets/icons/license.png';

import {
  createHeader,
  createBody,
} from '@/factories/metaDataFactory';

// metadata gets enhance in the storybook config
import metadata from './js/metadata';

const smallHeader = createHeader(metadata[0], true);
const largeHeader = createHeader(metadata[1], false);

const body1 = createBody(metadata[0]);
const body2 = createBody(metadata[1]);

export const methods = {
  onCardClick: action('clicked on card'),
  onTagClick: action('clicked on tag'),
};

storiesOf('8 Metadata Creation Views / Main Info', module)
  .add('Editing Metadata Header', () => ({
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
  })).add('Editing Metadata Description', () => ({
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
  }));
