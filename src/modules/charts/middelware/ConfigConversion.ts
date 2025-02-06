import _ from 'lodash';

import {de} from 'date-fns/locale';
import type {ChartConfiguration} from 'chart.js';
import {
  chartTitle,
  chartTitleVisible,
  chartType,
  scaleStacked,
  xScaleProperty, xScaleDescription,
  yScaleProperty, yScaleDescription,
  enableGapsInLineCharts, enableLineDrawing,
} from '@/modules/charts/middelware/propertyConst.ts';

import type {ChartProps} from '@/types/env';

/**
 * First array entry is the "from" property, the second is the "to" property
 */
const chartJsConfigMapping = [
  [chartType, 'type'],
  [chartTitle, 'options.plugins.title.text'],
  [chartTitleVisible, 'options.plugins.title.display'],
  [xScaleProperty, 'xParam'],
  [yScaleProperty, 'yParam'],
  [xScaleDescription, 'options.scales.x.title.text'],
  [yScaleDescription, 'options.scales.y.title.text'],
  [scaleStacked, 'options.scales.y.stacked'],
  [enableGapsInLineCharts, 'options.spanGaps'],
  [enableLineDrawing, 'options.showLine'],
];

export const zoomTemplateName = 'zooming';
export const largeDatasetTemplateName = 'large datasets';

export const zoomPluginTemplate = {
  options: {
    plugins: {
      zoom: {
        pan: {
          enabled: true,
//      modifierKey: 'alt',
          mode: 'x',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          drag: {
            enabled: true,
            borderWidth: 5,
            modifierKey: 'shift',
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
        },
      },
    },
  },
}

export const largeDataTemplate = {
  options: {
    parsing: false,
    plugins: {
      decimation: {
        enabled: true,
        algorithm: 'min-max',
//    algorithm: 'lttb',
        // samples: 500,
        // threshold: 10000,
      },
    },
    scales: {
      x: {
        type: 'time',
        adapters: {
          date: {
            locale: de,
          },
        },
      },
    },
  },
}


const chartJsDefaults: Partial<ChartConfiguration> = {
  options: {
    // @ts-ignore
    showLine: true,
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true,
      },
    },
  },
}

function convertPut(entity: any, property: string, value: any): void {
  if (value === undefined) {
    return; // entity;
  }

  const path = property.split('.');
  const key = path.pop();

  if (key) {
    const o = path.reduce((entry, prop) => {
      // if (!entry.hasOwnProperty(prop)) {
      if (!entry[prop]) {
        entry[prop] = {};
      }
      return entry[prop];
    }, entity);

    o[key] = value;
  }

  // return entity;
}

function convertGet(entity: any, property: string) {
  return property.split('.').reduce((entry, key) =>
      // Check if entry is an object and the key exists in the entry
      (entry && typeof entry === 'object' && key in entry) ? entry[key] : undefined
    , entity);
}

function convertToJSON(rules: string[][], data: any): any {
  const toJson = {};

  if (!rules || !data) {
    return toJson;
  }

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];

    try {
      const value = convertGet(data, rule[0]);
      convertPut(toJson, rule[1], value);
    } catch (e) {
      console.log(i);
      console.log(rule);
      console.error(e);
    }
  }

  return toJson;
}

function convertFromJSON(rules: string[][], data: any) {
  const fromJson = {};

  if (!rules || !data) {
    return fromJson;
  }

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];

    try {
      const value = convertGet(data, rule[1]);
      convertPut(fromJson, rule[0], value);
    } catch (e) {
      console.log(i);
      console.log(rule);
      console.error(e);
    }
  }

  return fromJson;
}

export function convertToChartConfig(editorProps: Partial<ChartProps>): Partial<ChartConfiguration> {
  const chartOptions = convertToJSON(chartJsConfigMapping, editorProps);
  const type = chartOptions.type || 'line';
  delete chartOptions.type;

  const newConfig: Partial<ChartConfiguration> = _.merge({
    type,
    ...chartJsDefaults,
  }, {
    ...chartOptions,
  });

  return newConfig;
}

export function convertToChartProps(chartConfig: Partial<ChartConfiguration>): ChartProps {
  return <ChartProps>convertFromJSON(chartJsConfigMapping, chartConfig);
}

// type TupleUnion<U extends string, R extends string[] = []> = {
//   [S in U]: Exclude<U, S> extends never ? [...R, S] : TupleUnion<Exclude<U, S>, [...R, S]>;
// }[U] & string[];

export function possibleChartTypes() {
  // const allChartTypes: TupleUnion<keyof ChartTypeRegistry> = ["bar", "line", "scatter", "bubble", "pie", "doughnut", "polarArea", "radar"];
  // const allChartTypes: TupleUnion<keyof ChartTypeRegistry> = ['bar', 'line'];
  // return allChartTypes;
  return ['bar', 'line'];
}

/*
export function isChartConfiguration(object: any): object is ChartConfiguration {
  return object.hasOwnProperty('type') && object.hasOwnProperty('options');
}
*/
