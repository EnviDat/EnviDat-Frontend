/**
 * @summary story of all the Editing Author MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { Meta, StoryObj } from '@storybook/vue3-vite';
import { onMounted } from 'vue';
import { USER_ROLE_SYSTEM_ADMIN } from '@/factories/userEditingValidations';
import { useDatasetWorkflowStore } from '@/modules/workflow/datasetWorkflow';
import TheWorkflowNavigation from '@/components/Navigation/TheWorkflowNavigation.vue';
import { WorkflowMode } from '@/modules/workflow/utils/workflowEnums';

export default {
  title: '6 Workflows / Combined / NavigationWorkflow',
  component: TheWorkflowNavigation,
} satisfies Meta;

export const Empty = {
  args: {},
};

export const Loading = {
  args: {
    ...Empty.args,
    loading: true,
  },
};

export const SystemAdmin: StoryObj = {
  args: {
    ...Empty.args,
  },
  render: (args) => ({
    components: { TheWorkflowNavigation },
    setup() {
      onMounted(() => {
        const store = useDatasetWorkflowStore();
        store.userRole = USER_ROLE_SYSTEM_ADMIN;
        store.initializeDataset({}, WorkflowMode.Create);
      });

      return args;
    },
    template: '<TheWorkflowNavigation v-bind="args" />',
  }),
};
