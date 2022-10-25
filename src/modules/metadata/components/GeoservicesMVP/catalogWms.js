import axios from 'axios';
import WMSCapabilities from 'wms-capabilities';

/**
 * Iterate through tree (recursively) and update fields to required form
 * @param ogcLayer: Layer in OGC Json notation
 * @param level: actual Layer
 * @param maxLevel: max layer levels to show
 */
function customizeProperties(ogcLayer, level, maxLevel) {
  const dt = {};
  dt.id = ogcLayer.Name;
  dt.children = [];
  dt.legendSymbol = ogcLayer.Style;
  dt.isVisible = true;
  dt.title = ogcLayer.Attribution ? ogcLayer.Attribution.Title : ogcLayer.Title;
  dt.isActive = false;
  dt.name = ogcLayer.Title;
  dt.opacity = 1;

  // Recursion
  if (ogcLayer.Layer && ogcLayer.Layer.length > 0) {
    level++;
    if (!maxLevel || level <= maxLevel) {
      ogcLayer.Layer.forEach(child => {
        dt.children.push(customizeProperties(child, level, maxLevel));
      });
    }
  }
  return dt;
}

/**
 * Convert XML to JSON and Customize properties
 */
function getTree(data) {
  let resp = data.data.substr(data.data.indexOf('<WMS_Capabilities')); // Start at the <WMS_Capabilities>-tag
  resp = new WMSCapabilities(resp).toJSON(); // Convert XML to JSON
  const maxLevel = null;
  const layer = customizeProperties(resp.Capability.Layer, 0, maxLevel);
  layer.root = true;
  layer.bbox = resp.Capability.Layer.EX_GeographicBoundingBox;
  layer.name = layer.title;
  return layer;
}

function createWmsCatalog(url) {
  return axios
    .get(url)
    .then(response => getTree(response))
    .catch(() => ({ error: 'Couldnt get data', url }));
}

export { createWmsCatalog };
