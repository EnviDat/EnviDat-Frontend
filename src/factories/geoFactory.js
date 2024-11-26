import {
  LOCATION_TYPE_GEOMCOLLECTION,
  LOCATION_TYPE_MULTIPOINT,
  LOCATION_TYPE_MULTIPOLYGON,
  LOCATION_TYPE_POINT,
  LOCATION_TYPE_POLYGON,
} from '@/factories/metadataConsts';


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

export function creationGeometry(spatialJSON, properties) {
  const geometry = {};

  geometry.geoJSON = spatialJSON;
  geometry.isPolygon = spatialJSON.type === LOCATION_TYPE_POLYGON;
  geometry.isPoint = spatialJSON.type === LOCATION_TYPE_POINT;
  geometry.isMultiPoint = spatialJSON.type === LOCATION_TYPE_MULTIPOINT;
  geometry.isMultiPolygon = spatialJSON.type === LOCATION_TYPE_MULTIPOLYGON;
  geometry.isGeomCollection = spatialJSON.type === LOCATION_TYPE_GEOMCOLLECTION;

  // Swap lngLat to latLng because the geoJOSN from CKAN might be invalid!

  let geomCollection = [spatialJSON];

  if (geometry.isPoint) {
    // swap coords for the leaflet map
    geometry.pointArray = [
      spatialJSON.coordinates[1],
      spatialJSON.coordinates[0],
    ];
  } else if (geometry.isPolygon) {
    geometry.pointArray = getPolygonPointArray(spatialJSON.coordinates);
  } else if (geometry.isMultiPoint) {
    geometry.pointArray = getMultiPointArray(spatialJSON.coordinates);
    geomCollection = extractGeomsFromMultiGeoms(geometry);
  } else if (geometry.isMultiPolygon) {
    geometry.pointArray = getMultiPolygonPointArray(spatialJSON.coordinates);
    geomCollection = extractGeomsFromMultiGeoms(geometry);
  } else if (geometry.isGeomCollection) {
    geometry.pointArray = getGeomCollectionPointArray(spatialJSON.geometries);
    geomCollection = spatialJSON.geometries;
  }

  geometry.geomCollection = parseAsGeomCollection(geomCollection, properties);

  return geometry;
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

  let location = {
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
      const geometry = creationGeometry(spatialJSON, location);
      location = {
        ...location,
        ...geometry,
      }
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
