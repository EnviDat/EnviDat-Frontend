/**
 * @summary story of all the Editing Author MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import WorkflowPage from '@/modules/workflow/components/WorkflowPage.vue';
import datasets from './js/metadata';

export default {
  title: '6 Workflows / Combined / WorkflowPage',
  component: WorkflowPage,
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

export const Filled = {
  args: {
    dataset: datasets[0],
  },
}
