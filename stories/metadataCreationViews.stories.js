// TODO pass bodyObject text 

/* eslint-disable object-property-newline */
/**
 * @summary story of all the MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho and Rebecca Kurup Buchholz
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-07-05 20:26:06
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
// import { action } from '@storybook/addon-actions';

import EditMetadataHeader from '@/modules/user/components/EditMetadataHeader';
import EditDescription from '@/modules/user/components/EditDescription';
// import MetadataBody from '@/modules/metadata/components/Metadata/MetadataBody';
// import MetadataCitation from '@/modules/metadata/components/Metadata/MetadataCitation';
// import MetadataDetails from '@/modules/metadata/components/Metadata/MetadataDetails';
// import MetadataLocation from '@/modules/metadata/components/Metadata/MetadataLocation';
// import MetadataPublications from '@/modules/metadata/components/Metadata/MetadataPublications';
// import MetadataFunding from '@/modules/metadata/components/Metadata/MetadataFunding';
// import MetadataAuthors from '@/modules/metadata/components/Metadata/MetadataAuthors';

// import doiIcon from '@/assets/icons/doi.png';
// import mailIcon from '@/assets/icons/mail.png';
// import contactIcon from '@/assets/icons/contact2.png';
// import licenseIcon from '@/assets/icons/license.png';

// import {
//   createHeader,
//   createBody,
// } from '@/factories/metaDataFactory';

// metadata gets enhance in the storybook config
// import metadata from './js/metadata';

// const smallHeader = createHeader(metadata[0], true);
// const largeHeader = createHeader(metadata[1], false);

// const body1 = createBody(metadata[0]);
// const body2 = createBody(metadata[1]);

// export const methods = {
//   onCardClick: action('clicked on card'),
//   onTagClick: action('clicked on tag'),
// };

storiesOf('8 Metadata Creation Views / Main Info', module)
  .add('Edit Metadata Header', () => ({
    components: { EditMetadataHeader },
    template: `
    <v-col>

      <v-row>
        Edit Metadata Header fields unfilled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditMetadataHeader />
        </v-col>
      </v-row>


      <v-row>
        Edit Metadata Header fields filled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditMetadataHeader inputTitle="My Glorious Title" inputContactEmail="sarah@smith.com" inputContactGivenName="Sarah" inputContactSurname="Smith" />
        </v-col>
      </v-row>

    </v-col>
    `,
    methods: {
    },
    data: () => ({
    }),
  })).add('Edit Metadata Description', () => ({
    components: { EditDescription },
    template: `
     <v-col>
     
      <v-row>
        Edit Description textarea unfilled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditDescription>
        </v-col>
      </v-row>


      <v-row>
        Edit Description textarea filled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditDescription :bodyobject="bodyObjectPlaceholder">
        </v-col>
      </v-row>


    </v-col>
    `,
    data: () => ({
      bodyObjectPlaceholder: {
        body: {
          text:
            `# Why user stories?

                      User Stories can help you to constantly improve the value of
                      your product, estimate development efforts in an appropriate way and prioritize
                      feature development during the MVP and post-MVP stages. 

                      # How user stories 

                      ## 1. Step think about "Who" - type of user 

                      Try to omit using such a role as simply
                      “the user”. It can be applied to any person - from your customers to admins -
                      and, therefore, it doesn’t reflect the personality of particular target groups,
                      the way they interact with the application. You can create personas. 

                      ## 2. Step think about the "What" - function, UI & UX 

                      Define what functionality each user expects. How she’s going to interact with the app. 

                      ## 3. Step think about the "Why" - added value 

                      It should either improve the UX, increase retention rates,
                      shorten users’ journey to the issue solution or whatever. Each Story should
                      contribute something to the general goal of your product.
                      `,
        },
      },
    }), 
}));
