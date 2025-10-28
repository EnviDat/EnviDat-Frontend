import { PageContext } from 'vike/types';
import { createSSRApp, defineComponent, h, markRaw, reactive, Component } from 'vue';
import { createPinia } from 'pinia';

import RootComponent from './AppLayout.vue';

import { setPageContext } from './usePageContext';
import { createSSRVuetify } from '@/plugins/vuetify';

// Same as `Object.assign()` but with type inference
function objectAssign<Obj extends object, ObjAddendum>(
  obj: Obj,
  objAddendum: ObjAddendum,
): asserts obj is Obj & ObjAddendum {
  Object.assign(obj, objAddendum);
}

const pinia = createPinia();
const vuetify = createSSRVuetify();

export function createApp(pageContext: PageContext, isClient = true) {
  /*
  console.log('createApp ', pageContext.urlOriginal);
  if (!pageContext.Page) {
    console.log('create no page', pageContext.pageProps);
  }
*/

  // eslint-disable-next-line no-use-before-define
  let rootComponent: InstanceType<typeof PageWithWrapper>;

  const PageWithWrapper = defineComponent({
    data: () => ({
      Page: markRaw(pageContext.Page || {}),
      pageProps: markRaw(pageContext.pageProps || {}),
      isClient,
    }),
    created() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      rootComponent = this;
    },
    render() {
      return h(
        RootComponent as Component,
        {},
        {
          default: () => {
            return h(this.Page, this.pageProps);
          },
        },
      );
    },
  });

  const app = createSSRApp(PageWithWrapper);

  app.use(pinia);
  app.use(vuetify);

  objectAssign(app, {
    changePage: (pageContext: PageContext) => {
      Object.assign(pageContextReactive, pageContext);
      rootComponent.Page = markRaw(pageContext.Page);
      rootComponent.pageProps = markRaw(pageContext.pageProps || {});
    },
  });

  const pageContextReactive = reactive(pageContext);

  setPageContext(app, pageContextReactive);

  return { app };
}
