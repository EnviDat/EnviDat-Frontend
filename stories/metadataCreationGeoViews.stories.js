/* eslint-disable object-property-newline */
/**
 * @summary story of all the MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho and Sam Woodcock
 *
 * Created on     : 2019-10-23
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import EditDataGeo from '@/modules/user/components/EditDataGeo.vue';

import { createLocation } from '@/factories/geoFactory';
import {
  LOCATION_TYPE_GEOMCOLLECTION,
  LOCATION_TYPE_MULTIPOINT,
  LOCATION_TYPE_MULTIPOLYGON,
  LOCATION_TYPE_POINT,
  LOCATION_TYPE_POLYGON,
} from '@/factories/metadataConsts';



const testMetadata = {
  id: 1,
  name: 'test_site',
  title: 'Test Site',
};

const metaPoint = JSON.stringify({
  type: LOCATION_TYPE_POINT,
  coordinates: [7.435198, 46.268368],
});

const metaPolygon = JSON.stringify({
  type: LOCATION_TYPE_POLYGON,
  coordinates: [
    [
      [8.7451171875, 46.89073198488606],
      [17.4462890625, 51.971796908939176],
      [28.388671875, 57.42208294734931],
      [23.73046875, 59.086490948368436],
      [4.658203125, 52.24170452760525],
      [0.2197265625, 48.80734571355101],
      [8.7451171875, 46.89073198488606],
    ],
  ],
});

const metaMultiPoint = JSON.stringify({
  type: LOCATION_TYPE_MULTIPOINT,
  coordinates: [
    [8.7451171875, 46.89073198488606],
    [17.4462890625, 51.971796908939176],
    [28.388671875, 57.42208294734931],
    [23.73046875, 59.086490948368436],
    [4.658203125, 52.24170452760525],
    [0.2197265625, 48.80734571355101],
  ],
});

const metaMultiPolygon = JSON.stringify({
  type: LOCATION_TYPE_MULTIPOLYGON,
  coordinates: [
    [
      [
        [102.0, 2.0],
        [103.0, 2.0],
        [103.0, 3.0],
        [102.0, 3.0],
        [102.0, 2.0],
      ],
    ],
    [
      [
        [100.0, 0.0],
        [101.0, 0.0],
        [101.0, 1.0],
        [100.0, 1.0],
        [100.0, 0.0],
      ],
    ],
  ],
});

const metaGeomCollection = JSON.stringify({
  type: LOCATION_TYPE_GEOMCOLLECTION,
  geometries: [
    { type: LOCATION_TYPE_POINT, coordinates: [7.435198, 46.268368] },
    {
      type: LOCATION_TYPE_POLYGON,
      coordinates: [
        [
          [8.7451171875, 46.89073198488606],
          [17.4462890625, 51.971796908939176],
          [28.388671875, 57.42208294734931],
          [23.73046875, 59.086490948368436],
          [4.658203125, 52.24170452760525],
          [0.2197265625, 48.80734571355101],
          [8.7451171875, 46.89073198488606],
        ],
      ],
    },
  ],
});

const geoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [8.563607, 46.554404] },
      properties: { deployment_location: 1 },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [8.562377, 46.555487] },
      properties: { deployment_location: 2 },
    },
  ],
};

const pointLocation = createLocation({ ...testMetadata, spatial: metaPoint });
const polygonLocation = createLocation({
  ...testMetadata,
  spatial: metaPolygon,
});

const multiPointLocation = createLocation({
  ...testMetadata,
  spatial: metaMultiPoint,
});

const multiPolygonLocation = createLocation({
  ...testMetadata,
  spatial: metaMultiPolygon,
});

const geomCollectionLocation = createLocation({
  ...testMetadata,
  spatial: metaGeomCollection,
});

const geoJsonFeatureLocation = createLocation({
  ...testMetadata,
  spatial: geoJsonFeatureCollection,
});

const geojsonErrorPolygon = JSON.stringify({
  type: LOCATION_TYPE_POLYGON,
  coordinates: [
    [],
    [],
    [
      [8.7451171875, 46.89073198488606],
      [17.4462890625, 51.971796908939176],
      [28.388671875, 57.42208294734931],
      [23.73046875, 59.086490948368436],
      [4.658203125, 52.24170452760525],
      [0.2197265625, 48.80734571355101],
      [8.7451171875, 46.89073198488606],
    ],
  ],
});

const geoJsonErrorLocation = createLocation({
  ...testMetadata,
  spatial: geojsonErrorPolygon,
});


const multiPolygonError = '{"type":"GeometryCollection","geometries":[{"type":"Polygon","coordinates":[[[8.419304,46.608177],[8.421364,46.638122],[8.457413,46.639773],[8.464279,46.609592],[8.419304,46.608177]]]},{"type":"Polygon","coordinates":[[[9.937134,46.472862],[9.937134,46.534776],[10.016785,46.534776],[10.016785,46.472862],[9.937134,46.472862]]]},{"type":"Polygon","coordinates":[[[-16.858521,81.493931],[-16.858521,81.578822],[-16.221313,81.578822],[-16.221313,81.493931],[-16.858521,81.493931]]]},{"type":"Polygon","coordinates":[[[14.018555,78.134493],[14.018555,79.253586],[20.961914,79.253586],[20.961914,78.134493],[14.018555,78.134493]]]},{"type":"Polygon","coordinates":[[[89.648438,77.934055],[89.648438,81.255032],[106.962891,81.255032],[106.962891,77.934055],[89.648438,77.934055]]]}],"properties":{"name":"life-at-chilly-temperatures---a-collection-of-microorganisms-from-extreme-habita"}}';

const multiPolyErrorLocation = createLocation({
  ...testMetadata,
  spatial: multiPolygonError,
});

export default {
  title: '3 Datasets / 2 Edit / Geo Data',
  component: EditDataGeo,
};

export const Point = {
  args: {
    mapDivId: 'point-map-small',
    location: pointLocation,
  },
};

export const Polygon = {
  args: {
    mapDivId: 'polygon-map-small',
    location: polygonLocation,
  },
};

export const MultiPoint = {
  args: {
    mapDivId: 'multipoint-map-small',
    location: multiPointLocation,
  },
};

export const MultiPolygon = {
  args: {
    mapDivId: 'multipolygon-map-small',
    location: multiPolygonLocation,
  },
};

export const GeoGeometryCollection = {
  args: {
    mapDivId: 'geometrycollection-map',
    location: geomCollectionLocation,
  },
};

export const FeatrueCollection = {
  args: {
    label: 'EditDataGeo with FeatureCollection',
    mapDivId: 'featureCollection-map',
    location: geoJsonFeatureLocation,
  },
};

export const GeoJSONError = {
  args: {
    label: 'EditDataGeo with FeatureCollection',
    mapDivId: 'geoJSONError-map',
    location: geoJsonErrorLocation,
  },
};

export const GeoJSONMultiPolyError = {
  args: {
    label: 'EditDataGeo with FeatureCollection',
    mapDivId: 'geoJSONError-map',
    location: multiPolyErrorLocation,
  },
};


