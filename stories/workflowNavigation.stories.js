/**
 * @summary story of all the Editing Author MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */


import NavigationWorkflow from '@/components/Navigation/TheNavigationWorkflow.vue';


export default {
  title: '6 Workflows / Combined / NavigationWorkflow',
  component: NavigationWorkflow,
};

export const Empty = {
  args: {
  },
}

export const Loading = {
  args: {
    ...Empty.args,
    loading: true,
  },
}
