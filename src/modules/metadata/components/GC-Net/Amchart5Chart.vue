<template>

  <div id="chartdiv"></div>

</template>

<script>
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
// eslint-disable-next-line camelcase
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';


export default {
  name: 'Amcharts5',

  mounted() {

    const root = am5.Root.new('chartdiv');

    root.setThemes([
      am5themes_Animated.new(root),
    ]);

    const data = [{
      date: new Date(2012, 1, 1).getTime(),
      value: 8,
    }, {
      date: new Date(2012, 1, 2).getTime(),
      value: 5,
    }, {
      date: new Date(2012, 1, 3).getTime(),
      value: 12,
      strokeSettings: {
        stroke: am5.color(0x990000),
        strokeDasharray: [3, 3],
      },
    }, {
      date: new Date(2012, 1, 4).getTime(),
      value: 14,
    }, {
      date: new Date(2012, 1, 5).getTime(),
      value: 11,
    }];

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
          groupData: false,
          baseInterval: {
            timeUnit: 'day',
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
          xAxis,
          yAxis,
          valueYField: 'value',
          valueXField: 'date',
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

    series.data.setAll(data);

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

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

#chartdiv {
  width: 100%;
  height: 250px;
}

</style>