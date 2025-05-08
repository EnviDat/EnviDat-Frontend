import type { PageContext } from 'vike/types';
// import createVueApp from 'vike-vue'
import { createSSRApp, defineComponent, h, markRaw, Component, reactive } from 'vue';

import PageLayout from './PageLayout.vue';

/*
import { createVuetify } from 'vuetify';
import { VTreeview } from 'vuetify/lib/labs/VTreeview';
import { setPageContext } from './usePageContext.ts'
import config from '@/plugins/vuetifyConfig';

import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

const vuetify = createVuetify({
  ...config,
  ssr: true,
  components: {
    VTreeview,
  },
});
*/

// Same as `Object.assign()` but with type inference
function objectAssign<Obj extends object, ObjAddendum>(
  obj: Obj,
  objAddendum: ObjAddendum,
): asserts obj is Obj & ObjAddendum {
  Object.assign(obj, objAddendum)
}

export function createApp(pageContext: PageContext, isClient = true) {
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
/*
  const vuetify = createVuetify();
  app.use(vuetify);
*/

  return { app };


/*
  let rootComponent; // : InstanceType <typeof PageWithWrapper>

  const PageWithWrapper = defineComponent({
    data: () => ({
      Page: markRaw(pageContext.Page),
      pageProps: markRaw(pageContext.pageProps || {}),
      isClient,
    }),
    created() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      rootComponent = this
      console.log('created', this);
      console.log('created', vuetify);
    },
    render() {
      return h(
        PageLayout as Component,
        {},
        {
          default: () => h(this.Page, this.pageProps),
        },
      )
    },
  })

*/

/*
  const app = createSSRApp(PageWithWrapper)
  app.use(vuetify)

  const pageContextReactive = reactive(pageContext)

  objectAssign(app, {
    changePage: (pageCont: PageContext) => {
      Object.assign(pageContextReactive, pageCont)
      rootComponent.Page = markRaw(pageCont.Page)
      rootComponent.pageProps = markRaw(pageCont.pageProps || {})
    },
  })

  setPageContext(app, pageContextReactive)

  return { app }
*/

}
