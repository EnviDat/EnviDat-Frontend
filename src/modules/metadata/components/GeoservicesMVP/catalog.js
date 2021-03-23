import { createEsriCatalog } from './catalogEsri';
import { createWmsCatalog } from './catalogWms';

function createCatalog(url, type) {
  console.log(type);
  console.log(url);
  return type === 'esri' ? createEsriCatalog(url) : createWmsCatalog(url);
}

export { createCatalog };
