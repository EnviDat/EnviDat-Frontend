import type { PageContextClient } from 'vike/types';
import { createSSRApp, h } from 'vue';
import createVuetify from '@/plugins/vuetify';
import PageLayout from './PageLayout.vue';

export function createApp(pageContext: PageContextClient) {
  const { Page, pageProps } = pageContext

  const PageWithLayout = {
    render() {
      return h(
        PageLayout,
        {},
        {
          default() {
            return h(Page, pageProps || {})
          },
        },
      )
    },
  }

  const app = createSSRApp(PageWithLayout)

  const vuetify = createVuetify(true);
  app.use(vuetify);
}
