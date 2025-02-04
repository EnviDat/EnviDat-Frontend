import {
  LOCATION_TYPE_GEOMCOLLECTION,
  LOCATION_TYPE_MULTIPOINT,
  LOCATION_TYPE_MULTIPOLYGON,
  LOCATION_TYPE_POINT,
  LOCATION_TYPE_POLYGON,
} from '@/factories/metadataConsts';


/*
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

/!**
 * Extract each geometry individually from a multipoint or multipolygon
 *
 * @param {Object} multiGeom valid MultiPoint or MultiPolygon GeoJSON
 * @returns {Array} array of single GeoJSON geometries (Point or Polygon)
 *!/
function extractGeomsFromMultiGeoms(multiGeom) {
  let geomType = '';
  if (multiGeom.isMultiPoint) {
    geomType = LOCATION_TYPE_POINT;
  } else if (multiGeom.isMultiPolygon) {
    geomType = LOCATION_TYPE_POLYGON;
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

/!**
 * Extract an array of coordinate arrays with swapped point coordinates for each geom
 *
 * @param {Array} geometries array of GeoJSON objects from GeometryCollection (.geometries)
 * @returns {Array} array of geometry arrays, with swapped coordinates
 *!/
function getGeomCollectionPointArray(geometries) {
  // Return an array of coordinate arrays with swapped point coordinates for each geom

  const geomCollectionArray = [];

  geometries.forEach(geometry => {
    let pointArray = [];
    let category = '';

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
*/

/**
 * Parse geometries into GeometryCollection GeoJSON format
 *
 * @export
 * @param {Array} geomArray array of valid GeoJSON geometries
 * @param {Object} [propertiesObj={}] key:value mapping for properties included in output GeoJSON
 * @returns {Object} GeoJSON of GeometryCollection type
 */
export function createGeomCollection(geomArray, propertiesObj = {}) {
  if (!geomArray) {
    return null;
  }

  const geoCollection = {
    type: LOCATION_TYPE_GEOMCOLLECTION,
    properties: propertiesObj,
  };

  if (geomArray.type === LOCATION_TYPE_GEOMCOLLECTION) {
    geoCollection.geometries = geomArray.geometries;
  } else {

    let geometries = geomArray;
    if (!(geometries instanceof Array)) {
      geometries = [geometries];
    }

    geoCollection.geometries = geometries;
  }

  return geoCollection;
}

export function creationGeometry(geoJSON, properties) {
  const geometry = {};

  // geometry.geoJSON = geoJSON;
  geometry.isPolygon = geoJSON.type === LOCATION_TYPE_POLYGON;
  geometry.isPoint = geoJSON.type === LOCATION_TYPE_POINT;
  geometry.isMultiPoint = geoJSON.type === LOCATION_TYPE_MULTIPOINT;
  geometry.isMultiPolygon = geoJSON.type === LOCATION_TYPE_MULTIPOLYGON;
  geometry.isGeomCollection = geoJSON.type === LOCATION_TYPE_GEOMCOLLECTION;

  // let geomCollection = [geoJSON];
  // let coordinates;
  // let geomType;

/*
  if (geometry.isPoint) {
    coordinates = geoJSON.coordinates;
    // Swap lngLat to latLng because the geoJOSN from CKAN might be invalid!
    // swap coords for the leaflet map
/!*
    coordinates = [
      geoJSON.coordinates[1],
      geoJSON.coordinates[0],
    ];
*!/
    // geomType = LOCATION_TYPE_POINT;
  } else if (geometry.isPolygon) {
    coordinates = getPolygonPointArray(geoJSON.coordinates);
    // geomType = LOCATION_TYPE_POLYGON;
  } else if (geometry.isMultiPoint) {
    coordinates = getMultiPointArray(geoJSON.coordinates);
    // geomType = LOCATION_TYPE_MULTIPOINT;
    // geomCollection = extractGeomsFromMultiGeoms(geometry);
  } else if (geometry.isMultiPolygon) {
    coordinates = getMultiPolygonPointArray(geoJSON.coordinates);
    // geomType = LOCATION_TYPE_MULTIPOLYGON;
    // geomCollection = extractGeomsFromMultiGeoms(geometry);
  } else if (geometry.isGeomCollection) {
    coordinates = getGeomCollectionPointArray(geoJSON.geometries);
    // geomType = LOCATION_TYPE_GEOMCOLLECTION;
    // geomCollection = geoJSON.geometries;
  }
*/

  if (geometry.isGeomCollection) {
    geometry.geomCollection = geoJSON;
    return geometry;
  }

  geometry.geomCollection = createGeomCollection(geoJSON, properties);

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

/*
  // If already GeoJSON return, else WKT
  if (typeof dataset.location === 'object') {
    return dataset.location;
  }
*/

  let location = {
    id: dataset.id,
    name: dataset.name,
    title: dataset.title,
  };

  if (dataset.spatial) {
    location.geoJSON = dataset.spatial;

    // parseJSON because the geoJOSN from CKAN might be invalid!
    if (typeof location.geoJSON === 'string') {
      try {
        location.geoJSON = JSON.parse(location.geoJSON);
      } catch (error) {
        console.error(`MetaDataFactory: geojson parsing error ${error}`);
      }
    }

    if (location.geoJSON) {
      const geomCollection = createGeomCollection(location.geoJSON,
      // const geometry = creationGeometry(location.geoJSON,
        {
          id: location.id,
          name: location.name,
          title: location.title,
        });

      location = {
        ...location,
        geomCollection,
      }
    }
  }

  return location;
}

export const defaultSwissLocation = {
  type: LOCATION_TYPE_GEOMCOLLECTION,
  geometries: [
    {
      type: LOCATION_TYPE_POLYGON,
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
  type: LOCATION_TYPE_GEOMCOLLECTION,
  geometries: [
    {
      type: LOCATION_TYPE_POLYGON,
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

export function fetureCollectionToGeoCollection(featureColl) {
  const features = featureColl?.features;

  if (!features) {
   return null;
  }

  const geometries = [];
  const properties = [];

  for (let i = 0; i < features.length; i++) {
    const f = features[i];
    if (f.properties) {
      properties.push(f.properties);
    }
    geometries.push(f.geometry);
  }

  return createGeomCollection(geometries, properties);
}

export function singlePointsToMultiPoints(geometries, asGeoCollection) {
  const multiPointCoords = []

  for (let i = 0; i < geometries.length; i++) {
    const geometry = geometries[i];
    multiPointCoords.push(geometry.coordinates);
  }

  const multiPointGeometry = {
    type: LOCATION_TYPE_MULTIPOINT,
    coordinates: multiPointCoords,
  }

  if (asGeoCollection) {
    return createGeomCollection(multiPointGeometry);
  }

  return multiPointGeometry;
}
