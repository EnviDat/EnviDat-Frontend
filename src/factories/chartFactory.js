import * as am5 from '@amcharts/amcharts5';
import am5themesAnimated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';

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
  // eslint-disable-next-line prefer-const
  let stationsConfigUrl = configs?.gcnetStationsConfig?.url || null;
  // eslint-disable-next-line prefer-const
  let stationParametersUrl = configs?.gcnetStationParameters?.url || null;
  // eslint-disable-next-line prefer-const
  let geoConfigUrl = configs?.geoServicesConfig?.url || null;

  if (!configs) {
    configs = {};
  }

  if (process.env.NODE_ENV === 'development') {
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

export function getLineSeriesFromJSON(root, data, {
  xAxis, yAxis,
  valueXField, valueYField,
  minDistance = 0,
  connect = false,
  dateFormat = 'yyyy-MM-dd H:m:s\'+00:00\'',
}) {
  const series =
    am5xy.LineSeries.new(root, {
      minBulletDistance: 10,
      xAxis,
      yAxis,
      valueXField,
      valueYField,
      minDistance,
      connect,
      tooltip: am5.Tooltip.new(root, {}),
    });

  series.get('tooltip').label.set('text', '{valueYField}: {valueY}');

  series.strokes.template.setAll({
    strokeWidth: 3,
    templateField: 'strokeSettings',
  });

  // Process data
  const processor = am5.DataProcessor.new(root, {
    dateFields: [valueXField],
    dateFormat,
    numericFields: [valueYField],
  });

  processor.processMany(data);

  // Assign parsed/processed data to series
  series.data.setAll(data);

  return series;
}

export function createValueAxis(root, maxDeviation = 0.1) {
  return am5xy.ValueAxis.new(root, {
    maxDeviation,
    renderer: am5xy.AxisRendererY.new(root, {}),
    tooltip: am5.Tooltip.new(root, {}),
  });
}

export function createDateAxis(root, groupData = true, groupCount = 500, maxDeviation = 0.1, minGridDistance = 50) {
  return am5xy.DateAxis.new(root, {
    maxDeviation,
    groupData,
    groupCount,
    baseInterval: {
      timeUnit: 'hour',
      count: 1,
    },
    renderer: am5xy.AxisRendererX.new(root, {
      minGridDistance,
    }),
    tooltip: am5.Tooltip.new(root, {}),
  });
}

export function createXYCursor(root, xAxis) {
  return am5xy.XYCursor.new(root, {
    behavior: 'zoomX',
    xAxis,
  })
}

export function createScrollbar(root) {
  return am5.Scrollbar.new(root, {
    orientation: 'horizontal',
  });
}

export function createXYChart(root) {
  return am5xy.XYChart.new(root, {
    focusable: true,
    panX: true,
    panY: true,
    wheelX: 'panX',
    wheelY: 'zoomX',
  });
}

export function createDynamicChart(yAxisDivID, chartRoot = null) {

  const root = chartRoot || am5.Root.new(yAxisDivID);

  // Set all dates in root to UTC
  // NOTE: It is critical to set the root to UTC, otherwise timestamps will be rendered in local time!!!!
  root.utc = true;

  root.setThemes([am5themesAnimated.new(root)]);

  const chart = createXYChart(root);
  root.container.children.push(chart);

  return chart;
}

function createChart(yAxisDivID, xAxisName, yAxisName, data, xAxisFormat = 'yyyy-MM-dd H:m:s\'+00:00\'') {

  const root = am5.Root.new(yAxisDivID);

  // Set all dates in root to UTC
  // NOTE: It is critical to set the root to UTC, otherwise timestamps will be rendered in local time!!!!
  root.utc = true;

  root.setThemes([am5themesAnimated.new(root)]);

  const chart = createXYChart(root);
  root.container.children.push(chart);

  // const easing = am5.ease.linear;

  const xAxis = chart.xAxes.push(createDateAxis(root));
  const yAxis = chart.yAxes.push(createValueAxis(root));

  // Set cursor
  chart.set('cursor', createXYCursor(root, xAxis));
  // cursor.lineY.set('visible', false);

  // Add scrollbar
  chart.set('scrollbarX', createScrollbar(root));

  /*
    chart.appear(1000, 100);
  */

  // Add series
  const series = chart.series.push(
    am5xy.LineSeries.new(root, {
      minBulletDistance: 10,
      connect: false,
      xAxis,
      yAxis,
      valueYField: yAxisName,
      valueXField: xAxisName,
      tooltip: am5.Tooltip.new(root, {}),
    }),
  );

  series.get('tooltip').label.set('text', '{valueYField}: {valueY}');

  series.strokes.template.setAll({
    strokeWidth: 3,
    templateField: 'strokeSettings',
  });

  // Make stuff animate on load
  /*
    series.appear(1000, 100);
    chart.appear(1000, 100);
  */


  // Process data
  const processor = am5.DataProcessor.new(root, {
    dateFields: [xAxisName],
    dateFormat: xAxisFormat,
    numericFields: [yAxisName],
  });

  processor.processMany(data);

  // Assign parsed/processed data to series
  series.data.setAll(data);

  return () => root.dispose();
}

export {
  createSerialChart,
  createChart,
  defaultSeriesSettings,
  addStartEndDateUrl,
  hasData,
  getConfigFiles,
  getConfigUrls,
};
