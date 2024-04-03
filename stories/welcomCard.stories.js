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

import authorCollection from './testdata/authorCollection.json';

const methods = {
  authors() {
    const items = Object.values(authorCollection);
    return items.splice(2, 4);
  },
};

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
  },
}

export const WithUnpublishedDatasets = {
  args: {
    ...WithDatasets.args,
    unpublishedDatasetCount: 2,
  },
}

export const WithEditingDatasets = {
  args: {
    ...WithUnpublishedDatasets.args,
    editingDatasetCount: 1,
  },
}

