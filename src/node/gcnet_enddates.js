const fs = require('fs');
// const JSONStream = require('JSONStream');

// eslint-disable-next-line import/no-dynamic-require
// const packagelist = require(packagePath);
const axios = require('axios');
const dateFns = require('date-fns');
// const StreamArray = require('stream-json/streamers/StreamArray');

const packagePath = `${__dirname}/../../public`;
const stationConfigFile = `${packagePath}/testdata/stationsConfig.json`;

/*
const stations = ['gits', 'humboldt', 'petermann', 'tunu_n', 'swisscamp_10m_tower', 'swisscamp', 'crawfordpoint', 'nasa_u', 'summit', 'dye2', 'jar1', 'saddle', 'southdome', 'nasa_east', 'nasa_southeast', 'neem', 'east_grip'];
const parameters = ['airtemp1', 'windspeed1', 'winddir1', 'rh1', 'netrad', 'sh1', 'pressure', 'battvolt'];
const startDateUrl = new Date('01-01-2015');
const startIso = dateFns.formatISO(startDateUrl);
const endDateUrl = new Date(Date.now());
const endIso = dateFns.formatISO(endDateUrl);
*/

// const urlGrip = 'https://www.envidat.ch/data-api/gcnet/json/swisscamp/start/empty/end/empty/';
// const baseUrl = 'https://www.envidat.ch/data-api/gcnet/json';
// 'https://www.envidat.ch/data-api/gcnet/json/swisscamp/airtemp1/1990-11-04T17:00:00/2022-06-14T00:00:00/'

const metadataBaseUrl = 'https://www.envidat.ch/data-api/gcnet/metadata';
let stationAmount = 0;
const metadataMap = new Map();

const readStationConfig = () => {

  try {
    console.log(`Reading data from file ${stationConfigFile}`);
    const content = fs.readFileSync(stationConfigFile);
    const contentString = content.toString();
    return JSON.parse(contentString);

  } catch (err) {
    console.error(`read file error: ${err}`);
  }

  return null;
};

const stationConfig = readStationConfig();

const getMetadata = (station, callback) => {

  const url = `${metadataBaseUrl}/${station}/multiple/`;

  console.log(`Loading metadata from ${url}`);

  axios.get(url).then((res) => {

    callback(res.data);

  }).catch((err) => {
    console.error(`${station} has error: ${err}`);
  });
};

const saveMetadataForStations = (stationConfig, callback) => {

  if (!stationConfig) {
    console.log('Not stationConfig to work with!');
    return;
  }

  stationAmount = stationConfig.length;

  for (let i = 0; i < stationConfig.length; i++) {

    const configEntry = stationConfig[i];

    console.log(`Saving metadata for ${configEntry.aliasApi}`);

    getMetadata(configEntry.aliasApi, (data) => {

      metadataMap.set(configEntry.aliasApi, data);
      console.log(`Saved metadata for ${configEntry.aliasApi}`);

      if (metadataMap.size >= stationAmount) {
        callback();
      }
    });
  }

};

const extractDates = (data) => {

  const parameterDates = [];
  const keys = Object.keys(data);

  // console.log(data);

  for (let j = 0; j < keys.length; j++) {

    const metadataProperty = keys[j];
    const metadataValue = data[metadataProperty];

    // console.log(`metadataProperty ${metadataProperty} ${typeof metadataValue}`);

    if (typeof metadataValue === 'object') {

      parameterDates.push({
        parameter: metadataProperty,
        timestamp_iso_earliest: metadataValue.timestamp_iso_earliest,
        timestamp_iso_latest: metadataValue.timestamp_iso_latest,
      });
    }

  }

  /*
        console.log(`Loaded parameterDates for ${configEntry.aliasApi}`);
        console.log(parameterDates);
  */

  return parameterDates;
};

const updateStationConfig = () => {

  for (let i = 0; i < stationConfig.length; i++) {
    const configEntry = stationConfig[i];

    const metadata = metadataMap.get(configEntry.aliasApi);
    let parameterDates = null;

    if (metadata) {
      parameterDates = extractDates(metadata);

      configEntry.envidatConfig.parameterDates = parameterDates;
    }
  }

  try {
    const string = JSON.stringify(stationConfig);
    fs.writeFileSync(stationConfigFile, string);

  } catch (e) {
    console.error(`Error writing the stationConfig file: ${e}`);
  }

};

// saveMetadataForStations(stationConfig, updateStationConfig);


/*

function getParameterDate(param, currentStation) {
  const matches = currentStation.envidatConfig.parameterDates.filter(dateObj => dateObj.parameter === param);
  return matches[0];
}

function getHistoricalEndDate(parameters, configEntry) {

  if (!parameters || parameters.length <= 0) {
    return undefined;
  }

  let endDate = null;

  for (let i = 0; i < parameters.length; i++) {
    const param = parameters[i];

    const paramObj = getParameterDate(param, configEntry);

    const isoDate = paramObj.timestamp_iso_latest;

    if (isoDate) {
      const stringDate = isoDate.substr(0, isoDate.length - 1);
      const date = dateFns.parseISO(stringDate);
      // console.log(`parsed ${stringDate} to ${date}`);
      // console.log(`is ${date} after ${dateFns.isAfter(date, endDate)}`);

      if (endDate === null || dateFns.isAfter(date, endDate)) {
        endDate = date;
      }
    }
  }

  console.log(`endDate ${dateFns.formatISO(endDate)}`);

  return dateFns.formatISO(endDate);
}


const testHistoricalDate = () => {
  for (let i = 0; i < stationConfig.length; i++) {

    const configEntry = stationConfig[i];
    console.log(`Testing historical date for ${configEntry.aliasApi}`);

    const hEndDate = getHistoricalEndDate([
      'airtemp1',
      'airtemp2',
    ], configEntry);

    console.log(`historical date \t ${hEndDate}`);
  }
};

testHistoricalDate();

*/


/*
const dateMap = new Map();
let lastEndDate = null;

const fetchGCNetData = function fetchGCNetData(station, url, callback) {

  const stationFile = `${packagePath}/${station}`;
  let data = null;

  if (fs.existsSync(stationFile)) {
    try {

      console.log(`Reading data from file ${stationFile}`);

      callback(data);

      return;
    } catch (err) {
      console.error(`read file error: ${err}`);
    }
  }

  console.log(`Fetching data for ${station} ${url}`);

  axios.get(url).then((res) => {

    try {
      const content = JSON.stringify(res.data);
      fs.writeFileSync(stationFile, content);
      console.log(`Writing data to file ${stationFile}`);
    } catch (err) {
      console.error(`write file error: ${err}`);
    }

    callback(station, res.data);

  }).catch((err) => {
    console.error(err);
  });
};
*/


/*
function getStationJSONUrls(stations, baseUrl, startDateUrl, endDateUrl) {

  const stationUrlMap = new Map();

  for (let i = 0; i < stations.length; i++) {

    const station = stations[i];
    const jsonUrl = `${baseUrl}/${station}/multiple/${startDateUrl}/${endDateUrl}/`;

    // console.log(jsonUrl);
    stationUrlMap.set(station, jsonUrl);
  }

  return stationUrlMap;
}

function updateDateMap(station, parameter, newDate) {
  const index = `${station}_${parameter}`;
  let date = dateMap.get(index);

  let updated = false;

  // console.log(`date ${date} \t newDate ${newDate} \t after ${dateFns.isAfter(newDate, date)}`);
  if (date === undefined || dateFns.isAfter(newDate, date)) {
    date = newDate;
    updated = true;
  }

  // console.log(`dateMap entry: ${index} \t ${dateFns.formatISO(date)}`);
  dateMap.set(index, date);

  return updated;
}


const checkDates = (station, entry, parametersNeedUpdate) => {

  if (!parametersNeedUpdate.includes(true)) {
    return;
  }

  const time = new Date(entry.timestamp);

  for (let j = 0; j < parameters.length; j++) {

    const parm = parameters[j];

    // if (parametersNeedUpdate[j] && parm && entry[parm]) {
      if (parm && entry[parm]) {

      // console.log(`check ${parm} \t ${entry[parm]} ? \t ${parametersNeedUpdate[j]} \t ${lastEndDate}`);
      // const isoTime = dateFns.formatISO(time);

      // console.log(`check ${parm} ${time} ${lastEndDate} ${dateFns.isAfter(lastEndDate, time)}`);

      if (updateDateMap(station, parm, time)) {
        // parametersNeedUpdate[j] = false;
        // console.log(`${station} ${parm} time ${time}`);
      }

    }

  }

  lastEndDate = time;

};

function updateEndDates(station, data) {

  const lastIndex = data.length - 1;

  for (let i = lastIndex; i > 0; i--) {
    const entry = data[i];
    checkDates(station, entry);
  }

}
*/

// const stationUrlMap = getStationJSONUrls(stations, baseUrl, startIso, endIso);

/*
const writeDateMapToFile = () => {
  const fileName = 'endDates.txt';
  let content = '';
  const keys = dateMap.keys();
  console.log(keys);

  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    content += `${k} \t ${dateMap.get(k)} \n`;
  }

  console.log(content);

  try {

    fs.writeFileSync(
      `${packagePath}/${fileName}`,
      content,
    );
  } catch (e) {
    console.error(e);
  }
};
*/

/*
const processFiles = (index) => {

  const station = stations[index];
  if (!station) {
    // console.log(dateMap);
    writeDateMapToFile();
    return;
  }

  const stationFile = `${packagePath}/${station}`;

  if (fs.existsSync(stationFile)) {
    try {

      lastEndDate = null;
      console.log(`start processing ${station}`);
      const parametersNeedUpdate = [];

      for (let i = 0; i < parameters.length; i++) {
        parametersNeedUpdate.push(true);
      }

      console.log(`Reading data from file ${stationFile}`);

      const jsonStream = StreamArray.withParser();

      // internal Node readable stream option, pipe to stream-json to convert it for us
      fs.createReadStream(stationFile).pipe(jsonStream.input);

      // You'll get json objects here
      // Key is the array-index here
      jsonStream.on('data', ({ key, value }) => {
        // console.log(key);
        checkDates(station, value, parametersNeedUpdate);
      });

      jsonStream.on('end', () => {
        // console.log('All Done');
        // console.log(`got ${dateMap.size} last dates expecting ${parameters.length}`);

        console.log(`stop processing ${station}`);
        // console.log(dateMap);
        processFiles(index + 1);
      });


    } catch (err) {
      console.error(`read file error: ${err}`);
    }
  } else {
    console.error(`File not found ${stationFile}`);
  }

};
*/

/*
for (let i = 0; i < stations.length; i++) {
// const station = stations[0];
  const station = stations[i];
  const url = stationUrlMap.get(station);

  fetchGCNetData(station, url, (sta, data) => {
    console.log(`Got data for ${sta} ${data.length}`);
    // updateEndDates(sta, data);
  });
}
*/


// processFiles(0);

/*
for (let i = 0; i < stations.length; i++) {
// const station = stations[0];
  const station = stations[i];
  processFiles(station);
}
*/
