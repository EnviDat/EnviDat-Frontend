import {
  METADATA_MODULE_PAGENAME,
  METADATA_MODULE_PATH,
  METADATADETAIL_PAGENAME,
  METADATADETAIL_PATH,
} from '@/router/routeConsts';

export const metadataRoutes = [
  {
    path: METADATA_MODULE_PATH,
    name: METADATA_MODULE_PAGENAME,
    component: () => import('@/modules/metadata/MetadataModule.vue'),
    children: [
      {
        path: `${METADATADETAIL_PATH}/:metadataid`,
        name: METADATADETAIL_PAGENAME,
        component: () =>
          import('@/modules/metadata/components/MetadataDetailPage.vue'),
        // children: [
        // {
        //   path: 'edit',
        //   name: 'MetadataDetailEditPage',
        //   component: () => import('@/modules/metadata/components/MetadataDetailEditPage.vue'),
        // },
        // {
        //   path: 'resource/:resourceid',
        //   name: 'ResourceDetailPage',
        //   component: () => import('@/components/Pages/ResourceDetailPage.vue'),
        // },
        // ],
      },
    ],
  },
];
