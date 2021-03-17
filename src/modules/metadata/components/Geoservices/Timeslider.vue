<template>
  <v-card style="width: 100%; max-width: 100%;">
    <v-row class="fill-height" align="center">

      <v-col>
        <v-btn icon small @click="previous()" :disabled="this.currentIndex <= 0">
          <v-icon>arrow_left</v-icon>
        </v-btn>
      </v-col>

      <div :id="divId" style="width: 100%; height: 100%;"></div>

      <v-col>
        <v-btn icon small @click="next()" :disabled="this.currentIndex > this.nDataPoints - 1">
          <v-icon>arrow_right</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
  import 'amcharts3';
  import 'amcharts3/amcharts/serial';
  import 'amcharts3/amcharts/pie';
  import 'amcharts3/amcharts/themes/light';

  export default {
    name: 'Timeslider',
    data() {
      return {
        chart: null,
      };
    },
    props: {
      selected: String,
      chartData: Array,
      divId: String,
    },
    methods: {
      next() {
        if (this.currentIndex < this.nDataPoints - 1 && this.chart) {
          this.$emit('select', this.chart.chart.dataProvider[this.currentIndex + 1].name);
        }
      },
      previous() {
        if (this.currentIndex > 0 && this.chart) {
          this.$emit('select', this.chart.chart.dataProvider[this.currentIndex - 1].name);
        }
      },
    },
    computed: {
      currentIndex() {
        return this.chart ? this.chart.chart.dataProvider.findIndex(dataPoint => dataPoint.name === this.selected) : null;
      },
      nDataPoints() {
        return this.chart ? this.chart.chart.dataProvider.length : null;
      },
    },
    mounted() {
      const that = this;
      const config = {
        type: 'serial',
        categoryField: 'timestamp',
        dataDateFormat: 'YYYY-MM-DD',
        creditsPosition: 'bottom-right',
        addClassNames: true,
        zoomOutText: '', // Hack, to hide show all button
        categoryAxis: {
          parseDates: true,
        },
        chartCursor: {
          enabled: true,
        },
        chartScrollbar: {
          enabled: true,
        },
        graphs: [
          {
            bulletHitAreaSize: 7,
            fillColorsField: 'selected',
            colorField: 'selectedColor',
            lineColorField: 'selectedLineColor',
            bullet: 'round',
            bulletField: 'selectedBullet',
            bulletColor: this.$vuetify.theme.primary,
            lineColor: this.$vuetify.theme.primary,
            bulletSizeField: 'selectedSize',
            id: 'AmGraph-1',
            title: 'graph 1',
            valueField: 'value',
            showBalloon: false,
            showHandOnHover: true,
          },
        ],
        valueAxes: [
          {
            id: 'ValueAxis-1',
            autoGridCount: false,
            axisThickness: 0,
            gridThickness: 0,
            labelsEnabled: false,
            minorGridEnabled: true,
            title: '',
          },
        ],
        zoomOutOnDataUpdate: false,
        listeners: [{
          event: 'init',
          method(e) {
            that.chart = e;
            e.chart.chartDiv.addEventListener('click', () => {
              // track cursor's last known position by "changed" event
              if (e.chart.lastCursorPosition !== undefined) {
                // get date of the last known cursor position
                const date = e.chart.dataProvider[e.chart.lastCursorPosition];
                that.$emit('select', date.name);
              }
            });
          },
        }, {
          event: 'changed',
          method(e) {
            e.chart.lastCursorPosition = e.index; // Log cursor's last known position
          },
        },
        ],
        dataProvider: this.chartData,
      };

      // eslint-disable-next-line no-undef
      AmCharts.makeChart(this.divId, config);
    },
    watch: {
      selected() {
        this.chart.chart.dataProvider.forEach((dataPoint) => {
          if (dataPoint.name !== this.selected) {
            dataPoint.selectedColor = undefined;
            dataPoint.selectedSize = undefined;
          } else {
            dataPoint.selectedColor = '#8198b4';
            dataPoint.selectedSize = '20';
          }
        });
        this.chart.chart.validateData(); // update chart
      },
    },
  };
</script>

<style scoped>
  .amcharts-graph-bullet {
    transition: all .3s ease-out;
    -webkit-transition: all .3s ease-out;
    -moz-transition: all .3s ease-out;
    -o-transition: all .3s ease-out;
  }

  .amcharts-graph-bullet:hover {
    fill-opacity: 0.8;
    stroke-opacity: 1;
    r: 10;
    stroke-width: 4px;
  }

</style>
