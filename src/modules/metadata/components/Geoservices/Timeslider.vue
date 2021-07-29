<template>
  <v-card style="width: 100%; max-width: 100%;">
    <v-row class="pb-0" justify="center" align="center" style="height: 20%;" no-gutters>
      {{ currentName }}
    </v-row>
    <v-row align="center" style="height: 80%;" no-gutters>
      <v-col style="max-width: 50px;">
        <v-btn icon small @click="previous()" :disabled="this.currentIndex <= 0">
          <v-icon>arrow_left</v-icon>
        </v-btn>
      </v-col>
      <v-col style="height: 100%; width: 100%;" class="grow">
        <div :id="divId" style="width: 100%; height: 100%;"></div>
      </v-col>
      <v-col style="max-width: 50px;">
        <v-btn icon small @click="next()" :disabled="this.currentIndex >= this.nDataPoints - 1">
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
      updateSelection() {
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
    computed: {
      currentIndex() {
        return this.chart ? this.chart.chart.dataProvider.findIndex(dataPoint => dataPoint.name === this.selected) : null;
      },
      currentName() {
        return this.chart ? this.chart.chart.dataProvider[this.currentIndex].name : null;
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
          minorGridEnabled: false,
          gridThickness: 0,
          parseDates: false,
          labelsEnabled: false,
        },
        chartCursor: {
          enabled: true,
          bulletsEnabled: true,
          valueLineBalloonEnabled: false,
          valueLineEnabled: false,
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
            showBalloon: true,
            balloonText: '[[name]]',
            showHandOnHover: true,
          },
        ],
        valueAxes: [
          {
            id: 'ValueAxis-1',
            autoGridCount: false,
            axisThickness: 0,
            gridThickness: 0,
            zeroGridAlpha: 0,
            labelsEnabled: false,
            minorGridEnabled: false,
            title: '',
          },
        ],
        balloon: {
          maxWidth: 500,
          fillAlpha: 1,
        },
        marginTop: 0,
        paddingTop: 0,
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
      this.updateSelection();
    },
    watch: {
      selected() {
        this.updateSelection();
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
