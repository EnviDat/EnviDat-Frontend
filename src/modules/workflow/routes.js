import { WORKFLOW_PATH, WORKFLOW_PAGENAME } from '@/router/routeConsts';

const WorkflowPage = () =>
  import('@/modules/workflow/components/WorkflowPage.vue');

export const workflowRoutes = [
  {
    path: `${WORKFLOW_PATH}/:id?`,
    name: WORKFLOW_PAGENAME,
    props: (route) => ({ datasetId: route.query.datasetId }),
    component: WorkflowPage,
  },
];
