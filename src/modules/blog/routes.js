import {
  BLOG_PATH,
  BLOG_PAGENAME,
} from '@/router/routeConsts';

export const blogRoutes = [
  {
    path: `${BLOG_PATH}`,
    name: BLOG_PAGENAME,
    component: () => import(/* webpackPrefetch: true, webpackChunkName: "blogPage" */ '@/modules/blog/components/BlogPage'),
    children: [
      {
        path: `${BLOG_PATH}/:post`,
        name: BLOG_PAGENAME,
        component: () => import(/* webpackPrefetch: true, webpackChunkName: "blogPage" */ '@/modules/blog/components/BlogPage'),
      },
    ],
  },
];
