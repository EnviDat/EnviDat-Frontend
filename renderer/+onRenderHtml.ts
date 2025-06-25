import { renderToString as renderToString_ } from '@vue/server-renderer'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { PageContext, PageContextServer } from 'vike/types'

import type { App } from 'vue'
import logoBig from '@/assets/logo/EnviDat_logo_128.png'

import { META } from './meta'

import { createApp } from './app'
import { getDescription, getTitle } from './utils'

async function renderToString(app: App) {
  let err: unknown
  // Workaround: renderToString_() swallows errors in production, see https://github.com/vuejs/core/issues/7876
  app.config.errorHandler = (err_) => {
    err = err_
  }
  const appHtml = await renderToString_(app)
  if (err) throw err
  return appHtml
}

export default async function onRenderHtml(pageContext: PageContextServer & PageContext) {
  const { app } = createApp(pageContext, false)

  const appHtml = await renderToString(app)

  // See https://vike.dev/head
  const title = getTitle(pageContext)
  const description = getDescription(pageContext)

  /*
          <meta name="author" content="${META.DEFAULT_AUTHOR}">
  */

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${description}" />

        <meta property="og:title" content="${title}" />
        <meta property="og:image" content="${META.BASE_URL}${logoBig}" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="${META.BASE_URL}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image:alt" content="${title}" />
        <meta property="og:image:width" content="1200"/>
        <meta property="og:image:height" content="601"/>
        <meta name="twitter:card" content="summary_large_image" />
        <!--<meta name="twitter:site" content="@YourTwitterUsername" />-->
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:image" content="${META.BASE_URL}${logoBig}" />
        <meta name="twitter:text:title" content="${title}" />
        <meta name="twitter:description" content="${description}" />
        <meta name="twitter:image:alt" content="${title}" />
        
        <link rel="icon" href="https://envidat.ch/favicon.ico" />
            
        <title>${title}</title>
      </head>
      <body>
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vike.dev/page-redirection
    },
  }
}


