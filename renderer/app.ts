import type { PageContext } from 'vike/types';
// import createVueApp from 'vike-vue'
import { createSSRApp, h } from 'vue';

import PageLayout from './PageLayout.vue';

export function createApp(pageContext: PageContext) {
  const { Page, pageProps } = pageContext;

  const PageWithLayout = {
    render() {
      return h(
        PageLayout,
        {},
        {
          default() {
            return h(Page, pageProps || {});
          },
        },
      );
    },
  };

  const app = createSSRApp(PageWithLayout);

  return { app };
}
