import { ErrorLevel, SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const projDirName = dirname(fileURLToPath(import.meta.url));


export async function generateSitemap(datasetUrls: string[]) {
  const sitemap = new SitemapStream({
    hostname: 'https://www.envidat.ch',
    level: ErrorLevel.WARN,
  });

  const writeStream = createWriteStream(
    resolve(projDirName, '../../sitemap.xml'),
  );

  sitemap.pipe(writeStream);

  sitemap.write({ url: 'metadata', changefreq: 'daily', priority: 1.0 });

  for (const route of datasetUrls) {
    sitemap.write({ url: route, changefreq: 'daily', priority: 1.0 });
  }

/*
  sitemap.write({ url: '/about', changefreq: 'monthly' })
  sitemap.write({ url: '/contact', changefreq: 'monthly' })
*/

  sitemap.end();

  await streamToPromise(sitemap);

  console.log('sitemap.xml generated!');
}
