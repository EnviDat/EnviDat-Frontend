
import {
  divIcon as createDivIcon,
  geoJSON,
  icon as createIcon,
  Icon,
  marker as createMarker,
  polygon as createPolygon,
  tileLayer,
} from 'leaflet';

// Solution to loading in the imgs correctly via webpack
// see more https://github.com/PaulLeCam/react-leaflet/issues/255
/*
import marker from '@/assets/map/marker-icon.png';
import marker2x from '@/assets/map/marker-icon-2x.png';
import selectedMarker from '@/assets/map/selected-marker-icon.png';
import selectedMarker2x from '@/assets/map/selected-marker-icon-2x.png';
*/
import markerShadow from '@/assets/map/marker-shadow.png';

import { EDNA_MODE } from '@/store/metadataMutationsConsts';
import { mdiMapMarker, mdiMapMarkerMultiple } from '@mdi/js';
import {
  LOCATION_TYPE_GEOMCOLLECTION,
  LOCATION_TYPE_MULTIPOINT,
  LOCATION_TYPE_MULTIPOLYGON,
  LOCATION_TYPE_POINT,
  LOCATION_TYPE_POLYGON,
} from '@/factories/metadataConsts';


export const pointStyle = (selected) => ({
  color: selected ? '#00897b' : 'black',
  riseOnHover: true,
})

export const polygonStyle = (selected, editing) => ({
  color: selected ? '#00897b' : '#ffd740',
  opacity: 0.55,
  fillOpacity: editing ? 0.25 : 0,
})

export function getPointIcon(selected, multiMarker = false, modeData = undefined, dataset = undefined) {
  // use the default options to ensure that all untouched defaults stay in place

  if (modeData && modeData.name !== EDNA_MODE && modeData.icons) {
    let iconUrl = Object.values(modeData.icons)[0];
    let extraValue = dataset[modeData.extrasKey];

    if (extraValue) {
      extraValue = extraValue.toLowerCase();
      iconUrl = modeData.icons[extraValue];
    }

    const iconOptions = Icon.Default.prototype.options;

    return createIcon({
      ...iconOptions,
      iconUrl,
      iconRetinaUrl: iconUrl,
      iconShadowUrl: markerShadow,
      iconSize: [30, 30],
      className: 'swissFL_icon',
    })
  }

  const style = pointStyle(selected)
  const iconOptions = {}
  iconOptions.iconSize = [30, 30];
  iconOptions.html = `
        <svg
          id="${dataset?.id}"
          width="30"
          height="30"
          viewBox="0 0 30 30"
          class="v-icon__svg"
          role="img"
          preserveAspectRatio="none"
          isSelected="${selected}"
          style="color: ${ style.color }"
        >
          <path d="${ multiMarker ? mdiMapMarkerMultiple : mdiMapMarker}" transform="scale(1.25, 1.25)"></path>
        </svg>
      `;

  return createDivIcon(iconOptions);
}

function ensureLngLatCoords(coords) {
  const [x, y] = coords;

  // If x is within the latitude range (-90..90)
  // and y is within the longitude range (-180..180),
  // and the absolute value of y is greater than x (common for many coords),
  // then we guess it's [lat, lng] and should be flipped
  const isPossiblyLatLng =
    Math.abs(x) <= 90 &&
    Math.abs(y) <= 180 &&
    // A further heuristic: Usually longitude has a larger absolute value than latitude
    Math.abs(y) >= Math.abs(x);

  if (isPossiblyLatLng) {
    return [y, x]; // flip to [lng, lat]
  }

  return coords; // assume it's already [lng, lat]
}

export function getPointLayer(coords, id, title, selected, onClick, multiMarker = false, modeData = undefined, dataset = undefined) {
  const icon = getPointIcon(selected, multiMarker, modeData, dataset);

  let opacity = null;

  if (modeData && modeData.icons) {
    opacity = selected ? 1 : 0.65;
  } else {
    opacity = selected ? 0.8 : 0.65;
  }

  const flippedCoords = ensureLngLatCoords(coords);
  const point = createMarker(flippedCoords, {
    icon,
    opacity,
    riseOnHover: true,
  });

  point.id = id;
  point.title = title;
  point.on({
    click: (e) => {
      if(onClick) {
        onClick(e.target.id);
      }
    },
    mouseover: (e) => {
      if (!e.target?.title) {
        return;
      }
      e.target.bindPopup(`<p>${e.target.title}</p>`)
        .openPopup();
    },
    mouseout: (e) => {
      e.target.closePopup();
    },
  });

  return point;
}

export function getPolygonLayer(coords, id, title, selected, onClick) {
  // create a polygon from an array of LatLng points
  // var latlngs = [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]];

  // const { coordinates: flippedCoords } = rewind({ coordinates: coords });
  const flippedCoords = [];

  for (let i = 0; i < coords.length; i++) {
    const polyArray = coords[i];
    for (let j = 0; j < polyArray.length; j++) {
      const polyCoords = polyArray[j];
      flippedCoords.push(ensureLngLatCoords(polyCoords));
    }
  }

  const polygon = createPolygon(flippedCoords, polygonStyle(selected));

  polygon.on('click', (e) => {
    onClick(e.target.id);
  });
  polygon.id = id;
  polygon.title = title;

  return polygon;
}

export function getMultiPointLayer(coords, id, title, selected, onClick, modeData, dataset) {
  const points = [];

  for (let i = 0; i < coords.length; i++) {
    const pointCoord = coords[i];
    const point = getPointLayer(pointCoord, id, title, selected, onClick, true, modeData, dataset);
    points.push(point);
  }

  return points;
}

export function getMultiPolygonLayer(coords, id, title, selected, onClick) {
  const polys = [];

  for (let i = 0; i < coords.length; i++) {
    const pointCoord = coords[i];
    const poly = getPolygonLayer(pointCoord, id, title, selected, onClick);
    polys.push(poly);
  }

  return polys;
}

export function createTopoLayer() {
  return tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
    maxZoom: 19,
  });
}

export function createImageryLayer() {
  return tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 19,
  });
}

function createGcNetLayers(feature, latlng, vueInstance){

  let style = vueInstance?.getCustomLeafletStyle?.gcnetStyle

  if (feature.properties) {
    if (feature.properties.active === null || feature.properties.active === undefined) {
      style = vueInstance?.getCustomLeafletStyle?.gcnetMissingStyle;
    } else if (feature.properties.active === true) {
      style = vueInstance?.getCustomLeafletStyle?.gcnetStyle;
    } else if (feature.properties.active === false) {
      style = vueInstance?.getCustomLeafletStyle?.gcnetInactiveStyle;
    }
  }

  const gcLayer = createMarker(latlng, style);

  gcLayer.on({
    click: () => {
      vueInstance?.catchGcnetStationClick(feature.properties.alias);
    },
  });

  return gcLayer;
}

export function createLeafletLayerViaGeoJson(geoJSONArray, id, title, vueInstance) {

  const layerId = id
  const layerTitle = title

  return geoJSON(geoJSONArray, {
    style: vueInstance?.getCustomLeafletStyle,
    pointToLayer: (feature, latlng) => {
      if (vueInstance.isGcnet) {
        return createGcNetLayers(feature, latlng, vueInstance);
      }

      const layerType = feature.geometry?.type || feature.type;

      if (layerType === LOCATION_TYPE_POINT) {
        return getPointLayer(feature.geometry.coordinates, layerId, layerTitle, false, undefined);
      }

      if(layerType === LOCATION_TYPE_MULTIPOINT) {
        return getMultiPointLayer(feature.geometry.coordinates, layerId, layerTitle, false, undefined);
      }

      if(layerType === LOCATION_TYPE_POLYGON) {
        return getPolygonLayer(feature.geometry.coordinates, layerId, layerTitle, false, undefined);
      }

      return getPointLayer(feature.geometry.coordinates, layerId, layerTitle, false, undefined);
    },
  });
}

export function createLeafletLayer(geometry, id, title, selected, onClick, isGcnet, modeData, dataset, vueInstance) {
  let layer;

  if (isGcnet) {
    return createLeafletLayerViaGeoJson(geometry, id, title, vueInstance);
  }

  if (geometry.type === LOCATION_TYPE_POINT) {
    layer = getPointLayer(geometry.coordinates, id, title,
      selected, onClick,
      undefined, modeData, dataset,
    );
  } else if (geometry.type === LOCATION_TYPE_MULTIPOINT) {
    layer = getMultiPointLayer(geometry.coordinates, id, title,
      selected, onClick,
      modeData, dataset,
    );
  } else if (geometry.type === LOCATION_TYPE_POLYGON) {
    layer = getPolygonLayer(geometry.coordinates, id, title,
      selected, onClick,
      modeData, dataset,
    );
  } else if (geometry.type === LOCATION_TYPE_MULTIPOLYGON) {

    // don't manually rewind (change the sequence of the coordination) it's done via the geoJSON from leaflet
    layer = createLeafletLayerViaGeoJson(geometry, id, title, this)
  } else if (geometry.type === LOCATION_TYPE_GEOMCOLLECTION) {
    layer = createLeafletLayerViaGeoJson(geometry, id, title, this)

  } else {
    console.log(geometry);
    throw new Error(`Unknown Geometry type: '${geometry.type}'`)
/*
    layer = createLeafletLayerViaGeoJson(geometry, id, title, this)
*/

    // throw new Error(`Unkown Geometry ${geometry.type}`);
  }

  layer.type = geometry.type;
  return layer;
}

