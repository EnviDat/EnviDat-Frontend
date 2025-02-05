import { it, describe, expect } from 'vitest';
import { createLocation, fetureCollectionToGeoCollection, singlePointsToMultiPoints } from '@/factories/geoFactory';
import {
  LOCATION_TYPE_FEATCOLLECTION,
  LOCATION_TYPE_FEATURE,
  LOCATION_TYPE_GEOMCOLLECTION,
  LOCATION_TYPE_MULTIPOINT,
  LOCATION_TYPE_MULTIPOLYGON,
  LOCATION_TYPE_POINT,
  LOCATION_TYPE_POLYGON,
} from '@/factories/metadataConsts';

import packagelist from '../../stories/testdata/packagelist.json';

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
    [8.7451171875, 46.89073198488606],
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
    { type: LOCATION_TYPE_POINT, coordinates: [100.0, 0.0] },
    {
      type: LOCATION_TYPE_POLYGON,
      coordinates: [[
        [102.0, 2.0],
        [103.0, 2.0],
        [103.0, 3.0],
        [102.0, 3.0],
        [102.0, 2.0],
      ]],
    },
    {
      type: LOCATION_TYPE_POLYGON,
      coordinates: [[
        [100.0, 0.0],
        [101.0, 0.0],
        [101.0, 1.0],
        [100.0, 1.0],
        [100.0, 0.0],
      ]],
    },
  ],
});

const geoJsonFeatureCollection = {
  type: LOCATION_TYPE_FEATCOLLECTION,
  features: [
    {
      'type': 'Feature',
      'geometry': { 'type': 'Point', 'coordinates': [8.563607, 46.554404] },
      'properties': { 'deployment_location': 1 },
    },
    {
      'type': 'Feature',
      'geometry': { 'type': 'Point', 'coordinates': [8.562377, 46.555487] },
      'properties': { 'deployment_location': 2 },
    },
    {
      'type': 'Feature',
      'geometry': { 'type': 'Point', 'coordinates': [8.561106, 46.556471] },
      'properties': { 'deployment_location': 3 },
    },
    {
      'type': 'Feature',
      'geometry': { 'type': 'Point', 'coordinates': [8.559837, 46.557518] },
      'properties': { 'deployment_location': 4 },
    },
    {
      'type': 'Feature',
      'geometry': { 'type': 'Point', 'coordinates': [8.558686, 46.558636] },
      'properties': { 'deployment_location': 5 },
    },
    {
      'type': 'Feature',
      'geometry': { 'type': 'Point', 'coordinates': [8.557429, 46.559656] },
      'properties': { 'deployment_location': 6 },
    },
    {
      'type': 'Feature',
      'geometry': { 'type': 'Point', 'coordinates': [8.564797, 46.553313] },
      'properties': { 'deployment_location': 7 },
    },
    {
      'type': 'Feature',
      'geometry': { 'type': 'Point', 'coordinates': [8.565399, 46.552803] },
      'properties': { 'deployment_location': 8 },
    },
    {
      'type': 'Feature',
      'geometry': { 'type': 'Point', 'coordinates': [8.554611, 46.562113] },
      'properties': { 'deployment_location': 9 },
    },
    {
      'type': 'Feature',
      'geometry': { 'type': 'Point', 'coordinates': [8.564458, 46.560828] },
      'properties': { 'deployment_location': 10 },
    },
  ],
}


const testFilledLocation = (loc) => {
  expect(loc).toBeDefined();
  expect(loc.id).toBeDefined();
  expect(loc.name).toBeDefined();
  expect(loc.title).toBeDefined();

  expect(loc.isPolygon).toBeDefined();
  expect(loc.isPoint).toBeDefined();
  expect(loc.isMultiPoint).toBeDefined();

  expect(loc.geomCollection).toBeDefined();
  expect(loc.geomCollection.geometries.length).toBeGreaterThan(0);

  expect(loc.geoJSON).toBeDefined();
  expect(loc.geomCollection).toBeDefined();
}

const raw4000Points = '{"type":"GeometryCollection","geometries":[{"type":"Point","coordinates":[8.66,47.11]},{"type":"Point","coordinates":[8.04,47.4]},{"type":"Point","coordinates":[8.75,47.29]},{"type":"Point","coordinates":[9.18,46.74]},{"type":"Point","coordinates":[7.67,46.87]},{"type":"Point","coordinates":[7.66,46.86]},{"type":"Point","coordinates":[7.25,47.16]},{"type":"Point","coordinates":[7.6,46.81]},{"type":"Point","coordinates":[8.57,46.62]},{"type":"Point","coordinates":[7.5,47.24]},{"type":"Point","coordinates":[7.43,47.22]},{"type":"Point","coordinates":[8.74,47.48]},{"type":"Point","coordinates":[8.72,47.48]},{"type":"Point","coordinates":[7.69,46.88]},{"type":"Point","coordinates":[7.69,46.87]},{"type":"Point","coordinates":[6.54,46.88]},{"type":"Point","coordinates":[7.77,46.96]},{"type":"Point","coordinates":[7.66,46.95]},{"type":"Point","coordinates":[9.86,46.49]},{"type":"Point","coordinates":[9.85,46.49]},{"type":"Point","coordinates":[8.07,47.3]},{"type":"Point","coordinates":[8.07,47.31]},{"type":"Point","coordinates":[6.71,46.58]},{"type":"Point","coordinates":[6.71,46.59]},{"type":"Point","coordinates":[6.7,46.58]},{"type":"Point","coordinates":[9.53,46.84]},{"type":"Point","coordinates":[7.19,46.89]},{"type":"Point","coordinates":[7.21,46.48]},{"type":"Point","coordinates":[7.9,47.34]},{"type":"Point","coordinates":[7,46.8]},{"type":"Point","coordinates":[7.73,46.8]},{"type":"Point","coordinates":[8.5,46.6]},{"type":"Point","coordinates":[7.97,47.38]},{"type":"Point","coordinates":[9.76,46.61]},{"type":"Point","coordinates":[7.19,47.13]},{"type":"Point","coordinates":[7.09,46.35]},{"type":"Point","coordinates":[7.2,46.7]},{"type":"Point","coordinates":[7.44,46.72]},{"type":"Point","coordinates":[8.52,47.42]},{"type":"Point","coordinates":[9.38,46.81]},{"type":"Point","coordinates":[8.6,47.37]},{"type":"Point","coordinates":[8.23,47.01]},{"type":"Point","coordinates":[7.25,47.17]},{"type":"Point","coordinates":[7.26,47.17]},{"type":"Point","coordinates":[7.17,46.94]},{"type":"Point","coordinates":[8.56,47.25]},{"type":"Point","coordinates":[8.73,47.48]},{"type":"Point","coordinates":[7.54,47.19]},{"type":"Point","coordinates":[7.53,47.19]},{"type":"Point","coordinates":[7.51,47.24]},{"type":"Point","coordinates":[7.93,47.27]},{"type":"Point","coordinates":[7.62,47.29]},{"type":"Point","coordinates":[8.12,47.37]},{"type":"Point","coordinates":[7.32,46.93]},{"type":"Point","coordinates":[7.29,46.95]},{"type":"Point","coordinates":[7.87,47.25]},{"type":"Point","coordinates":[6.56,46.88]},{"type":"Point","coordinates":[7.29,47.04]},{"type":"Point","coordinates":[7.26,47.16]},{"type":"Point","coordinates":[8.59,47.35]},{"type":"Point","coordinates":[8.15,47.39]},{"type":"Point","coordinates":[7.24,47.16]},{"type":"Point","coordinates":[7.18,46.89]},{"type":"Point","coordinates":[7.22,47.14]},{"type":"Point","coordinates":[7.76,46.84]},{"type":"Point","coordinates":[8.06,47.37]},{"type":"Point","coordinates":[9.03,47.65]},{"type":"Point","coordinates":[8.57,47.25]},{"type":"Point","coordinates":[7.9,47.36]},{"type":"Point","coordinates":[7.45,47.15]},{"type":"Point","coordinates":[7.45,46.96]},{"type":"Point","coordinates":[7.45,47.13]},{"type":"Point","coordinates":[7.42,47.11]},{"type":"Point","coordinates":[7.42,47.1]},{"type":"Point","coordinates":[7.92,47.36]},{"type":"Point","coordinates":[7.39,47.12]},{"type":"Point","coordinates":[7.38,47.1]},{"type":"Point","coordinates":[7.44,47.11]},{"type":"Point","coordinates":[7.6,47.21]},{"type":"Point","coordinates":[7.59,47.2]},{"type":"Point","coordinates":[7.59,47.18]},{"type":"Point","coordinates":[7.6,47.18]},{"type":"Point","coordinates":[7.63,47.21]},{"type":"Point","coordinates":[7.65,47.16]},{"type":"Point","coordinates":[7.62,47.16]},{"type":"Point","coordinates":[7.62,47.17]},{"type":"Point","coordinates":[7.63,47.17]},{"type":"Point","coordinates":[8.04,47.38]},{"type":"Point","coordinates":[8.05,47.38]},{"type":"Point","coordinates":[8.03,47.4]},{"type":"Point","coordinates":[8.58,47.38]},{"type":"Point","coordinates":[7.92,47.35]},{"type":"Point","coordinates":[7.92,47.37]},{"type":"Point","coordinates":[7.88,47.25]},{"type":"Point","coordinates":[7.87,47.26]},{"type":"Point","coordinates":[7.86,47.26]},{"type":"Point","coordinates":[8.29,47.05]},{"type":"Point","coordinates":[8.25,47.04]},{"type":"Point","coordinates":[8.09,47.18]},{"type":"Point","coordinates":[8.23,47.02]},{"type":"Point","coordinates":[8.22,47.03]},{"type":"Point","coordinates":[8.26,47]},{"type":"Point","coordinates":[8.26,46.99]},{"type":"Point","coordinates":[8.66,47.12]},{"type":"Point","coordinates":[8.67,47.13]},{"type":"Point","coordinates":[8.66,47.14]},{"type":"Point","coordinates":[7.89,47.34]},{"type":"Point","coordinates":[8.66,47.13]},{"type":"Point","coordinates":[8.65,47.15]},{"type":"Point","coordinates":[9.56,46.85]},{"type":"Point","coordinates":[9.55,46.85]},{"type":"Point","coordinates":[9.49,46.83]},{"type":"Point","coordinates":[8.37,46.85]},{"type":"Point","coordinates":[8.36,46.88]},{"type":"Point","coordinates":[8.35,46.9]},{"type":"Point","coordinates":[7.53,47.15]},{"type":"Point","coordinates":[7.54,47.15]},{"type":"Point","coordinates":[7.52,47.11]},{"type":"Point","coordinates":[7.52,47.1]},{"type":"Point","coordinates":[7.54,47.1]},{"type":"Point","coordinates":[7.55,47.02]},{"type":"Point","coordinates":[7.86,47.16]},{"type":"Point","coordinates":[7.86,47.15]},{"type":"Point","coordinates":[7.84,47.18]},{"type":"Point","coordinates":[7.83,47.19]},{"type":"Point","coordinates":[7.82,47.22]},{"type":"Point","coordinates":[7.74,47.25]},{"type":"Point","coordinates":[7.68,47.25]},{"type":"Point","coordinates":[7.22,46.97]},{"type":"Point","coordinates":[7.33,47.02]},{"type":"Point","coordinates":[7.32,47.09]},{"type":"Point","coordinates":[7.27,47.13]},{"type":"Point","coordinates":[7.29,47.15]},{"type":"Point","coordinates":[9.02,47.65]},{"type":"Point","coordinates":[7.75,47.02]},{"type":"Point","coordinates":[7.85,47.02]},{"type":"Point","coordinates":[7.86,47.02]},{"type":"Point","coordinates":[7.72,46.93]},{"type":"Point","coordinates":[7.34,46.76]},{"type":"Point","coordinates":[7.35,46.76]},{"type":"Point","coordinates":[7.34,46.72]},{"type":"Point","coordinates":[7.46,46.75]},{"type":"Point","coordinates":[7.42,46.95]},{"type":"Point","coordinates":[7.46,46.79]},{"type":"Point","coordinates":[7.64,47.2]},{"type":"Point","coordinates":[7.16,46.74]},{"type":"Point","coordinates":[8.31,46.91]},{"type":"Point","coordinates":[8.3,46.92]},{"type":"Point","coordinates":[8.16,46.78]},{"type":"Point","coordinates":[8.2,46.79]},{"type":"Point","coordinates":[8.18,46.77]},{"type":"Point","coordinates":[8.89,47.3]},{"type":"Point","coordinates":[8.88,47.3]},{"type":"Point","coordinates":[9.38,47.41]},{"type":"Point","coordinates":[7.68,47.49]},{"type":"Point","coordinates":[7.7,47.49]},{"type":"Point","coordinates":[7.55,47.47]},{"type":"Point","coordinates":[7.64,47.41]},{"type":"Point","coordinates":[7.5,47.26]},{"type":"Point","coordinates":[7.49,47.25]},{"type":"Point","coordinates":[7.17,47.46]},{"type":"Point","coordinates":[7.88,47.32]},{"type":"Point","coordinates":[6.15,46.44]},{"type":"Point","coordinates":[6.28,46.52]},{"type":"Point","coordinates":[6.27,46.52]},{"type":"Point","coordinates":[6.37,46.6]},{"type":"Point","coordinates":[6.49,46.72]},{"type":"Point","coordinates":[6.43,46.71]},{"type":"Point","coordinates":[6.39,46.7]},{"type":"Point","coordinates":[8.21,47.34]},{"type":"Point","coordinates":[8.73,47.51]},{"type":"Point","coordinates":[7.84,47.3]},{"type":"Point","coordinates":[8.71,47.5]},{"type":"Point","coordinates":[8.75,47.47]},{"type":"Point","coordinates":[8.87,47.42]},{"type":"Point","coordinates":[8.7,47.62]},{"type":"Point","coordinates":[8.76,47.29]},{"type":"Point","coordinates":[8.84,47.29]},{"type":"Point","coordinates":[8.83,47.29]},{"type":"Point","coordinates":[8.3,47.45]},{"type":"Point","coordinates":[8.35,47.51]},{"type":"Point","coordinates":[8.27,47.59]},{"type":"Point","coordinates":[8.02,47.55]},{"type":"Point","coordinates":[6.96,47.08]},{"type":"Point","coordinates":[6.73,47.01]},{"type":"Point","coordinates":[6.72,47]},{"type":"Point","coordinates":[6.78,47.1]},{"type":"Point","coordinates":[6.75,47.1]},{"type":"Point","coordinates":[6.46,46.91]},{"type":"Point","coordinates":[6.48,46.91]},{"type":"Point","coordinates":[6.53,46.88]},{"type":"Point","coordinates":[6.81,46.96]},{"type":"Point","coordinates":[8.15,47.4]},{"type":"Point","coordinates":[8.74,47.47]},{"type":"Point","coordinates":[8.05,47.37]},{"type":"Point","coordinates":[7.84,47.31]},{"type":"Point","coordinates":[7.35,46.91]},{"type":"Point","coordinates":[7.39,47.13]},{"type":"Point","coordinates":[8.52,47.51]},{"type":"Point","coordinates":[8.53,47.5]},{"type":"Point","coordinates":[7.18,46.92]},{"type":"Point","coordinates":[7.75,46.73]},{"type":"Point","coordinates":[6.22,46.56]},{"type":"Point","coordinates":[7.73,46.83]},{"type":"Point","coordinates":[8.26,47.34]},{"type":"Point","coordinates":[8.88,47.62]},{"type":"Point","coordinates":[7.87,47.29]},{"type":"Point","coordinates":[7.88,47.28]},{"type":"Point","coordinates":[8.87,47.67]},{"type":"Point","coordinates":[9.41,47.43]},{"type":"Point","coordinates":[9.4,47.42]},{"type":"Point","coordinates":[9.42,47.41]},{"type":"Point","coordinates":[9.26,47.37]},{"type":"Point","coordinates":[9.24,47.37]},{"type":"Point","coordinates":[7.18,46.91]},{"type":"Point","coordinates":[8.84,47.68]},{"type":"Point","coordinates":[7.23,47.16]},{"type":"Point","coordinates":[7.24,47.15]},{"type":"Point","coordinates":[8.84,47.24]},{"type":"Point","coordinates":[8.82,47.24]},{"type":"Point","coordinates":[8.69,47.47]},{"type":"Point","coordinates":[8.68,47.47]},{"type":"Point","coordinates":[8.68,47.46]},{"type":"Point","coordinates":[8.66,47.71]},{"type":"Point","coordinates":[8.66,47.43]},{"type":"Point","coordinates":[6.87,46.51]},{"type":"Point","coordinates":[8.02,47.37]},{"type":"Point","coordinates":[8.02,47.38]},{"type":"Point","coordinates":[8.66,47.69]},{"type":"Point","coordinates":[7.07,46.6]},{"type":"Point","coordinates":[7.08,46.61]},{"type":"Point","coordinates":[7.08,46.63]},{"type":"Point","coordinates":[6.91,46.72]},{"type":"Point","coordinates":[6.92,46.73]},{"type":"Point","coordinates":[7.93,46.63]},{"type":"Point","coordinates":[8.18,46.79]},{"type":"Point","coordinates":[8.31,46.92]},{"type":"Point","coordinates":[8.29,46.93]},{"type":"Point","coordinates":[8.27,46.86]},{"type":"Point","coordinates":[9.01,47.18]},{"type":"Point","coordinates":[8.25,46.86]},{"type":"Point","coordinates":[7.91,47.36]},{"type":"Point","coordinates":[7.98,47.37]},{"type":"Point","coordinates":[8.01,47.37]},{"type":"Point","coordinates":[7.9,47.38]},{"type":"Point","coordinates":[7.99,47.38]},{"type":"Point","coordinates":[8.07,47.38]},{"type":"Point","coordinates":[8.14,47.18]},{"type":"Point","coordinates":[8.26,47.04]},{"type":"Point","coordinates":[9.49,46.82]},{"type":"Point","coordinates":[7.61,47.05]},{"type":"Point","coordinates":[7.81,47.21]},{"type":"Point","coordinates":[7.1,47.08]},{"type":"Point","coordinates":[7.42,47.22]},{"type":"Point","coordinates":[7.91,47.28]},{"type":"Point","coordinates":[9.11,47.44]},{"type":"Point","coordinates":[7.23,47.15]},{"type":"Point","coordinates":[7.21,47.14]},{"type":"Point","coordinates":[7.24,47.14]},{"type":"Point","coordinates":[9.55,46.88]},{"type":"Point","coordinates":[9.54,46.88]},{"type":"Point","coordinates":[9.55,46.87]},{"type":"Point","coordinates":[9.57,46.97]},{"type":"Point","coordinates":[9.56,46.87]},{"type":"Point","coordinates":[9.98,46.6]},{"type":"Point","coordinates":[9.79,46.44]},{"type":"Point","coordinates":[10.17,46.77]},{"type":"Point","coordinates":[9.97,46.6]},{"type":"Point","coordinates":[10.17,46.78]},{"type":"Point","coordinates":[9.52,47.02]},{"type":"Point","coordinates":[9.53,46.93]},{"type":"Point","coordinates":[9.6,46.6]},{"type":"Point","coordinates":[9.58,46.67]},{"type":"Point","coordinates":[8.02,46.28]},{"type":"Point","coordinates":[7.37,46.2]},{"type":"Point","coordinates":[7.44,46.22]},{"type":"Point","coordinates":[7.1,46.09]},{"type":"Point","coordinates":[7.14,46.08]},{"type":"Point","coordinates":[8.21,47.02]},{"type":"Point","coordinates":[8.19,47.37]},{"type":"Point","coordinates":[9.71,46.7]},{"type":"Point","coordinates":[9.86,46.53]},{"type":"Point","coordinates":[9.47,47.46]},{"type":"Point","coordinates":[7.01,46.8]},{"type":"Point","coordinates":[8.31,47.36]},{"type":"Point","coordinates":[8.31,47.35]},{"type":"Point","coordinates":[8.29,47.3]},{"type":"Point","coordinates":[8.36,47.47]},{"type":"Point","coordinates":[8.45,47.13]},{"type":"Point","coordinates":[8.09,47.28]},{"type":"Point","coordinates":[8.06,47.29]},{"type":"Point","coordinates":[7.65,46.95]},{"type":"Point","coordinates":[7.25,47.15]},{"type":"Point","coordinates":[8.4,47.08]},{"type":"Point","coordinates":[7,46.79]},{"type":"Point","coordinates":[6.65,46.55]},{"type":"Point","coordinates":[6.6,46.57]},{"type":"Point","coordinates":[8.47,47.13]},{"type":"Point","coordinates":[8.57,47.23]},{"type":"Point","coordinates":[6.93,46.42]},{"type":"Point","coordinates":[8.55,47.26]},{"type":"Point","coordinates":[8.59,47.37]},{"type":"Point","coordinates":[8.37,46.97]},{"type":"Point","coordinates":[7.11,46.61]},{"type":"Point","coordinates":[8.6,47.7]},{"type":"Point","coordinates":[9.59,46.95]},{"type":"Point","coordinates":[6.75,46.73]},{"type":"Point","coordinates":[6.75,46.72]},{"type":"Point","coordinates":[7.89,47.26]},{"type":"Point","coordinates":[9.41,47.45]},{"type":"Point","coordinates":[9.01,47.65]},{"type":"Point","coordinates":[9.06,47.16]},{"type":"Point","coordinates":[8.55,47.28]},{"type":"Point","coordinates":[8.55,47.27]},{"type":"Point","coordinates":[9.06,47.15]},{"type":"Point","coordinates":[8.56,47.26]},{"type":"Point","coordinates":[8.57,47.39]},{"type":"Point","coordinates":[7.96,47.3]},{"type":"Point","coordinates":[8.1,47.17]},{"type":"Point","coordinates":[8.32,46.96]},{"type":"Point","coordinates":[8.35,46.97]},{"type":"Point","coordinates":[8.38,46.98]},{"type":"Point","coordinates":[8.46,47]},{"type":"Point","coordinates":[8.4,46.9]},{"type":"Point","coordinates":[8.4,46.91]},{"type":"Point","coordinates":[7.85,47.35]},{"type":"Point","coordinates":[8.39,46.89]},{"type":"Point","coordinates":[8.38,46.87]},{"type":"Point","coordinates":[8.48,46.79]},{"type":"Point","coordinates":[8.37,46.87]},{"type":"Point","coordinates":[7.6,47.08]},{"type":"Point","coordinates":[7.64,47.09]},{"type":"Point","coordinates":[7.63,47.07]},{"type":"Point","coordinates":[7.58,47.05]},{"type":"Point","coordinates":[7.82,47.23]},{"type":"Point","coordinates":[7.68,47.29]},{"type":"Point","coordinates":[7.69,47.29]},{"type":"Point","coordinates":[7.23,46.97]},{"type":"Point","coordinates":[7.1,47.09]},{"type":"Point","coordinates":[7.11,47.09]},{"type":"Point","coordinates":[7.43,46.96]},{"type":"Point","coordinates":[7.3,46.92]},{"type":"Point","coordinates":[6.77,46.73]},{"type":"Point","coordinates":[8.59,46.97]},{"type":"Point","coordinates":[8.59,46.96]},{"type":"Point","coordinates":[7.75,47.38]},{"type":"Point","coordinates":[7.74,47.37]},{"type":"Point","coordinates":[7.77,47.36]},{"type":"Point","coordinates":[7.97,47.3]},{"type":"Point","coordinates":[7.77,47.35]},{"type":"Point","coordinates":[7.53,47.47]},{"type":"Point","coordinates":[7.49,47.47]},{"type":"Point","coordinates":[7.49,47.46]},{"type":"Point","coordinates":[7.47,47.46]},{"type":"Point","coordinates":[7.45,47.45]},{"type":"Point","coordinates":[7.59,47.36]},{"type":"Point","coordinates":[7.44,47.43]},{"type":"Point","coordinates":[7.96,47.29]},{"type":"Point","coordinates":[7.45,47.23]},{"type":"Point","coordinates":[7.05,47.42]},{"type":"Point","coordinates":[7.05,47.43]},{"type":"Point","coordinates":[7.16,47.46]},{"type":"Point","coordinates":[7.08,47.45]},{"type":"Point","coordinates":[7.03,47.38]},{"type":"Point","coordinates":[7.16,47.34]},{"type":"Point","coordinates":[6.21,46.46]},{"type":"Point","coordinates":[6.29,46.54]},{"type":"Point","coordinates":[6.36,46.61]},{"type":"Point","coordinates":[6.38,46.72]},{"type":"Point","coordinates":[8.16,47.37]},{"type":"Point","coordinates":[8.17,47.29]},{"type":"Point","coordinates":[8.38,47.21]},{"type":"Point","coordinates":[8.76,47.45]},{"type":"Point","coordinates":[8.27,47.52]},{"type":"Point","coordinates":[8.09,47.52]},{"type":"Point","coordinates":[7.97,47.29]},{"type":"Point","coordinates":[6.75,47.09]},{"type":"Point","coordinates":[6.56,46.92]},{"type":"Point","coordinates":[6.77,46.97]},{"type":"Point","coordinates":[8.62,47.51]},{"type":"Point","coordinates":[6.74,46.87]},{"type":"Point","coordinates":[7.92,47.32]},{"type":"Point","coordinates":[7.91,47.32]},{"type":"Point","coordinates":[7.91,47.33]},{"type":"Point","coordinates":[7.95,47.29]},{"type":"Point","coordinates":[7.95,47.3]},{"type":"Point","coordinates":[9.03,47.34]},{"type":"Point","coordinates":[7.15,46.94]},{"type":"Point","coordinates":[8.58,47.66]},{"type":"Point","coordinates":[7.16,46.94]},{"type":"Point","coordinates":[6.75,46.87]},{"type":"Point","coordinates":[8.6,47.54]},{"type":"Point","coordinates":[7.2,47.14]},{"type":"Point","coordinates":[7.24,47.17]},{"type":"Point","coordinates":[9.06,47.14]},{"type":"Point","coordinates":[8.59,47.54]},{"type":"Point","coordinates":[7.98,47.42]},{"type":"Point","coordinates":[9.06,47.18]},{"type":"Point","coordinates":[6.66,46.6]},{"type":"Point","coordinates":[6.67,46.6]},{"type":"Point","coordinates":[6.69,46.64]},{"type":"Point","coordinates":[6.84,46.51]},{"type":"Point","coordinates":[7.08,46.62]},{"type":"Point","coordinates":[7.91,46.62]},{"type":"Point","coordinates":[7.87,46.69]},{"type":"Point","coordinates":[8.14,46.76]},{"type":"Point","coordinates":[7.44,47.14]},{"type":"Point","coordinates":[8.25,46.88]},{"type":"Point","coordinates":[8.22,46.85]},{"type":"Point","coordinates":[8.21,46.84]},{"type":"Point","coordinates":[8.21,46.85]},{"type":"Point","coordinates":[7.43,47.11]},{"type":"Point","coordinates":[9.07,47.16]},{"type":"Point","coordinates":[8.12,47.35]},{"type":"Point","coordinates":[8.13,47.35]},{"type":"Point","coordinates":[8.06,47.31]},{"type":"Point","coordinates":[6.82,46.97]},{"type":"Point","coordinates":[6.82,46.96]},{"type":"Point","coordinates":[7.1,46.91]},{"type":"Point","coordinates":[7.16,46.95]},{"type":"Point","coordinates":[8.74,47.51]},{"type":"Point","coordinates":[6.62,46.69]},{"type":"Point","coordinates":[6.87,46.39]},{"type":"Point","coordinates":[7.05,46.9]},{"type":"Point","coordinates":[10.21,46.66]},{"type":"Point","coordinates":[10.24,46.66]},{"type":"Point","coordinates":[8.3,47.36]},{"type":"Point","coordinates":[8.26,47.37]},{"type":"Point","coordinates":[7.8,47.29]},{"type":"Point","coordinates":[9.23,47.62]},{"type":"Point","coordinates":[6.6,46.69]},{"type":"Point","coordinates":[7.93,47.37]},{"type":"Point","coordinates":[6.69,46.53]},{"type":"Point","coordinates":[8.39,47.47]},{"type":"Point","coordinates":[8.49,47.42]},{"type":"Point","coordinates":[8.1,47.41]},{"type":"Point","coordinates":[8.28,47.43]},{"type":"Point","coordinates":[7.03,47.11]},{"type":"Point","coordinates":[8.21,47.03]},{"type":"Point","coordinates":[8.61,47.51]},{"type":"Point","coordinates":[7.56,47.23]}],"properties":{"name":"a-dataset-of-40000-trees-with-section-wise-measured-stem-diameter-and-length-and"}}';

const dataset = packagelist.result[6];

describe('geoFactory - creationLocation', () => {

  it('empty', () => {
    const loc = createLocation(undefined);
    expect(loc).toBeNull();
  });

  it('with mock data point', () => {
    const loc = createLocation({ ...dataset, spatial: metaPoint });
    testFilledLocation(loc);
  });

  it('with mock data polygon', () => {
    const loc = createLocation({ ...dataset, spatial: metaPolygon });
    testFilledLocation(loc);
  });

  it('with mock data multi point', () => {
    const loc = createLocation({ ...dataset, spatial: metaMultiPoint });
    testFilledLocation(loc);
  });

  it('with mock data multi polygon', () => {
    const loc = createLocation({ ...dataset, spatial: metaMultiPolygon });
    testFilledLocation(loc);
  });

  it('with mock data geom collection', () => {
    const loc = createLocation({ ...dataset, spatial: metaGeomCollection });
    testFilledLocation(loc);
  });

  it('with dataset', () => {
    const loc = createLocation(dataset);
    testFilledLocation(loc);
  });

});

describe('geoFactory - merge geometry ', () => {

  it('into geo collection', () => {

    const exitingLocation = createLocation({ ...dataset, spatial: metaPoint });

    const geoCollection = fetureCollectionToGeoCollection(geoJsonFeatureCollection, {
      name: exitingLocation.name,
    });

    expect(geoCollection).toBeDefined();
    expect(geoCollection.type).equals(LOCATION_TYPE_GEOMCOLLECTION)
    expect(geoCollection.geometries.length).greaterThan(0);

    console.log(JSON.stringify(geoCollection));
  });

});

describe('geoFactory - convert geometry', () => {

  it('test single to multipoint conversion', () => {
    const location = createLocation({
      id: 'testing4000',
      title: 'testing4000',
      name: 'testing4000',
      spatial: raw4000Points,
    });

    const multiPointGeometry = singlePointsToMultiPoints(location.geomCollection.geometries)

    console.log(multiPointGeometry);
    expect(multiPointGeometry).toBeDefined();
    expect(multiPointGeometry.type === LOCATION_TYPE_MULTIPOINT).toBeTruthy()
    expect(multiPointGeometry.coordinates instanceof Array).toBeTruthy()
    expect(multiPointGeometry.coordinates.length).toBeGreaterThan(0)
  });

})
