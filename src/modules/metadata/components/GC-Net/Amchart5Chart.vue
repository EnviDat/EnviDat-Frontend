<template>

  <v-card>

    <v-container class="pa-4" fluid>

<!--    <div class="chart" :id="this.chartdivID"></div>-->

<!--    <div class="chart" id="test1"></div>-->

      <div v-if="!isFetching">

        <div class="chart" v-for="yAxis in yAxesArray" :id=yAxis :key="yAxis">
          {{yAxis}}
        </div>

      </div>


    </v-container>

  </v-card>


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
    // TODO implement apiParameters in apiUrl BUT ONLT IF JSON data will need to be read
    // TODO derive nullvalue and apiParameters by parsing apiURL, distinguish between json and csv calls, use computedProperties or methods
    // apiParameters: {
    //   type: Array,
    // },
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

  // =============== TEST multiple charts in mounted()
  // mounted() {
  //
  //   for (const chartID of this.chartdivID) {
  //
  //     const root = am5.Root.new(chartID);
  //
  //     // Set all dates in root to UTC
  //     // NOTE: It is critical to set the root to UTC, otherwise timestamps will be rendered in local time!!!!
  //     root.utc = true;
  //
  //     root.setThemes([
  //       am5themes_Animated.new(root),
  //     ]);
  //
  //     // // Create chart
  //     // const chart = root.container.children.push(
  //     //     am5xy.XYChart.new(root, {
  //     //       focusable: true,
  //     //       panX: true,
  //     //       panY: true,
  //     //       wheelX: 'panX',
  //     //       wheelY: 'zoomX',
  //     //     })
  //     // );
  //     //
  //     // const easing = am5.ease.linear;
  //     //
  //     // // Create axes
  //     // const xAxis = chart.xAxes.push(
  //     //     am5xy.DateAxis.new(root, {
  //     //       maxDeviation: 0.1,
  //     //       groupData: true,
  //     //       groupCount: 500,
  //     //       baseInterval: {
  //     //         timeUnit: 'hour',
  //     //         count: 1,
  //     //       },
  //     //       renderer: am5xy.AxisRendererX.new(root, {
  //     //         // minGridDistance: 50,
  //     //       }),
  //     //       tooltip: am5.Tooltip.new(root, {}),
  //     //     })
  //     // );
  //     //
  //     // const yAxis = chart.yAxes.push(
  //     //     am5xy.ValueAxis.new(root, {
  //     //       maxDeviation: 0.1,
  //     //       renderer: am5xy.AxisRendererY.new(root, {}),
  //     //       tooltip: am5.Tooltip.new(root, {}),
  //     //     })
  //     // );
  //     //
  //     // // Add series
  //     // const series = chart.series.push(
  //     //     am5xy.LineSeries.new(root, {
  //     //       minBulletDistance: 10,
  //     //       connect: false,
  //     //       xAxis,
  //     //       yAxis,
  //     //       valueYField: this.yAxisName,
  //     //       valueXField: this.xAxisName,
  //     //       tooltip: am5.Tooltip.new(root, {}),
  //     //     })
  //     // );
  //     //
  //     // series.get('tooltip').label.set('text', '{valueYField}: {valueY}');
  //     //
  //     // series.strokes.template.setAll({
  //     //   strokeWidth: 3,
  //     //   templateField: 'strokeSettings',
  //     // });
  //     //
  //     // // Add cursor
  //     // const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {
  //     //   behavior: 'zoomX',
  //     //   xAxis,
  //     // }));
  //     // // cursor.lineY.set('visible', false);
  //     //
  //     // // Add scrollbar
  //     // chart.set('scrollbarX', am5.Scrollbar.new(root, {
  //     //   orientation: 'horizontal',
  //     // }));
  //     //
  //     // // Make stuff animate on load
  //     // series.appear(1000, 100);
  //     // chart.appear(1000, 100);
  //
  //
  //
  //     // series.bullets.push(() => am5.Bullet.new(root, {
  //     //     sprite: am5.Circle.new(root, {
  //     //       radius: 6,
  //     //       stroke: series.get('fill'),
  //     //       strokeWidth: 2,
  //     //       fill: am5.color(0xffffff),
  //     //     }),
  //     //   }));
  //
  //     // series.bullets.push(() => am5.Bullet.new(root, {
  //     //     sprite: am5.Circle.new(root, {
  //     //       radius: 5,
  //     //       fill: series.get('fill'),
  //     //       stroke: root.interfaceColors.get('background'),
  //     //       strokeWidth: 2,
  //     //       tooltipText: '{valueY}',
  //     //       showTooltipOn: 'always',
  //     //       tooltip: am5.Tooltip.new(root, {}),
  //     //     }),
  //     //   }));
  //
  //
  //     // Create chart
  //     const chart = root.container.children.push(
  //         am5xy.XYChart.new(root, {
  //           focusable: true,
  //           panX: true,
  //           panY: true,
  //           wheelX: 'panX',
  //           wheelY: 'zoomX',
  //         }),
  //     );
  //
  //     const easing = am5.ease.linear;
  //
  //     // Create axes
  //     const xAxis = chart.xAxes.push(
  //         am5xy.DateAxis.new(root, {
  //           maxDeviation: 0.1,
  //           groupData: true,
  //           groupCount: 500,
  //           baseInterval: {
  //             timeUnit: 'hour',
  //             count: 1,
  //           },
  //           renderer: am5xy.AxisRendererX.new(root, {
  //             // minGridDistance: 50,
  //           }),
  //           tooltip: am5.Tooltip.new(root, {}),
  //         })
  //     );
  //
  //     const yAxis = chart.yAxes.push(
  //         am5xy.ValueAxis.new(root, {
  //           maxDeviation: 0.1,
  //           renderer: am5xy.AxisRendererY.new(root, {}),
  //           tooltip: am5.Tooltip.new(root, {}),
  //         })
  //     );
  //
  //
  //
  //     // Add cursor
  //     const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {
  //       behavior: 'zoomX',
  //       xAxis,
  //     }));
  //     // cursor.lineY.set('visible', false);
  //
  //     // Add scrollbar
  //     chart.set('scrollbarX', am5.Scrollbar.new(root, {
  //       orientation: 'horizontal',
  //     }));
  //
  //     chart.appear(1000, 100);
  //
  //
  //
  //
  //     // Add series
  //     const series = chart.series.push(
  //         am5xy.LineSeries.new(root, {
  //           minBulletDistance: 10,
  //           connect: false,
  //           xAxis,
  //           yAxis,
  //           valueYField: this.yAxisName,
  //           valueXField: this.xAxisName,
  //           tooltip: am5.Tooltip.new(root, {}),
  //         })
  //     );
  //
  //     series.get('tooltip').label.set('text', '{valueYField}: {valueY}');
  //
  //     series.strokes.template.setAll({
  //       strokeWidth: 3,
  //       templateField: 'strokeSettings',
  //     });
  //
  //
  //     // Make stuff animate on load
  //     series.appear(1000, 100);
  //     chart.appear(1000, 100);
  //
  //
  //     // // TEST
  //     // // Add series
  //     // const series2 = chart.series.push(
  //     //     am5xy.LineSeries.new(root, {
  //     //       minBulletDistance: 10,
  //     //       connect: false,
  //     //       xAxis,
  //     //       yAxis,
  //     //       valueYField: 'air_temperature_1',
  //     //       valueXField: this.xAxisName,
  //     //       tooltip: am5.Tooltip.new(root, {}),
  //     //     })
  //     // );
  //     //
  //     // series2.get('tooltip').label.set('text', '{valueYField}: {valueY}');
  //     //
  //     // series2.strokes.template.setAll({
  //     //   strokeWidth: 3,
  //     //   templateField: 'strokeSettings',
  //     // });
  //     //
  //     //
  //     // // Make stuff animate on load
  //     // series2.appear(1000, 100);
  //
  //
  //
  //
  //     // Load and parse external data
  //     am5.net.load(this.apiUrl).then((result) => {
  //
  //       // Get responseType 'type' from response header, this indicates if external data is in JSON or CSV format
  //       const responseType = this.getResponseType(result.type)
  //
  //       // let response = []
  //
  //       if (responseType === 'application/json') {
  //         this.parsedResponse = am5.JSONParser.parse(result.response);
  //         // console.log(this.parsedResponse)
  //       }
  //       else if (responseType === 'text/csv') {
  //         // TODO dynamically assign nullValue in call below, will need to parse nodata value from NEAD
  //         // this.parsedResponse = this.convertCSVToJSON(result.response, '-999')
  //         this.parsedResponse = this.convertCSVToJSON(result.response, '')
  //         // console.log(this.parsedResponse)
  //       }
  //       else {
  //         console.log(`Error loading ${this.apiUrl}, response type ${responseType} is not compatible with application.`);
  //       }
  //
  //       // console.log(this.yAxesArray)
  //
  //       // Process data
  //       const processor = am5.DataProcessor.new(root, {
  //         dateFields: [this.xAxisName],
  //         dateFormat: this.xAxisFormat,
  //         // numericFields: [this.yAxisName],
  //         numericFields: this.yAxesArray,
  //       });
  //       processor.processMany(this.parsedResponse);
  //
  //       // Assign parsed/processed data to series
  //       series.data.setAll(this.parsedResponse);
  //
  //       // series2.data.setAll(this.parsedResponse);
  //
  //     }).catch((result) => {
  //       console.log(`Error loading ${result.xhr.this.responseURL}`);
  //     });
  //
  //
  //     // console.log(this.parsedResponse)
  //
  //     // this.yAxesArray.forEach(element => {
  //     //
  //     //   // Create chart
  //     //   const chart = root.container.children.push(
  //     //       am5xy.XYChart.new(root, {
  //     //         focusable: true,
  //     //         panX: true,
  //     //         panY: true,
  //     //         wheelX: 'panX',
  //     //         wheelY: 'zoomX',
  //     //       })
  //     //   );
  //     //
  //     //   // const easing = am5.ease.linear;
  //     //
  //     //   // Create axes
  //     //   const xAxis = chart.xAxes.push(
  //     //       am5xy.DateAxis.new(root, {
  //     //         maxDeviation: 0.1,
  //     //         groupData: true,
  //     //         groupCount: 500,
  //     //         baseInterval: {
  //     //           timeUnit: 'hour',
  //     //           count: 1,
  //     //         },
  //     //         renderer: am5xy.AxisRendererX.new(root, {
  //     //           // minGridDistance: 50,
  //     //         }),
  //     //         tooltip: am5.Tooltip.new(root, {}),
  //     //       })
  //     //   );
  //     //   const yAxis = chart.yAxes.push(
  //     //       am5xy.ValueAxis.new(root, {
  //     //         maxDeviation: 0.1,
  //     //         renderer: am5xy.AxisRendererY.new(root, {}),
  //     //         tooltip: am5.Tooltip.new(root, {}),
  //     //       })
  //     //   );
  //     //
  //     //   // Add series
  //     //   const series = chart.series.push(
  //     //       am5xy.LineSeries.new(root, {
  //     //         minBulletDistance: 10,
  //     //         connect: false,
  //     //         xAxis,
  //     //         yAxis,
  //     //         // valueYField: this.yAxisName,
  //     //         valueYField: element,
  //     //         valueXField: this.xAxisName,
  //     //         tooltip: am5.Tooltip.new(root, {}),
  //     //       })
  //     //   );
  //     //
  //     //   // Assign parsed/processed data to series
  //     //   series.data.setAll(this.parsedResponse);
  //     //
  //     //   series.get('tooltip').label.set('text', '{valueYField}: {valueY}');
  //     //
  //     //   series.strokes.template.setAll({
  //     //     strokeWidth: 3,
  //     //     templateField: 'strokeSettings',
  //     //   });
  //     //
  //     //   // Add cursor
  //     //   // const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {
  //     //   //   behavior: 'zoomX',
  //     //   //   xAxis,
  //     //   // }));
  //     //   // cursor.lineY.set('visible', false);
  //     //
  //     //   // Add scrollbar
  //     //   chart.set('scrollbarX', am5.Scrollbar.new(root, {
  //     //     orientation: 'horizontal',
  //     //   }));
  //     //
  //     //   // Make stuff animate on load
  //     //   series.appear(1000, 100);
  //     //   chart.appear(1000, 100);
  //     //
  //     //
  //     // })
  //
  //
  //     //   // Create chart
  //     //   const chart = root.container.children.push(
  //     //       am5xy.XYChart.new(root, {
  //     //         focusable: true,
  //     //         panX: true,
  //     //         panY: true,
  //     //         wheelX: 'panX',
  //     //         wheelY: 'zoomX',
  //     //       })
  //     //   );
  //     //
  //     //   const easing = am5.ease.linear;
  //     //
  //     //   // Create axes
  //     //   const xAxis = chart.xAxes.push(
  //     //       am5xy.DateAxis.new(root, {
  //     //         maxDeviation: 0.1,
  //     //         groupData: true,
  //     //         groupCount: 500,
  //     //         baseInterval: {
  //     //           timeUnit: 'hour',
  //     //           count: 1,
  //     //         },
  //     //         renderer: am5xy.AxisRendererX.new(root, {
  //     //           // minGridDistance: 50,
  //     //         }),
  //     //         tooltip: am5.Tooltip.new(root, {}),
  //     //       })
  //     //   );
  //     //
  //     //   const yAxis = chart.yAxes.push(
  //     //       am5xy.ValueAxis.new(root, {
  //     //         maxDeviation: 0.1,
  //     //         renderer: am5xy.AxisRendererY.new(root, {}),
  //     //         tooltip: am5.Tooltip.new(root, {}),
  //     //       })
  //     //   );
  //     //
  //     //   // console.log(this.yAxisName)
  //     //
  //     //   // Add series
  //     //   const series = chart.series.push(
  //     //       am5xy.LineSeries.new(root, {
  //     //         minBulletDistance: 10,
  //     //         connect: false,
  //     //         xAxis,
  //     //         yAxis,
  //     //         valueYField: this.yAxisName,
  //     //         valueXField: this.xAxisName,
  //     //         tooltip: am5.Tooltip.new(root, {}),
  //     //       })
  //     //   );
  //     //
  //     //   // Assign parsed/processed data to series
  //     //   series.data.setAll(this.parsedResponse);
  //     //
  //     //   console.log(series)
  //     //
  //     //   series.get('tooltip').label.set('text', '{valueYField}: {valueY}');
  //     //
  //     //   series.strokes.template.setAll({
  //     //     strokeWidth: 3,
  //     //     templateField: 'strokeSettings',
  //     //   });
  //     //
  //     //   // Add cursor
  //     //   const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {
  //     //     behavior: 'zoomX',
  //     //     xAxis,
  //     //   }));
  //     //   // cursor.lineY.set('visible', false);
  //     //
  //     //   // Add scrollbar
  //     //   chart.set('scrollbarX', am5.Scrollbar.new(root, {
  //     //     orientation: 'horizontal',
  //     //   }));
  //     //
  //     // // Make stuff animate on load
  //     //   series.appear(1000, 100);
  //     //   chart.appear(1000, 100);
  //
  //
  //
  //
  //
  //
  //
  //   }
  //
  //
  //
  // },




  mounted() {

    // TODO try to loop roots with yAxis names

    // ======= TEST DEV BLOCK ================

    // this.createChart('test')

    // Load and parsed external data
    this.loadParseData();

    // Create one chart per element in this.yAxesArray
     // this.yAxesArray.map(element => this.createChart((element)))


    // ========= END TEST DEV BLOCK ==========

    // const root = am5.Root.new(this.chartdivID);
    //
    // // Set all dates in root to UTC
    // // NOTE: It is critical to set the root to UTC, otherwise timestamps will be rendered in local time!!!!
    // root.utc = true;
    //
    // root.setThemes([
    //   am5themes_Animated.new(root),
    // ]);

    // // Create chart
    // const chart = root.container.children.push(
    //     am5xy.XYChart.new(root, {
    //       focusable: true,
    //       panX: true,
    //       panY: true,
    //       wheelX: 'panX',
    //       wheelY: 'zoomX',
    //     })
    // );
    //
    // const easing = am5.ease.linear;
    //
    // // Create axes
    // const xAxis = chart.xAxes.push(
    //     am5xy.DateAxis.new(root, {
    //       maxDeviation: 0.1,
    //       groupData: true,
    //       groupCount: 500,
    //       baseInterval: {
    //         timeUnit: 'hour',
    //         count: 1,
    //       },
    //       renderer: am5xy.AxisRendererX.new(root, {
    //         // minGridDistance: 50,
    //       }),
    //       tooltip: am5.Tooltip.new(root, {}),
    //     })
    // );
    //
    // const yAxis = chart.yAxes.push(
    //     am5xy.ValueAxis.new(root, {
    //       maxDeviation: 0.1,
    //       renderer: am5xy.AxisRendererY.new(root, {}),
    //       tooltip: am5.Tooltip.new(root, {}),
    //     })
    // );
    //
    // // Add series
    // const series = chart.series.push(
    //     am5xy.LineSeries.new(root, {
    //       minBulletDistance: 10,
    //       connect: false,
    //       xAxis,
    //       yAxis,
    //       valueYField: this.yAxisName,
    //       valueXField: this.xAxisName,
    //       tooltip: am5.Tooltip.new(root, {}),
    //     })
    // );
    //
    // series.get('tooltip').label.set('text', '{valueYField}: {valueY}');
    //
    // series.strokes.template.setAll({
    //   strokeWidth: 3,
    //   templateField: 'strokeSettings',
    // });
    //
    // // Add cursor
    // const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {
    //   behavior: 'zoomX',
    //   xAxis,
    // }));
    // // cursor.lineY.set('visible', false);
    //
    // // Add scrollbar
    // chart.set('scrollbarX', am5.Scrollbar.new(root, {
    //   orientation: 'horizontal',
    // }));
    //
    // // Make stuff animate on load
    // series.appear(1000, 100);
    // chart.appear(1000, 100);



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


    // // Create chart
    // const chart = root.container.children.push(
    //     am5xy.XYChart.new(root, {
    //       focusable: true,
    //       panX: true,
    //       panY: true,
    //       wheelX: 'panX',
    //       wheelY: 'zoomX',
    //     }),
    // );
    //
    // const easing = am5.ease.linear;
    //
    // // Create axes
    // const xAxis = chart.xAxes.push(
    //     am5xy.DateAxis.new(root, {
    //       maxDeviation: 0.1,
    //       groupData: true,
    //       groupCount: 500,
    //       baseInterval: {
    //         timeUnit: 'hour',
    //         count: 1,
    //       },
    //       renderer: am5xy.AxisRendererX.new(root, {
    //         // minGridDistance: 50,
    //       }),
    //       tooltip: am5.Tooltip.new(root, {}),
    //     })
    // );
    //
    // const yAxis = chart.yAxes.push(
    //     am5xy.ValueAxis.new(root, {
    //       maxDeviation: 0.1,
    //       renderer: am5xy.AxisRendererY.new(root, {}),
    //       tooltip: am5.Tooltip.new(root, {}),
    //     })
    // );
    //
    //
    //
    // // Add cursor
    // const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {
    //   behavior: 'zoomX',
    //   xAxis,
    // }));
    // // cursor.lineY.set('visible', false);
    //
    // // Add scrollbar
    // chart.set('scrollbarX', am5.Scrollbar.new(root, {
    //   orientation: 'horizontal',
    // }));
    //
    // chart.appear(1000, 100);
    //
    //
    //
    //
    // // Add series
    // const series = chart.series.push(
    //     am5xy.LineSeries.new(root, {
    //       minBulletDistance: 10,
    //       connect: false,
    //       xAxis,
    //       yAxis,
    //       valueYField: this.yAxisName,
    //       valueXField: this.xAxisName,
    //       tooltip: am5.Tooltip.new(root, {}),
    //     })
    // );
    //
    // series.get('tooltip').label.set('text', '{valueYField}: {valueY}');
    //
    // series.strokes.template.setAll({
    //   strokeWidth: 3,
    //   templateField: 'strokeSettings',
    // });
    //
    //
    // // Make stuff animate on load
    // series.appear(1000, 100);
    // chart.appear(1000, 100);


    // // TEST
    // // Add series
    // const series2 = chart.series.push(
    //     am5xy.LineSeries.new(root, {
    //       minBulletDistance: 10,
    //       connect: false,
    //       xAxis,
    //       yAxis,
    //       valueYField: 'air_temperature_1',
    //       valueXField: this.xAxisName,
    //       tooltip: am5.Tooltip.new(root, {}),
    //     })
    // );
    //
    // series2.get('tooltip').label.set('text', '{valueYField}: {valueY}');
    //
    // series2.strokes.template.setAll({
    //   strokeWidth: 3,
    //   templateField: 'strokeSettings',
    // });
    //
    //
    // // Make stuff animate on load
    // series2.appear(1000, 100);




    // // Load and parse external data
    // am5.net.load(this.apiUrl).then((result) => {
    //
    //   // Get responseType 'type' from response header, this indicates if external data is in JSON or CSV format
    //   const responseType = this.getResponseType(result.type)
    //
    //   // let response = []
    //
    //   if (responseType === 'application/json') {
    //     this.parsedResponse = am5.JSONParser.parse(result.response);
    //   }
    //   else if (responseType === 'text/csv') {
    //     // TODO dynamically assign nullValue in call below, will need to parse nodata value from NEAD
    //     // this.parsedResponse = this.convertCSVToJSON(result.response, '-999')
    //     this.parsedResponse = this.convertCSVToJSON(result.response, '')
    //   }
    //   else {
    //     console.log(`Error loading ${this.apiUrl}, response type ${responseType} is not compatible with application.`);
    //   }
    //
    //
    //
    //   // Process data
    //   const processor = am5.DataProcessor.new(root, {
    //     dateFields: [this.xAxisName],
    //     dateFormat: this.xAxisFormat,
    //     // numericFields: [this.yAxisName],
    //     numericFields: this.yAxesArray,
    //   });
    //   processor.processMany(this.parsedResponse);
    //
    //   // Assign parsed/processed data to series
    //   series.data.setAll(this.parsedResponse);
    //   // series2.data.setAll(this.parsedResponse);
    //
    // }).catch((result) => {
    //   console.log(`Error loading ${result.xhr.this.responseURL}`);
    // });


    // this.yAxesArray.forEach(element => {
    //
    //   // Create chart
    //   const chart = root.container.children.push(
    //       am5xy.XYChart.new(root, {
    //         focusable: true,
    //         panX: true,
    //         panY: true,
    //         wheelX: 'panX',
    //         wheelY: 'zoomX',
    //       })
    //   );
    //
    //   // const easing = am5.ease.linear;
    //
    //   // Create axes
    //   const xAxis = chart.xAxes.push(
    //       am5xy.DateAxis.new(root, {
    //         maxDeviation: 0.1,
    //         groupData: true,
    //         groupCount: 500,
    //         baseInterval: {
    //           timeUnit: 'hour',
    //           count: 1,
    //         },
    //         renderer: am5xy.AxisRendererX.new(root, {
    //           // minGridDistance: 50,
    //         }),
    //         tooltip: am5.Tooltip.new(root, {}),
    //       })
    //   );
    //   const yAxis = chart.yAxes.push(
    //       am5xy.ValueAxis.new(root, {
    //         maxDeviation: 0.1,
    //         renderer: am5xy.AxisRendererY.new(root, {}),
    //         tooltip: am5.Tooltip.new(root, {}),
    //       })
    //   );
    //
    //   // Add series
    //   const series = chart.series.push(
    //       am5xy.LineSeries.new(root, {
    //         minBulletDistance: 10,
    //         connect: false,
    //         xAxis,
    //         yAxis,
    //         // valueYField: this.yAxisName,
    //         valueYField: element,
    //         valueXField: this.xAxisName,
    //         tooltip: am5.Tooltip.new(root, {}),
    //       })
    //   );
    //
    //   // Assign parsed/processed data to series
    //   series.data.setAll(this.parsedResponse);
    //
    //   series.get('tooltip').label.set('text', '{valueYField}: {valueY}');
    //
    //   series.strokes.template.setAll({
    //     strokeWidth: 3,
    //     templateField: 'strokeSettings',
    //   });
    //
    //   // Add cursor
    //   // const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {
    //   //   behavior: 'zoomX',
    //   //   xAxis,
    //   // }));
    //   // cursor.lineY.set('visible', false);
    //
    //   // Add scrollbar
    //   chart.set('scrollbarX', am5.Scrollbar.new(root, {
    //     orientation: 'horizontal',
    //   }));
    //
    //   // Make stuff animate on load
    //   series.appear(1000, 100);
    //   chart.appear(1000, 100);
    //
    //
    // })


  //   // Create chart
  //   const chart = root.container.children.push(
  //       am5xy.XYChart.new(root, {
  //         focusable: true,
  //         panX: true,
  //         panY: true,
  //         wheelX: 'panX',
  //         wheelY: 'zoomX',
  //       })
  //   );
  //
  //   const easing = am5.ease.linear;
  //
  //   // Create axes
  //   const xAxis = chart.xAxes.push(
  //       am5xy.DateAxis.new(root, {
  //         maxDeviation: 0.1,
  //         groupData: true,
  //         groupCount: 500,
  //         baseInterval: {
  //           timeUnit: 'hour',
  //           count: 1,
  //         },
  //         renderer: am5xy.AxisRendererX.new(root, {
  //           // minGridDistance: 50,
  //         }),
  //         tooltip: am5.Tooltip.new(root, {}),
  //       })
  //   );
  //
  //   const yAxis = chart.yAxes.push(
  //       am5xy.ValueAxis.new(root, {
  //         maxDeviation: 0.1,
  //         renderer: am5xy.AxisRendererY.new(root, {}),
  //         tooltip: am5.Tooltip.new(root, {}),
  //       })
  //   );
  //
  //   // console.log(this.yAxisName)
  //
  //   // Add series
  //   const series = chart.series.push(
  //       am5xy.LineSeries.new(root, {
  //         minBulletDistance: 10,
  //         connect: false,
  //         xAxis,
  //         yAxis,
  //         valueYField: this.yAxisName,
  //         valueXField: this.xAxisName,
  //         tooltip: am5.Tooltip.new(root, {}),
  //       })
  //   );
  //
  //   // Assign parsed/processed data to series
  //   series.data.setAll(this.parsedResponse);
  //
  //   console.log(series)
  //
  //   series.get('tooltip').label.set('text', '{valueYField}: {valueY}');
  //
  //   series.strokes.template.setAll({
  //     strokeWidth: 3,
  //     templateField: 'strokeSettings',
  //   });
  //
  //   // Add cursor
  //   const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {
  //     behavior: 'zoomX',
  //     xAxis,
  //   }));
  //   // cursor.lineY.set('visible', false);
  //
  //   // Add scrollbar
  //   chart.set('scrollbarX', am5.Scrollbar.new(root, {
  //     orientation: 'horizontal',
  //   }));
  //
  // // Make stuff animate on load
  //   series.appear(1000, 100);
  //   chart.appear(1000, 100);

  },
  beforeDestroy() {
    if (this.root) {
      this.root.dispose();
    }
  },
  watch: {
    // parsedData() {
    //
    //   // Load and parsed external data
    //   // this.loadParseData();
    //
    //   // Create one chart per element in this.yAxesArray
    //   this.yAxesArray.map(element => this.createChart((element)))
    // },
    yAxesArray() {

      // Load and parsed external data
      // this.loadParseData();

      // Create one chart per element in this.yAxesArray
      this.yAxesArray.map(element => this.createChart((element)))
    },
  },
  methods: {
    // Return responseType 'type' from result object (only string parsed to first comma)
    getResponseType(resultType) {
      return resultType.split(',')[0];
    },
    // Return JSON data from inputted CSV data, convert nullValue to null
    convertCSVToJSON(csv, nullValue) {

      let lines = csv.split('\n');


      // TEST DEV BLOCK //
      const displayDescription = lines.filter((line) => line.startsWith('# display_description = '))

      let keys = []
      if (displayDescription.length === 1) {
        keys = displayDescription[0].replace('# display_description = ', '').split(',')
        const removeKeys = ['timestamp_iso']
        this.yAxesArray = keys.filter(element => !removeKeys.includes(element))
        // console.log(this.yAxesArray)
      }
      // TODO refine error handling
      else {
        console.log('Error parsing NEAD file because header does not have a row that starts with: "# display_description = "');
        return {}
      }

      // TEST code for removing NEAD metadata header lines that start with '#'
      lines = lines.filter((line) => !line.startsWith('#'))


      // TEST END DEV BLOCK //
      // air_pressure = [
      //     [145654]
      // ]
      // [
      //     {
      //       timestamp: blah
      //       aipr_press
      //     }
      // ]

      // Remove last line if it is an empty string
      if (lines[lines.length -1] === '') {
        lines.pop()
      }

      // TEST comment this out
      // const keys = lines[0].split(',');

      return lines.slice(1).map(line => line.split(',').reduce((acc, cur, i) => {

        // TODO possible add logic that tests that keys.length equals length of comma separated line before adding JSON object

        const toAdd = {};

        if (cur === nullValue) {
          cur = null
        }

        toAdd[keys[i]] = cur;

        return { ...acc, ...toAdd };
      }, {}));
    },
    createChart(yAxisDivID) {

      // console.log(this.parsedData)

      const root = am5.Root.new(yAxisDivID);

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
          }),
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

      // Add cursor
      const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {
        behavior: 'zoomX',
        xAxis,
      }));
      // cursor.lineY.set('visible', false);

      // Add scrollbar
      chart.set('scrollbarX', am5.Scrollbar.new(root, {
        orientation: 'horizontal',
      }));

      chart.appear(1000, 100);


      // Add series
      const series = chart.series.push(
          am5xy.LineSeries.new(root, {
            minBulletDistance: 10,
            connect: false,
            xAxis,
            yAxis,
            // valueYField: this.yAxisName,
            // TEST
            valueYField: yAxisDivID,
            valueXField: this.xAxisName,
            tooltip: am5.Tooltip.new(root, {}),
          })
      );

      series.get('tooltip').label.set('text', '{valueYField}: {valueY}');

      series.strokes.template.setAll({
        strokeWidth: 3,
        templateField: 'strokeSettings',
      });


      // Make stuff animate on load
      series.appear(1000, 100);
      chart.appear(1000, 100);


      // TEST
      // Process data
      const processor = am5.DataProcessor.new(root, {
        dateFields: [this.xAxisName],
        dateFormat: this.xAxisFormat,
        // numericFields: [this.yAxisName],
        numericFields: this.yAxesArray,
      });
      processor.processMany(this.parsedResponse);

      // Assign parsed/processed data to series
      series.data.setAll(this.parsedResponse);

      // TEST
      return () => root.dispose();

    },
    // Assign this.parsedData to loaded and parsed external data
    loadParseData() {

      am5.net.load(this.apiUrl).then((result) => {

        // Get responseType 'type' from response header, this indicates if external data is in JSON or CSV format
        const responseType = this.getResponseType(result.type)

        if (responseType === 'application/json') {
          this.parsedData = am5.JSONParser.parse(result.response);
        }
        else if (responseType === 'text/csv') {
          // TODO dynamically assign nullValue in call below, will need to parse nodata value from NEAD
          this.parsedData = this.convertCSVToJSON(result.response, '')
          // TEST
          this.isFetching = false;
        }
        else {
          console.log(`Error loading ${this.apiUrl}, response type ${responseType} is not compatible with application.`);
        }
      }).catch((result) => {
          console.log(`Error loading ${result.xhr.this.responseURL}`);
         }
      );

      return this.parsedData;

      },
  },
  data() {
    return {
      yAxesArray : [],
      yAxisName: 'net_radiation',
      parsedResponse: [],
      parsedData: [],
      isFetching: true,
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
  height: 350px;
}

</style>