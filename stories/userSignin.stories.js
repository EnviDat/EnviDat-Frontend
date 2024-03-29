/* eslint-disable object-curly-newline */
/**
 * @summary story of SigninPage sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-08-25 12:21:22
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import WelcomeCard from '@/components/Cards/WelcomeCard.vue';

import NotFoundCard from '@/components/Cards/NotFoundCard.vue';
import UserNotFound1 from '@/modules/user/assets/UserNotFound1.jpg';
import UserNotFound2 from '@/modules/user/assets/UserNotFound2.jpg';

import authorCollection from './testdata/authorCollection.json';

const methods = {
  authors() {
    const items = Object.values(authorCollection);
    return items.splice(2, 4);
  },
};

export default {
  title: '7 User / SignIn',
  decorators: [],
  parameters: {
  },
};


export const WelcomeCardViews = () => ({
    components: { WelcomeCard },
    template: `
    <v-row >

      <v-col cols="6">
        <WelcomeCard  />
      </v-col>

      <v-col cols="6">
        <WelcomeCard :userName="userName"
                     :welcomeText="welcomeText"
                      :publishedDatasetCount="123" />
      </v-col>

      <v-col cols="6">
        <WelcomeCard :userName="userName"
                      :publishedDatasetCount="123"
                      :unpublishedDatasetCount="2" />
      </v-col>

      <v-col cols="6">
        <WelcomeCard :userName="userName"
                      :publishedDatasetCount="123"
                      :unpublishedDatasetCount="2"
                      :editingDatasetCount="1" />
      </v-col>

      <v-col cols="12">
        <WelcomeCard :userName="userName"
                     :welcomeText="welcomeText"
                      :publishedDatasetCount="123"
                      :unpublishedDatasetCount="2"
                      :editingDatasetCount="1" />
      </v-col>

    </v-row>
    `,
    data: () => ({
      nameInitials: 'DH',
      emailHash: null,
      userName: 'Dominik Haas',
      welcomeText: 'Welcome to your Dashboard, here you can see all your datasets.',
    }),
    methods,
  });

export const NoUserDatasetsViews = () => ({
    components: { NotFoundCard },
    template: `
    <v-row >

      <v-col cols="6">
        <NotFoundCard />
      </v-col>

      <v-col cols="6">
        <NotFoundCard v-bind="notSignedInInfos" />
      </v-col>

      <v-col cols="6">
        <NotFoundCard v-bind="noDatasetsInfos" />
      </v-col>

      <v-col cols="6">
        <NotFoundCard v-bind="noDatasetsInfos" />
      </v-col>

    </v-row>
    `,
    data: () => ({
      notSignedInInfos: {
        title: 'Not Signed in',
        description: 'Sign in with your email address to see your datasets.',
        actionButtonText: 'Sign in',
        image: UserNotFound1,
      },
      noDatasetsInfos: {
        title: 'No Datasets',
        description: "It seems you don't have any datasets.",
        actionDescription: 'Get started and create a new dataset',
        actionButtonText: 'New Dataset',
        image: UserNotFound2,
      },
    }),
    methods,
  });
