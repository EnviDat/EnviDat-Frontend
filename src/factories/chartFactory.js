const defaultSeriesSettings = {
  lineStrokeWidth: 3,
  lineOpacity: 1,
  // the auto gap depends on the baseInterval, which might be "hours"
  // works if the lineConnect is false
  lineAutoGap: 2,
  lineConnect: false,
  bulletsStrokeWidth: 2,
  bulletsRadius: 5,
  bulletFill: 'black',
  bulletsfillOpacity: 0,
  bulletsStrokeOpacity: 1,
  reloadFrequency: 0,
  showLegend: true,
  numberFormat: '#.0',
};

// eslint-disable-next-line no-unused-vars
const createSerialChart = function createSerialChart(selector, unit, graphs, chartData, delay, doneCallback, errorCallback, recentData, localTimeConversion) {

  // when the dataDateFormat is not set the time is converted to local time
  const dataDateFormat = localTimeConversion ? '' : 'YYYY-MM-DDTHH:NN:SS.QQ';
  let chart = null;

  const chartConfig = {
      type: 'serial',
      dataDateFormat,
      legend: {
        equalWidths: true,
        useGraphSettings: true,
        align: 'center',
        position: 'top',
        valueAlign: 'left',
      },
      dataProvider: chartData,
      synchronizeGrid: true,
      valueAxes: [{
        unit,
      }],
      graphs,
      chartScrollbar: {
        oppositeAxis: false,
        offset: 35,
        scrollbarHeight: 30,
        backgroundAlpha: 0,
        // "selectedBackgroundAlpha": 0.1,
        // "selectedBackgroundColor": "#888888",
        // "graphFillAlpha": 0,
        // "graphLineAlpha": 1,
        // "selectedGraphFillAlpha": 0,
        // "selectedGraphLineAlpha": 1,
        autoGridCount: true,
        color: '#AAAAAA',
      },
      chartCursor: {
        pan: false,
        valueLineEnabled: true,
        valueLineBalloonEnabled: true,
        parseDates: true,
        categoryBalloonDateFormat: 'MMM DD, YYYY JJ:NN',
        // "dataDateFormat": "MMM DD, YYYY JJ:NN"
      },
      categoryField: 'timestamp_iso',
      categoryAxis: {
        parseDates: true,
        // "minPeriod": recentData ? "hh" : "DD",
        minPeriod: 'hh',
        dashLength: 5,
      },
      export: {
        enabled: false,
      },
      listeners: [
        // {
        //     "event": "dataUpdated",
        //     "method": () => { console.log("dataUpdated"); }
        // },
        {
          event: 'error',
          method: (e) => { errorCallback(e); },
        },
        // {
        //   event: 'init',
        //   method: () => {
        //     doneCallback(chart.dataProvider.length);
        //     // console.log("init finished");
        //   },
        // },
      ],
  };

  // eslint-disable-next-line no-undef
  chart = AmCharts.makeChart(selector, chartConfig, delay);
  // var chart = makeChart(selector, chartConfig);

  // chart.addListener("dataUpdated", zoomChart);
  // zoomChart(chart);

  return chart;
};

// function zoomChart(chart) {
//     chart.zoomToIndexes(chart.dataProvider.length - 20, chart.dataProvider.length - 1);
// }

function addStartEndDateUrl(url, daysBetween = 14, historicalEndDate = undefined) {

  const currentDate = new Date();
  let endDate = historicalEndDate;

  if (!endDate) {
    endDate = currentDate.toISOString().substring(0, 19);
  }

  const endDateDate = new Date(endDate);
  const baseDate = endDateDate;
  const diffDays = endDateDate.getDate() - daysBetween;
  baseDate.setDate(diffDays);
  const differenceDate = new Date(baseDate);
  const startDate = differenceDate.toISOString().substring(0, 19);

  return `${url}${startDate}/${endDate}/`;
}

function hasData(data, parameter) {
  if (!data || data.length <= 0) {
    return false;
  }

  if (parameter) {
    const dataValues = data.filter(el => el[parameter] !== null);

    return dataValues.length > 0;
  }

  return true;
}

function getConfigFiles(resources) {
  const configResources = {};

  if (!resources) {
    return configResources;
  }

  for (let i = 0; i < resources.length; i++) {
    const res = resources[i];

    const resName = res?.name?.toLowerCase() || '';
    const resUrl = res?.url?.toLowerCase() || '';

    if (resName.includes('geoservices_config')) {
      configResources.geoServicesConfig = res;
    } else if (resUrl.includes('stationparameters')) {
      configResources.gcnetStationParameters = res;
    } else if (resUrl.includes('stationsconfig')) {
      configResources.gcnetStationsConfig = res;
    }

  }

  return configResources;
}

// eslint-disable-next-line no-unused-vars
function getConfigUrls(configs, testStationsConfigUrl = './testdata/stationsConfig.json', testStationParametersUrl = './testdata/stationParameters.json', testGeoUrl = './testdata/geoservices_config.json') {

  if (!configs) {
    configs = {};
  }

  const stationsConfigUrl = configs.gcnetStationsConfig?.url || null;
  const stationParametersUrl = configs.gcnetStationParameters?.url || null;
  let geoConfigUrl = configs.geoServicesConfig?.url || null;

  if (import.meta.env?.DEV) {
    // stationsConfigUrl = ''; // testStationsConfigUrl;
    // stationParametersUrl = ''; // testStationParametersUrl;

    // overwrite the local development config url for testing in development
    // geoConfigUrl = testGeoUrl;
    geoConfigUrl = configs.geoServicesConfig?.url ? testGeoUrl : null;

  } else {

    if (configs.gcnetStationsConfig) {
      configs.gcnetStationsConfig.hideFromResourceList = true;
    }

    if (configs.gcnetStationParameters) {
      configs.gcnetStationParameters.hideFromResourceList = true;
    }

    if (configs.geoServicesConfig) {
      configs.geoServicesConfig.hideFromResourceList = true;
    }
  }

  configs.stationsConfigUrl = stationsConfigUrl;
  configs.stationParametersUrl = stationParametersUrl;
  configs.geoConfigUrl = geoConfigUrl;

  return configs;
}


export {
  addStartEndDateUrl,
  createSerialChart,
  defaultSeriesSettings,
  getConfigFiles,
  getConfigUrls,
  hasData,
};

export function getFeatureCollectionFromGcNetStations(stations) {
  const featureCollection = {
    type: 'FeatureCollection',
    features: [],
  };

  if (!stations) {
    return featureCollection;
  }

  stations.forEach((geom) => {
    featureCollection.features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [Number(geom.longitude), Number(geom.latitude)],
      },
      properties: {
        alias: geom.alias,
        name: geom.name,
        active: geom.active,
        elevation: geom.elevation,
      },
    });
  });

  return featureCollection;
}
