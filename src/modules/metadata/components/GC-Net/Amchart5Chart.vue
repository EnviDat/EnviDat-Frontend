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
      default: 'https://www.envidat.ch/data-api/gcnet/json/swisscamp/windspeed1/2018-11-04T17:00:00/2020-11-10T00:00:00/',
    },
    xAxisName: {
      type: String,
      default: 'timestamp_iso',
    },
    xAxisFormat: {
      type: String,
      default: "yyyy-MM-dd H:m:s'+00:00'",
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
            // minGridDistance: 50,
          }),
          tooltip: am5.Tooltip.new(root, {}),
        })
    );

    const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          maxDeviation: 0.1,
          renderer: am5xy.AxisRendererY.new(root, {}),
          tooltip: am5.Tooltip.new(root, {}),
        })
    );

    // Add series
    const series = chart.series.push(
        am5xy.LineSeries.new(root, {
          minBulletDistance: 10,
          connect: false,
          xAxis,
          yAxis,
          valueYField: 'windspeed1', // TODO implement logic for valueYField, eventually this should handle multiple y axis series
          valueXField: this.xAxisName,
          tooltip: am5.Tooltip.new(root, {}),
        })
    );

    series.get('tooltip').label.set('text', '{valueYField}: {valueY}');

    // series.bullets.push(() => am5.Bullet.new(root, {
    //     sprite: am5.Circle.new(root, {
    //       radius: 6,
    //       stroke: series.get('fill'),
    //       strokeWidth: 2,
    //       fill: am5.color(0xffffff),
    //     }),
    //   }));

    // series.bullets.push(() => am5.Bullet.new(root, {
    //     sprite: am5.Circle.new(root, {
    //       radius: 5,
    //       fill: series.get('fill'),
    //       stroke: root.interfaceColors.get('background'),
    //       strokeWidth: 2,
    //       tooltipText: '{valueY}',
    //       showTooltipOn: 'always',
    //       tooltip: am5.Tooltip.new(root, {}),
    //     }),
    //   }));


    series.strokes.template.setAll({
      strokeWidth: 3,
      templateField: 'strokeSettings',
    });


    // Load and parse external data
    am5.net.load(this.apiUrl).then((result) => {

      // Get responseType 'type' from response header, this indicates if external data is in JSON or CSV format
      const responseType = this.getResponseType(result.type)

      // Logging used for development
      // console.log(result)
      // console.log(result.response)

      // TODO extract out JSON and CSV parsing and assigning data to series to separate function

      // Parse JSON input, set series with data
      if (responseType === 'application/json') {

        // Block used when parsing JSON dat without DataProcessor
        // Assign parsed data to series
        // series.data.setAll(am5.JSONParser.parse(result.response));

        // Parse data
        const data = am5.JSONParser.parse(result.response);

        // Process data
        const processor = am5.DataProcessor.new(root, {
          dateFields: [this.xAxisName],  // TODO implement logic to determine timestamp name
          dateFormat: this.xAxisFormat,  // TODO implement logic to determine timestamp format
          numericFields: ['windspeed1'], // TODO implement logic to determine numericFields for JSON parsing
        });
        processor.processMany(data);

        // Assign parsed/processed data to series
        series.data.setAll(data);

      }

      // Parse CSV input, set series with data
      else if (responseType === 'text/csv') {

        // Parse data
        const data = am5.CSVParser.parse(result.response, {
          delimiter: ',',
          reverse: true,
          skipEmpty: true,
          useColumnNames: true,
        });

        // Process data
        const processor = am5.DataProcessor.new(root, {
          dateFields: [this.xAxisName],  // TODO implement logic to determine timestamp name
          dateFormat: this.xAxisFormat,  // TODO implement logic to determine timestamp format
          numericFields: ['windspeed1'], // TODO implement logic to determine numericFields for CSV parsing
        });
        processor.processMany(data);

        // Assign parsed/processed data to series
        series.data.setAll(data);

        // TODO investigate why tooltip only working for JSON data and not CSV data
        // series.get('tooltip').label.set('text', '{valueYField}: {valueY}');

      }

      // TODO implement further error handling in case responseType is not an expected string indicating json or csv
      // else {
      // }

    }).catch((result) => {
      console.log(`Error loading ${result.xhr.responseURL}`);
    });

    // Add cursor
    const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {
      xAxis,
    }));
    // cursor.lineY.set('visible', false);

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

  methods: {
    // Return responseType 'type' from result object (only string parsed to first comma)
    getResponseType(resultType) {
      return resultType.split(',')[0];
    },
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
  height: 350px;
}

</style>