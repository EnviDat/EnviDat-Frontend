import {
  METADATA_MODULE_PATH,
  METADATA_MODULE_PAGENAME,
  METADATADETAIL_PATH,
  METADATADETAIL_PAGENAME,
} from '@/router/routeConsts';

export const metadataRoutes = [
  {
    path: METADATA_MODULE_PATH,
    name: METADATA_MODULE_PAGENAME,
    component: () => import(/* webpackPrefetch: true, webpackChunkName: "browsePage" */ '@/modules/metadata/MetadataModule'),
    children: [
      {
        path: `${METADATADETAIL_PATH}/:metadataid`,
        name: METADATADETAIL_PAGENAME,
        component: () => import(/* webpackChunkName: "metadataDetailPage" */ '@/modules/metadata/components/MetadataDetailPage'),
        // children: [
          // {
          //   path: 'edit',
          //   name: 'MetadataDetailEditPage',
          //   component: () => import(/* webpackChunkName: "metadataDetailPage" */ '@/modules/metadata/components/MetadataDetailEditPage'),
          // },
          // {
          //   path: 'resource/:resourceid',
          //   name: 'ResourceDetailPage',
          //   component: () => import(/* webpackChunkName: "resourceDetailPage" */ '@/components/Pages/ResourceDetailPage'),
          // },
        // ],
      },
      {
        path: `${METADATADETAIL_PATH}/:metadataid/map`,
        name: METADATADETAIL_PAGENAME,
        component: () => import(/* webpackChunkName: "metadataDetailPage" */ '@/modules/metadata/components/MetadataMapPage'),
      },
    ],
  },
];
