import { BLOG_PAGENAME,BLOG_PATH } from '@/router/routeConsts';

export const blogRoutes = [
  {
    path: `${BLOG_PATH}`,
    name: BLOG_PAGENAME,
    component: () => import('@/modules/blog/components/BlogPage.vue'),
    children: [
      {
        path: `${BLOG_PATH}/:post`,
        name: BLOG_PAGENAME,
        component: () => import('@/modules/blog/components/BlogPage.vue'),
      },
    ],
  },
];
