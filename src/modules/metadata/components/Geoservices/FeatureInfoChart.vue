<template>
  <div style="height: 100%; width: 100%;">
    <div v-if="chart">
    <feature-info-chart-graph v-for="(graph, key) in data" :data="graph" :key="key" @add="addGraph" @remove="removeGraph"></feature-info-chart-graph>
    </div>
  <div :id="divId" style="height: 100%; width: 100%;"></div>
  </div>
</template>

<script>
import FeatureInfoChartGraph from '@/modules/metadata/components/Geoservices/FeatureInfoChartGraph';

export default {
  name: 'FeatureInfoGraph',
  components: { FeatureInfoChartGraph },
  data() {
    return {
      chartData: null,
      graphData: [],
      graphs: [],
      chart: null,
    };
  },
  props: {
    divId: String,
    layers: Array,
  },
  computed: {
    data() {
      return this.$store.state.geoservices.timeseries;
    },
  },
  methods: {
    setupChart() {
      this.chartData = this.layers;
      const that = this;

      const config = {
        creditsPosition: 'bottom-right',
        type: 'serial',
        theme: 'none',
        zoomOutText: '', // Hack, to hide show all button
        marginRight: 80,
        autoMarginOffset: 20,
        marginTop: 7,
        dataProvider: this.chartData,
        valueAxes: [{
          axisAlpha: 0.2,
          dashLength: 1,
          position: 'left',
        }],
        mouseWheelZoomEnabled: true,
        graphs: [],
        chartScrollbar: {
          autoGridCount: true,
          graph: 'g1',
          scrollbarHeight: 40,
        },
        chartCursor: {
          limitToGraph: 'g1',
        },
        categoryField: 'timestamp',
        zoomOutOnDataUpdate: false,
        categoryAxis: {
          parseDates: true,
          axisColor: '#DADADA',
          dashLength: 1,
          minorGridEnabled: true,
        },
        export: {
          enabled: true,
        },
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
      };
      // eslint-disable-next-line no-undef
      AmCharts.makeChart(this.divId, config);
    },
    addGraph(data) {
      const key = `value_${data.id}`;
      this.chartData = this.chartData.map(cd => ({
          ...cd,
          [key]: data.values.find(d => d.name === cd.name).value,
        }));
      this.chart.chart.dataProvider = this.chartData;
      const graph = {
        id: `g${data.id}`,
        fillColorsField: 'selected',
        colorField: 'selectedColor',
        lineColorField: 'selectedLineColor',
        bulletField: 'selectedBullet',
        bulletColor: data.color,
        lineColor: data.color,
        bulletSizeField: 'selectedSize',
        balloonText: `[[${key}]]`,
        bullet: 'round',
        bulletBorderAlpha: 1,
        hideBulletsCount: 50,
        title: 'red line',
        valueField: key,
        useLineColorForBulletBorder: true,
        balloon: {
        drop: true,
      },
      };
      this.graphs.push(graph);
      this.chart.chart.addGraph(graph);
      this.chart.chart.validateData();
    },
    removeGraph(id) {
      const graph = this.graphs.find(g => g.id === `g${id}`);
      this.chart.chart.removeGraph(graph);
    },
    updateSelection() {
      this.chart.chart.dataProvider.forEach((dataPoint) => {
        if (dataPoint.name !== this.selected) {
          dataPoint.selectedColor = undefined;
          dataPoint.selectedSize = undefined;
        } else {
          dataPoint.selectedColor = '#8198b4';
          dataPoint.selectedSize = '20';
          dataPoint.balloon = true;
        }
      });
      this.chart.chart.validateData(); // update chart
    },
  },
  mounted() {
    this.setupChart();
  },
};
</script>

<style scoped>

</style>
