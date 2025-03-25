import { createApp } from './app'

export default onRenderClient

async function onRenderClient(pageContext) {
  const { Page } = pageContext
  const { app, router } = createApp({ Page })
  await router.isReady()
  app.mount('#app')
}
