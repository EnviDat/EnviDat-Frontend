/**
 * @summary story of all the NavigationToolbar use cases
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import TheNavigationToolbar from '@/components/Navigation/TheNavigationToolbar.vue';

import { SWISSFL_MODE } from '@/store/metadataMutationsConsts';

import { userMenuItems } from '@/store/navigationState';


const dominikHaas = {
  fullName: 'Dominik Haas',
  email: 'dominik.haas@wsl.ch',
  firstName: 'dominik',
  lastName: 'Haas',
  id: '929b0bc7-bfe7-4248-b90c-21f547ffe9d9',
};

export default {
  title: '5 Navigation / Navigation Toolbar',
  component: TheNavigationToolbar,
};

export const Empty = {
  args: {},
};

export const Loading = {
  args: {
    loading: true,
  },
};

export const WithMode = {
  args: {
    mode: SWISSFL_MODE,
  },
};

export const Signedin = {
  args: {
    signedInUser: dominikHaas,
    userNavigationItems: userMenuItems,
  },
};


export const DatasetInEditing = {
  args: {
    ...Signedin.args,
    editingDatasetName: 'Dataset Title',
  },
};
