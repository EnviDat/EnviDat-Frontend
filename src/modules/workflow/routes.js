import { WORKFLOW_PATH, WORKFLOW_PAGENAME } from '@/router/routeConsts';

const WorkflowPage = () =>
  import('@/modules/workflow/components/WorkflowPage.vue');

export const workflowRoutes = [
  {
    path: WORKFLOW_PATH,
    name: WORKFLOW_PAGENAME,
    component: WorkflowPage,
  },
];
