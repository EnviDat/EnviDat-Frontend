<template>

  <div class="chart" :id="this.chartdivID"></div>

</template>

<script>
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
// eslint-disable-next-line camelcase
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';


export default {

  name: 'Amcharts5',

  props: {
    chartdivID: {
      type: String,
      default: 'chartdiv',
    },
    apiUrl: {
      type: String,
      default: 'https://www.envidat.ch/data-api/gcnet/json/swisscamp/airtemp1/2018-11-04T17:00:00/2020-11-10T00:00:00/',
    },
  },

  mounted() {

    const root = am5.Root.new(this.chartdivID);

    // Set all dates in root to UTC
    // NOTE: It is critical to set the root to UTC, otherwise timestamps will be rendered in local time!!!!
    root.utc = true;

    root.setThemes([
      am5themes_Animated.new(root),
    ]);

    // Create chart
    const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          focusable: true,
          panX: true,
          panY: true,
          wheelX: 'panX',
          wheelY: 'zoomX',
        })
    );

    const easing = am5.ease.linear;

    // Create axes
    const xAxis = chart.xAxes.push(
        am5xy.DateAxis.new(root, {
          maxDeviation: 0.1,
          groupData: true,
          groupCount: 500,
          baseInterval: {
            timeUnit: 'hour',
            count: 1,
          },
          renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 50,
          }),
          tooltip: am5.Tooltip.new(root, {}),
        })
    );

    const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          maxDeviation: 0.1,
          renderer: am5xy.AxisRendererY.new(root, {}),
        })
    );

    // Add series
    const series = chart.series.push(
        am5xy.LineSeries.new(root, {
          minBulletDistance: 10,
          connect: false,
          xAxis,
          yAxis,
          valueYField: 'airtemp1',
          valueXField: 'timestamp',
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: 'horizontal',
            labelText: '{valueY}',
          }),
        })
    );

    series.strokes.template.setAll({
      strokeWidth: 3,
      templateField: 'strokeSettings',
    });

    // Load and parse external data
    am5.net.load(this.apiUrl).then((result) => {
      // This gets executed when data finishes loading
      series.data.setAll(am5.JSONParser.parse(result.response));
    }).catch((result) => {
      // This gets executed if there was an error loading URL
      // ... handle error
      console.log(`Error loading ${result.xhr.responseURL}`);
    });

    // Add cursor
    const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {
      xAxis,
    }));
    cursor.lineY.set('visible', false);

    // Add scrollbar
    chart.set('scrollbarX', am5.Scrollbar.new(root, {
      orientation: 'horizontal',
    }));

  // Make stuff animate on load
    series.appear(1000, 100);
    chart.appear(1000, 100);

  },

  beforeDestroy() {
    if (this.root) {
      this.root.dispose();
    }
  },

  data() {
    return {
    };
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

.chart {
  width: 100%;
  height: 250px;
}

</style>