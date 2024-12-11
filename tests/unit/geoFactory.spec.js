import { it, describe, expect } from 'vitest';
import { createLocation, fetureCollectionToGeoCollection } from '@/factories/geoFactory';
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
