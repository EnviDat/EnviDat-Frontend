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

export default {
  title: '3 Cards / Welcome Card',
  component: WelcomeCard,
};

export const Empty = {
  args: {},
}

export const WithDatasets = {
  args: {
    userName: 'userName',
    welcomeText: 'welcomeText',
    publishedDatasetCount: 123,
    createClickCallback: (() => {
      console.log('clicked on new dataset');
    }),
  },
}

export const WithDatasetsDisabled = {
  args: {
    userName: 'userName',
    welcomeText: 'welcomeText',
    publishedDatasetCount: 123,
  },
}
export const WithUnpublishedDatasets = {
  args: {
    ...WithDatasets.args,
    unpublishedDatasetCount: 2,
    unpublishedClickCallback: (() => {
      console.log('clicked on unpublished button');
    }),
  },
}

export const WithEditingDatasets = {
  args: {
    ...WithUnpublishedDatasets.args,
    editingDatasetCount: 1,
    editingClickCallback: (() => {
      console.log('clicked on edit dataset');
    }),
  },
}

