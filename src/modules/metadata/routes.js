import {
  // METADATA_MODULE_PAGENAME,
  // METADATA_MODULE_PATH,
  METADATADETAIL_PAGENAME,
  METADATADETAIL_PATH,
  METADATAREVIEW_PAGENAME,
  METADATAREVIEW_PATH,
} from '@/router/routeConsts';

// const MetadataModule = () => import('@/modules/metadata/MetadataModule.vue');
const MetadataDetailPage = () => import('@/modules/metadata/components/MetadataDetail.page.vue');
const MetadataReviewPage = () => import('@/modules/metadata/components/MetadataReviewPage.vue');

export const metadataRoutes = [
/*
  {
    path: METADATA_MODULE_PATH,
    name: METADATA_MODULE_PAGENAME,
    component: MetadataModule,
    children: [
      {
        path: `${METADATADETAIL_PATH}/:metadataid`,
        name: METADATADETAIL_PAGENAME,
        component: MetadataDetailPage,
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
*/
  {
    path: `${METADATADETAIL_PATH}/:metadataid`,
    name: METADATADETAIL_PAGENAME,
    component: MetadataDetailPage,
  },
  {
    path: `${METADATAREVIEW_PATH}/:metadataid`,
    name: METADATAREVIEW_PAGENAME,
    component: MetadataReviewPage,
  },
];
