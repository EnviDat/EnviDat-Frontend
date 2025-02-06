import type {ChartType, Plugin, Scale} from "chart.js";
import type {Chart} from "chart.js/auto";
import type {AnyObject} from "chart.js/dist/types/basic.d.ts";

export const eventPlugin : Plugin = {
  id: 'chartModule-eventPlugin',
  beforeDataLimits(chart: Chart<ChartType>, args: { scale: Scale }, options: AnyObject) {
    console.log('eventPlugin - beforeDataLimits', args);
  },
}
