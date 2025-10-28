import type { ChartType, Plugin, Scale } from 'chart.js';
import type { Chart } from 'chart.js/auto';

export const eventPlugin: Plugin = {
  id: 'chartModule-eventPlugin',
  beforeDataLimits(chart: Chart<ChartType>, args: { scale: Scale }, options: Record<string, any>) {
    console.log('eventPlugin - beforeDataLimits', args);
  },
};
