const fs = require('fs');

const inputPath = `${__dirname}/../../public/testdata/`;
const userListPath = `${inputPath}gendib_13_12_2023.json`;
const geoJSONContent = require(userListPath);

const outputFileName = 'gendib_small.json';
const outputPath = `${__dirname}/../../public/testdata/`;

const smallGeoJsonProperties = ['gendib_id', 'gendib_pop_id'];

function extractProperties(geoJsonData) {
  const features = geoJsonData.features;
  const dataWithProps = {};

  for (let i = 0; i < features.length; i++) {
    const feat = features[i];
    const props = feat.properties;

    dataWithProps[props.gendib_pop_id] = props;
  }

  console.log(`extracted ${Object.keys(dataWithProps).length} property entries`);

  return dataWithProps;
}

function extractGeoJsonSubset(geoJsonData, extractProps) {
  const features = geoJsonData.features;
  const smallFeatures = [];

  for (let i = 0; i < features.length; i++) {
    const feat = features[i];
    const smallprops = {};

    for (let j = 0; j < extractProps.length; j++) {
      const prop = extractProps[j];
      smallprops[prop] = feat.properties[prop];
    }

    smallFeatures.push({
      type: 'Feature',
      properties: smallprops,
      geometry: feat.geometry,
    });
  }

  console.log(`extracted ${smallFeatures.length} smallFeatures`);

  return {
    type: 'FeatureCollection',
    name: 'gendib_13_12_2023',
    crs: {
      type: 'name',
      properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
    },
    features: smallFeatures,
  };
}

function writeDataToFile(data, fileName) {
  fs.writeFileSync(fileName, data, (err) => {
    if (err) {
      return console.log(err);
    }

    return console.log(`Users extracted to ${outputPath}${fileName}. Wrote ${data.length} lines.`);
  });
}

// const extraction = extractGeoJsonSubset(geoJSONContent, smallGeoJsonProperties);
const extraction = extractProperties(geoJSONContent);

writeDataToFile(JSON.stringify(extraction), outputPath + outputFileName);
