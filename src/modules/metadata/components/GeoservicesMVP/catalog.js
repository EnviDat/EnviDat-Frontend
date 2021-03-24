import { createEsriCatalog } from './catalogEsri';
import { createWmsCatalog } from './catalogWms';

function createCatalog(url, type) {
  return type === 'esri' ? createEsriCatalog(url) : createWmsCatalog(url);
}

export { createCatalog };
