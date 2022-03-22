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

    // Create root and chart
    const root = am5.Root.new('chartdiv');

    root.setThemes([
      am5themes_Animated.new(root),
    ]);

    const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panY: false,
          wheelY: 'zoomX',
          layout: root.verticalLayout,
        })
    );

    // Define data
    const data = [{
      'year': '2021',
      'europe': 5,
      'namerica': 2.5,
      'asia': 1,
    }, {
      'year': '2022',
      'europe': 2.6,
      'namerica': 6.7,
      'asia': 2.2,
    }, {
      'year': '2023',
      'europe': 4.8,
      'namerica': 1.9,
      'asia': 4.4,
    }]

    // Create Y-axis
    const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {}),
        })
    );

    // Create X-Axis
    const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          maxDeviation: 0.2,
          renderer: am5xy.AxisRendererX.new(root, {}),
          categoryField: 'year',
        })
    );
    xAxis.data.setAll(data);

    // Create series
    function createSeries(name, field) {
      const series = chart.series.push(
          am5xy.LineSeries.new(root, {
            name,
            xAxis,
            yAxis,
            valueYField: field,
            categoryXField: 'year',
            stacked: true,
          })
      );
      series.strokes.template.setAll({
        strokeWidth: 3,
        strokeDasharray: [10,5],
      });
      series.fills.template.setAll({
        fillOpacity: 0.5,
        visible: true,
      });
      series.data.setAll(data);
    }

    createSeries('Europe', 'europe');
    createSeries('North America', 'namerica');
    createSeries('Asia', 'asia');
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