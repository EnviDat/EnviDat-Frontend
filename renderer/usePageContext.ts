import { PageContext } from 'vike/types';
import { inject } from 'vue';

import type { App, InjectionKey } from 'vue';

// `usePageContext` allows us to access `pageContext` in any Vue component.
// See https://vike.dev/pageContext-anywhere

export const vikePageContext: InjectionKey<PageContext> = Symbol('pageContext');

export function usePageContext() {
  const pageContext = inject(vikePageContext);
  if (!pageContext) throw new Error('setPageContext() not called in parent');
  return pageContext;
}

export function setPageContext(app: App, pageContext: PageContext) {
  app.provide(vikePageContext, pageContext);
}
