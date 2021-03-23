import axios from 'axios';

function getErrorLayerdata(metadata) {
  return {
    children: [],
    id: -1,
    name: metadata.name,
    parentLayerId: null,
    root: true,
    loadingError: true,
  };
}


function getLegendSymbol(legend, id) {
  const result = legend.find(el => el.layerId === id);
  return !result ? null : result.legend;
}


/**
 * Parse flat array of layers into an n-ary tree
 * @param layers: Layer Data
 * @param legend: Legend Data
 * @returns root: Object containing the catalog tree
 */
function getLayerdata(layers, legend, service) {
  const root = {
    id: -1,
    parentLayerId: null,
    children: [],
    root: true,
    name: service.name,
  }; // Instantiate root
  const nodeList = { 0: root }; // Helping variable

  for (let i = 0; i < layers.length; i++) {
    // Add required fields

    const child = {
      id: layers[i].id,
      children: [],
      legendSymbol: getLegendSymbol(legend, layers[i].id),
      isActive: false,
      opacity: 1,
      isVisible: true,
      showLegend: false,
      title: service.name,
      name: layers[i].name,
      parentLayerId: layers[i].parentLayerId,
      repaintColor: null,
    };

    // Create tree (recursion)
    nodeList[child.id + 1] = child;
    nodeList[child.parentLayerId + 1].children.push(nodeList[child.id + 1]);
  }
  return root;
}

function createEsriCatalog(metadata) {
    const serviceUrl = `${metadata.url}?f=pjson`;
    const legendUrl = `${metadata.url}/legend?f=pjson`;

    return Promise.all([axios.get(serviceUrl), axios.get(legendUrl)])
        .then((array) => {
            metadata.loaded = true;
            const layers = array[0].data.layers;
            const legend = array[1].data.layers;
            const layerdata = getLayerdata(layers, legend, metadata);

            return { layerdata, metadata };
        })
      .catch(() => ({ layerdata: getErrorLayerdata(metadata), metadata }));
}


export { createEsriCatalog };
