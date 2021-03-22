import L from 'leaflet';

/* eslint-disable new-cap */
export function leafletLayer(config) {
  if (config.type === 'wms') {
    return new L.tileLayer.wms(config.baseURL, {
      layers: config.name,
      transparent: true,
      format: 'image/png',
      noWrap: true,
    });
  }
  return null;
}
