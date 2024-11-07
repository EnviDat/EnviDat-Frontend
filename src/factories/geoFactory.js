import {
  LOCATION_TYPE_GEOMCOLLECTION,
  LOCATION_TYPE_MULTIPOINT,
  LOCATION_TYPE_MULTIPOLYGON,
  LOCATION_TYPE_POINT,
  LOCATION_TYPE_POLYGON,
} from '@/factories/metadataConsts';

import {
  divIcon,
  icon as createIcon,
  Icon,
  marker as createMarker,
  polygon as createPolygon,
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

function getMultiPointArray(coordinates) {
  // Return a multipoint array with swapped point coordinates
  const pointArray = [];
  coordinates.forEach(coord => {
    const swappedCoord = [coord[1], coord[0]];
    pointArray.push(swappedCoord);
  });

  return pointArray;
}

function getPolygonPointArray(coordinates) {
  // Return a polygon array with swapped point coordinates, accepts holes
  const polygonArray = [];
  coordinates.forEach(outerArray => {
    const pointArray = [];
    outerArray.forEach(coord => {
      const swappedCoord = [coord[1], coord[0]];
      pointArray.push(swappedCoord);
    });
    polygonArray.push(pointArray);
  });

  return polygonArray;
}

function getMultiPolygonPointArray(coordinates) {
  // Return a multipolygon array with swapped point coordinates, accepts holes
  const multiPolyArray = [];
  coordinates.forEach(polygon => {
    const polygonArray = [];
    polygon.forEach(outerArray => {
      const pointArray = [];
      outerArray.forEach(coord => {
        const swappedCoord = [coord[1], coord[0]];
        pointArray.push(swappedCoord);
      });
      polygonArray.push(pointArray);
    });
    multiPolyArray.push(polygonArray);
  });

  return multiPolyArray;
}

/**
 * Extract each geometry individually from a multipoint or multipolygon
 *
 * @param {Object} multiGeom valid MultiPoint or MultiPolygon GeoJSON
 * @returns {Array} array of single GeoJSON geometries (Point or Polygon)
 */
function extractGeomsFromMultiGeoms(multiGeom) {
  let geomType = '';
  if (multiGeom.isMultiPoint) {
    geomType = 'Point';
  } else if (multiGeom.isMultiPolygon) {
    geomType = 'Polygon';
  }

  const geomArray = [];
  multiGeom.geoJSON.coordinates.forEach(geomCoords => {
    const formattedGeom = {
      type: geomType,
      coordinates: geomCoords,
    };
    geomArray.push(formattedGeom);
  });

  return geomArray;
}

/**
 * Extract an array of coordinate arrays with swapped point coordinates for each geom
 *
 * @param {Array} geometries array of GeoJSON objects from GeometryCollection (.geometries)
 * @returns {Array} array of geometry arrays, with swapped coordinates
 */
function getGeomCollectionPointArray(geometries) {
  // Return an array of coordinate arrays with swapped point coordinates for each geom

  let pointArray = [];
  const geomCollectionArray = [];
  let category = '';

  geometries.forEach(geometry => {
    if (geometry.type === LOCATION_TYPE_POINT) {
      pointArray = [geometry.coordinates[1], geometry.coordinates[0]];
      category = 'isPoint';
    } else if (geometry.type === LOCATION_TYPE_POLYGON) {
      pointArray = getPolygonPointArray(geometry.coordinates);
      category = 'isPolygon';
    } else if (geometry.type === LOCATION_TYPE_MULTIPOINT) {
      pointArray = getMultiPointArray(geometry.coordinates);
      category = 'isMultiPoint';
    } else if (geometry.type === LOCATION_TYPE_MULTIPOLYGON) {
      pointArray = getMultiPolygonPointArray(geometry.coordinates);
      category = 'isMultiPolygon';
    }
    geomCollectionArray.push({
      [category]: true,
      pointArray,
    });
  });

  return geomCollectionArray;
}

/**
 * Parse geometries into GeometryCollection GeoJSON format
 *
 * @export
 * @param {Array} geomArray array of valid GeoJSON geometries
 * @param {Object} [propertiesObj={}] key:value mapping for properties included in output GeoJSON
 * @returns {Object} GeoJSON of GeometryCollection type
 */
export function parseAsGeomCollection(geomArray, propertiesObj = {}) {
  if (!geomArray) {
    return null;
  }

  return {
    type: 'GeometryCollection',
    geometries: geomArray,
    properties: propertiesObj,
  };
}

/**
 * Create location object containing geometries for geospatial components
 *
 * @export
 * @param {Object} dataset CKAN metadata entry object
 * @returns {Object} extracted and transformed spatial field prop for geospatial components
 */
export function createLocation(dataset) {
  if (!dataset) {
    return null;
  }

  // If already GeoJSON return, else WKT
  if (typeof dataset.location === 'object') {
    return dataset.location;
  }

  const location = {
    id: dataset.id,
    name: dataset.name,
    title: dataset.title,
  };

  if (dataset.spatial) {
    location.geoJSON = dataset.spatial;

    // parseJSON because the geoJOSN from CKAN might be invalid!

    let spatialJSON = dataset.spatial;

    if (typeof dataset.spatial === 'string') {
      try {
        spatialJSON = JSON.parse(dataset.spatial);
      } catch (error) {
        console.error(`MetaDataFactory: geojson parsing error ${error}`);
      }
    }

    if (spatialJSON) {
      location.geoJSON = spatialJSON;
      location.isPolygon = spatialJSON.type === LOCATION_TYPE_POLYGON;
      location.isPoint = spatialJSON.type === LOCATION_TYPE_POINT;
      location.isMultiPoint = spatialJSON.type === LOCATION_TYPE_MULTIPOINT;
      location.isMultiPolygon = spatialJSON.type === LOCATION_TYPE_MULTIPOLYGON;
      location.isGeomCollection =
        spatialJSON.type === LOCATION_TYPE_GEOMCOLLECTION;

      // Swap lngLat to latLng because the geoJOSN from CKAN might be invalid!

      let geomCollection = [spatialJSON];

      if (location.isPoint) {
        // swap coords for the leaflet map
        location.pointArray = [
          spatialJSON.coordinates[1],
          spatialJSON.coordinates[0],
        ];
      } else if (location.isPolygon) {
        location.pointArray = getPolygonPointArray(spatialJSON.coordinates);
      } else if (location.isMultiPoint) {
        location.pointArray = getMultiPointArray(spatialJSON.coordinates);
        geomCollection = extractGeomsFromMultiGeoms(location);
      } else if (location.isMultiPolygon) {
        location.pointArray = getMultiPolygonPointArray(
          spatialJSON.coordinates,
        );
        geomCollection = extractGeomsFromMultiGeoms(location);
      } else if (location.isGeomCollection) {
        location.pointArray = getGeomCollectionPointArray(
          spatialJSON.geometries,
        );
        geomCollection = spatialJSON.geometries;
      }

      location.geomCollection = parseAsGeomCollection(geomCollection, {
        name: location.name,
      });
    }
  }

  return location;
}

export const defaultSwissLocation = {
  type: 'GeometryCollection',
  geometries: [
    {
      type: 'Polygon',
      coordinates: [
        [
          [5.95587, 45.81802],
          [5.95587, 47.80838],
          [10.49203, 47.80838],
          [10.49203, 45.81802],
          [5.95587, 45.81802],
        ],
      ],
    },
  ],
};

export const defaultWorldLocation = {
  type: 'GeometryCollection',
  geometries: [
    {
      type: 'Polygon',
      coordinates: [
        [
          [-175, -85],
          [-175, 85],
          [175, 85],
          [175, -85],
          [-175, -85],
        ],
      ],
    },
  ],
};

export function geomanGeomsToGeoJSON(layerArray) {
  // Convert leaflet-geoman editing layers into GeoJSON for Leaflet

  const geoJSONArray = [];

  if (layerArray.length !== 0) {
    layerArray.forEach(geometry => {
      const geoJson = geometry.toGeoJSON();
      geoJSONArray.push(geoJson.geometry);
    });
  }

  return geoJSONArray;
}

export function getPointIcon(dataset, modeData, selected, multiMarker = false) {
  const iconOptions = Icon.Default.prototype.options;
  // use the defaultoptions to ensure that all untouched defaults stay in place

  if (modeData && modeData.name !== EDNA_MODE && modeData.icons) {
    let iconUrl = Object.values(modeData.icons)[0];
    let extraValue = dataset[modeData.extrasKey];

    if (extraValue) {
      extraValue = extraValue.toLowerCase();
      iconUrl = modeData.icons[extraValue];
    }

    return createIcon({
      ...iconOptions,
      iconUrl,
      iconRetinaUrl: iconUrl,
      iconShadowUrl: markerShadow,
      iconSize: [30, 30],
      className: 'swissFL_icon',
    })
  }

  iconOptions.iconSize = [30, 30];
  iconOptions.html = `
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          class="v-icon__svg"
          role="img"
          preserveAspectRatio="none"
          style="color: ${ selected ? '#00897b' : 'black' }"
        >
          <path d="${ multiMarker ? mdiMapMarkerMultiple : mdiMapMarker}" transform="scale(1.25, 1.25)"></path>
        </svg>
      `;

  return divIcon(iconOptions);
}

export function getPoint(dataset, coords, id, title, selected, onClick, modeData, multiMarker = false) {
  const icon = getPointIcon(dataset, modeData, selected, multiMarker);

  let opacity = null;

  if (modeData && modeData.icons) {
    opacity = selected ? 1 : 0.65;
  } else {
    opacity = selected ? 0.8 : 0.65;
  }

  const point = createMarker(coords, {
    icon,
    opacity,
    riseOnHover: true,
  });

  point.id = id;
  point.title = title;
  point.on({
    click: (e) => {
      onClick(e.target.id);
    },
    mouseover: (e) => {
      e.target.bindPopup(`<p>${e.target.title}</p>`)
        .openPopup();
    },
    mouseout: (e) => {
      e.target.closePopup();
    },
  });

  return point;
}

export function getPolygon(coords, id, title, selected, onClick) {
  // create a polygon from an array of LatLng points
  // var latlngs = [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]];
  const polygon = createPolygon(coords, {
    color: selected ? '#00897b' : '#ffd740',
    opacity: 0.45,
    fillOpacity: 0,
  });

  polygon.on({ click: onClick });
  polygon.id = id;
  polygon.title = title;

  return polygon;
}

export function getMultiPoint(dataset, coords, id, title, selected, onClick, modeData) {
  const points = [];

  for (let i = 0; i < coords.length; i++) {
    const pointCoord = coords[i];
    const point = getPoint(dataset, pointCoord, id, title, selected, onClick, modeData, true);
    points.push(point);
  }

  return points;
}

export function getMultiPolygon(coords, id, title, selected, onClick) {
  const polys = [];

  for (let i = 0; i < coords.length; i++) {
    const pointCoord = coords[i];
    const poly = getPolygon(pointCoord, id, title, selected, onClick);
    polys.push(poly);
  }

  return polys;
}
