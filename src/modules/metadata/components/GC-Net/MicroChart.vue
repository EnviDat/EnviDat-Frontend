/* eslint-disable consistent-return */
<template>

  <v-card :id="stationId"
          ref="main_container"
          class="metadataResourceCard"
          :color="darkTheme ? 'primary' : 'white'"
          :dark="darkTheme"       
          v-show="visible" >

    <v-container fluid
                 class="pa-0" >

      <v-row no-gutters >

        <v-col v-show="image"
                cols="3"
                id="image_col"
                @click="catchDetailClick(station.alias)" >

          <v-img :src="image"
                  @load="imageLoadSuccess"
                  @error="imageLoadError"
                  height="100%" 
                  style="border-bottom-left-radius: 4px; border-top-left-radius: 4px; cursor: pointer;" />

        </v-col>

        <v-col v-if="image && imageLoading"
                cols="3"
                id="loading_image_col" >
          <div class='skeleton skeleton-animation-shimmer' style="height: 100%;" >
            <div style="width: 100%;" class='bone bone-type-image'></div>
          </div>
        </v-col>
 
        <v-col :cols="currentColumnNum"
                class="pa-2">

          <v-row no-gutters >

            <v-col class="text-h5 v-card__title"
                    style="font-weight: 700;">
              {{ station.name }}
            </v-col> 

          </v-row>

          <v-row no-gutters>
            
            <v-col v-if="!dataError && dataAvailable()"
                    id="chartSubText"
                    class="smallChartSubText pa-0 pb-1">
              {{ chartSubText }}
            </v-col>
          </v-row>          

          <v-row no-gutters >

            <v-col v-if="chartIsLoading"
                    class="py-0"
                    cols="12" 
                    style="width: 100%">
              <div class='skeleton skeleton-animation-shimmer' :style="`height: ${chartHeight};`" >
                <div style="width: 100%;" class='bone bone-type-image'></div>
              </div>
            </v-col>

            <v-col v-if="!chartIsLoading && !dataAvailable() && !dataError"
                  cols="12" 
                  class="text-body-1 pb-1"
                  :style="`color: red;`" >
              {{ noDataText }}
            </v-col>

            <!-- <v-col v-if="dataError"
                    cols="12"
                    class="smallText py-1"
                    :style="`color: red;`" >
              {{ dataError }}
            </v-col> -->

            <v-col v-show="!dataError"
                    :id="microChartId"
                    ref="microChart"
                    class="mircoChart"
                    :style="`background-color: #f5f5f5; height: ${chartHeight}; border: ${chartIsLoading ? 0 : 1}px solid #eee;`" >
            </v-col>

          </v-row>

          <v-row no-gutters >

            <v-col class="grow pt-1 pr-1"
                    id="statusInfo"
                    cols="10" >

              <v-row no-gutters>
                
                <v-col v-if="firstParameterData"
                        id="FirstDate"
                        class="smallChartSubText pa-0 pb-1" >
                  {{ `First Data point: ${firstParameterData}` }}
                </v-col>
              </v-row>

              <v-row no-gutters>

                <BaseStatusLabelView v-if="infoObject"
                                      :loading="chartIsLoading"
                                      :statusIcon="infoObject.icon"
                                      :statusColor="infoObject.icon"
                                      :statusText="infoObject.title"
                                      :expandedText="infoObject.message"
                                      :showExpandIcon="false"
                                      textCssClass="statusInfoText" />

                <BaseStatusLabelView v-if="warningObject"
                                      :loading="chartIsLoading"
                                      :statusIcon="warningObject.icon"
                                      :statusColor="warningObject.icon"
                                      :statusText="warningObject.title"
                                      :expandedText="warningObject.message"
                                      :showExpandIcon="false"
                                      textCssClass="statusInfoText" />

                <BaseStatusLabelView v-if="errorObject"
                                      :loading="chartIsLoading"
                                      :statusIcon="errorObject.icon"
                                      :statusColor="errorObject.icon"
                                      :statusText="errorObject.title"
                                      :expandedText="errorObject.message"
                                      :showExpandIcon="false"
                                      textCssClass="statusInfoText" />
              </v-row>

            </v-col>

            <v-col class="grow pt-1"
                    style="align-self: flex-end;"
                    cols="2" >

              <v-row no-gutters
                      justify="end"
                      class="pb-2">

                <BaseIconButton materialIconName="bar_chart"
                                color="accent"
                                iconColor="black"
                                isElevated
                                tooltipText="Show measurement details"
                                @clicked="catchDetailClick(station.alias)" />
              </v-row>

              <v-row no-gutters
                      justify="end">

                <BaseIconButton materialIconName="file_download"
                                color="accent"
                                iconColor="black"
                                isElevated
                                tooltipText="Download station data"
                                @clicked="catchDetailClick(station.alias)" />
              </v-row>
            </v-col>
          </v-row>

        </v-col>
      </v-row>

    </v-container>
  </v-card>

</template>

<script>
import {
  min,
  format,
} from 'date-fns';

import {
  eventBus,
  GCNET_OPEN_DETAIL_CHARTS,
} from '@/factories/eventBus';
import {
  addStartEndDateUrl,
  hasData,
} from '@/factories/chartFactory';

import axios from 'axios';
import uPlot from 'uplot/dist/uPlot.esm';
import 'uplot/dist/uPlot.min.css';
import BaseIconButton from '@/components/BaseElements/BaseIconButton';
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView';

export default {
  name: 'MicroChart',
  props: {
    station: Object,
    image: String,
    maxHeight: {
      type: Number,
      default: 180,
    },
    apiUrl: String,
    fallbackUrl: String,
    parameter: String,
    chartHeight: {
      type: Number,
      default: 65,
    },
    delay: {
      type: Number,
      default: 10,
    },
    darkTheme: Boolean,
  },
  components: {
    BaseIconButton,
    BaseStatusLabelView,
  },
  beforeMount() {
   
    const imgs = require.context('@/assets/logo', false, /\.png$/);
    const imgCache = {};

    imgs.keys().forEach((key) => {
      imgCache[key] = imgs(key);
    });

    this.logoImgs = imgCache;
  },
  mounted() {
    let that = this;

    setTimeout(() => {
      that.visible = true;

      if (that.$refs && that.$refs.main_container) {
        that.loadChart();
      }
      that = null;
    }, this.delay);
  },
  beforeDestroy() {
    this.clearChart();
  },
  computed: {
    microChartId() {
      return `${this.stationId}_microChart`;
    },
    stationId() {
      return `${this.station.id}_${this.station.alias ? this.station.alias : this.station.name}`;
    },
    chartSubText() {
      return `${this.chartIsLoading ? 'Loading' : 'Showing'} the ${this.parameter ? `'${this.parameter}' parameter` : '[parameter missing]'} from ${new Date(this.minDate).toLocaleDateString('en-US')} to ${new Date(this.maxDate).toLocaleDateString('en-US')}`;
    },
    currentColumnNum() {
      // return this.image && this.imageSuccess ? 9 : 12;
      return (this.image && this.imageLoading) || (this.image && this.imageSuccess) ? 9 : 12;
    },
    infoObject() {
      if (this.isFallback) {
        return {
          title: 'Recent data unavailable, fallback data is shown',
          message: `The main data at ${this.apiUrl} could not been loaded. Data from ${this.fallbackUrl} is shown.`,
          icon: 'info',
        };
      }

      return null;
    },    
    warningObject() {
      if (this.imageError) {
        return {
          title: 'Image failed loading',
          message: `The Image ${this.image} could not been loaded.`,
          icon: 'warning',
        };
      }

      return null;
    },    
    errorObject() {
      if (this.dataError) {
        return {
          title: `Chart ${this.isFallback ? 'fallback' : ''} data could not been loaded`,
          message: this.dataError,
          icon: 'error',
        };
      }

      return null;
    },
  },
  methods: {
    lazyImage() {
      return this.imageError ? '' : this.logoImgs['./EnviDat_logo_64.png'];
    },
    imageLoadError() {
      this.imageLoading = false;
      this.imageError = true;
    },
    imageLoadSuccess() {
      this.imageLoading = false;
      this.imageSuccess = true;

      this.clearChart();
      this.makeSparkChart(this.data, this.parameter);
    },
    dataAvailable() {
      // has to be a method, it doesn't work as computed property
      return hasData(this.data, this.parameter);
    },
    loadChart() {
      this.clearChart();
      this.chartIsLoading = true;

      // clear and then new loading on the next tick is needed for the disposing to finish
      this.$nextTick(() => {
        // this.loadJsonCharts();
        this.loadJsonFiles(this.apiUrl);
      });
    },
    clearChart() {

      if (this.$refs.microChart) {

        const childs = this.$refs.microChart.children;

        if (childs) {
          for (let i = 0; i < childs.length; i++) {
            const child = childs[i];
            this.$refs.microChart.removeChild(child);
          }
        }
      }
    },
    loadJsonFiles(url, isFallback = false) {
      this.data = null;
      this.chartIsLoading = true;
      this.isFallback = isFallback;
      
      if (!isFallback) {
       url = addStartEndDateUrl(url);
      }
     
      axios
      .get(url)
      .then((response) => {
        this.chartIsLoading = false;        
        this.data = response.data;

        if (hasData(this.data, this.parameter)) {
          this.makeSparkChart(this.data, this.parameter);

          this.setFirstParameterData(this.data);
        } else if (isFallback) {
          this.dataError = `${this.noDataText} on the fallback for ${this.fallbackUrl}`;
        } else {
          this.loadJsonFiles(this.fallbackUrl, true);
        }
      })
      .catch((error) => {

        if (isFallback) {
          this.chartIsLoading = false;
          this.dataError = `${error.message} on the fallback for ${this.fallbackUrl}`;
        } else {
          this.loadJsonFiles(this.fallbackUrl, true);
        }
      });
    },
    setFirstParameterData(data) {
      if (!data || data.length <= 0) {
        return;
      }

      const unixAvailable = typeof data[0].timestamp === 'number';
      const dataParam = unixAvailable ? 'timestamp' : 'timestamp_iso';

      let firstDate = new Date(data[0][dataParam]);
      let lastDate = new Date(data[data.length - 1][dataParam]);

      // let firstDate = fromUnixTime(data[0][dataParam]);
      // let lastDate = fromUnixTime(data[data.length - 1][dataParam]);

      if (!unixAvailable) {
        const isoAvailable = typeof data[0].timestamp_iso === 'string';

        if (isoAvailable) {
          firstDate = new Date(data[0][dataParam]);
          lastDate = new Date(data[data.length - 1][dataParam]);
        } else {
          return;
        }
      }

      if (firstDate && lastDate) {
        const earliest = min([firstDate, lastDate]);
        this.firstParameterData = format(earliest, 'dd-MM-yyyy');
      }
    },
    makeSparkChart(data, chartParameter) {

      const x = [];
      const y = [];
      const dataLength = data ? data.length : 0;

      this.unit = chartParameter?.includes('temp') ? ' °' : '';

      if (dataLength > 0) {

        for (let i = 0; i < data.length; i++) {
          const entry = data[i];
          const param = entry[chartParameter];
          
          x.push(entry.timestamp);
          y.push(param);
        }

        this.makeSpark([x, y]);

        this.minDate = data[0].timestamp;
        this.maxDate = data[data.length - 1].timestamp;
      }

    },
    makeSpark(data) {
      const width = this.$refs.microChart.clientWidth !== 0 ? this.$refs.microChart.clientWidth : this.$refs.microChart.parentElement.clientWidth;
      this.sparkLineOptions.width = width; 

      this.sparkLineOptions.height = this.chartHeight;
      this.sparkLineOptions.plugins = [this.tooltipsPlugin(null, this.unit)];

      // eslint-disable-next-line new-cap
      const sparkChart = new uPlot(this.sparkLineOptions, data, this.$refs.microChart);

      return sparkChart;
    },
    /* eslint-disable no-unused-vars */
    tooltipsPlugin(opts, unit) {
      const that = this;

      // eslint-disable-next-line no-shadow
      function init(u, opts, data) {
        const plot = u.root.querySelector('.u-over');

        // eslint-disable-next-line no-multi-assign
        const ttc = u.cursortt = document.createElement('div');
        ttc.className = 'tooltip';
        ttc.textContent = '(x,y)';
        ttc.style.pointerEvents = 'none';
        ttc.style.position = 'absolute';
        ttc.style.background = 'rgba(0,0,255,0.1)';
        // plot.appendChild(ttc);

        u.seriestt = opts.series.map((s, i) => {
          if (i === 0) return;

          const tt = document.createElement('div');
          tt.className = 'tooltip';
          tt.textContent = 'Tooltip!';
          tt.style.pointerEvents = 'none';
          tt.style.position = 'absolute';
          tt.style.background = 'rgba(0,0,0,0.1)';
          tt.style.color = s.color;
          tt.style.display = s.show ? null : 'none';
          plot.appendChild(tt);
          // eslint-disable-next-line consistent-return
          return tt;
        });

        function hideTips() {
          // ttc.style.display = "none";
          u.seriestt.forEach((tt, i) => {
            if (i === 0) return;

            tt.style.display = 'none';
          });
        }

        function showTips() {
          // ttc.style.display = null;
          u.seriestt.forEach((tt, i) => {
            if (i === 0) return;

            const s = u.series[i];
            tt.style.display = s.show ? null : 'none';
          });
        }

        plot.addEventListener('mouseleave', () => {
          if (!u.cursor.locked) {
            // u.setCursor({ left: -10, top: -10 });
            hideTips();
          }
        });

        plot.addEventListener('mouseenter', () => {
          showTips();
        });

        hideTips();
      }

      function setCursor(u) {
        const { left, top, idx } = u.cursor;
        const tooltipUnit = that.unit;

        // this is here to handle if initial cursor position is set
        // not great (can be optimized by doing more enter/leave state transition tracking)
      // if (left > 0)
      //  u.cursortt.style.display = null;

        // u.cursortt.style.left = left + "px";
        // u.cursortt.style.top = top + "px";
        // u.cursortt.textContent = "(" + u.posToVal(left, "x").toFixed(2) + ", " + u.posToVal(top, "y").toFixed(2) + ")";
        u.cursortt.textContent = `(${u.posToVal(top, 'y').toFixed(2)})`;

        // can optimize further by not applying styles if idx did not change
        u.seriestt.forEach((tt, i) => {
          if (i === 0) return;

          const s = u.series[i];

          if (s.show) {
            // this is here to handle if initial cursor position is set
            // not great (can be optimized by doing more enter/leave state transition tracking)
            // if (left > 0)
            // tt.style.display = null;

            // const xVal = u.data[0][idx];
            const yVal = u.data[i][idx];

            tt.textContent = `(${yVal})${tooltipUnit}`;

            // tt.style.left = Math.round(u.valToPos(xVal, 'x')) + "px";
            // tt.style.top = Math.round(u.valToPos(yVal, 'y')) + "px";
          }
        });
      }

      return {
        hooks: {
          init,
          setCursor,
          setScale: [
            (u, key) => {
              // console.log('setScale', key);
            },
          ],
          setSeries: [
            (u, idx) => {
              // console.log('setSeries', idx);
            },
          ],
        },
      };
    },
    catchDetailClick(stationId) {
      eventBus.$emit(GCNET_OPEN_DETAIL_CHARTS, stationId);
    },
  },
  data: () => ({
    microChart: null,
    dataError: '',
    noDataText: 'No preview data available',
    chartIsLoading: true,
    isFallback: false,
    imageError: false,
    imageSuccess: false,
    imageLoading: true,
    showInfo: false,
    minDate: null,
    maxDate: null,
    firstParameterData: null,
    unit: '',
    statusIcons: ['info', 'warning', 'error'],
    sparkLineOptions: {
      class: 'spark',
      background: 'black',
      cursor: {
        show: true,
        y: false,
        drag: { setScale: false },
      },
      select: {
        show: false,
      },
      legend: {
        show: false,
      },
      scales: {
        x: {
          time: false,
        },
      },
      axes: [
        {
          show: false,
        },
        {
          show: false,
        },
      ],
      series: [
        {},
        {
          stroke: '#03a9f4',
          fill: '#b3e5fc',
        },
      ],
    },
    visible: false,
  }),
};
</script>

<style >
 .smallChartSubText {
   font-size: 0.7rem;
   word-break: break-word;
   line-height: 0.85rem;
 }

 .statusInfoText {
   font-size: 0.8rem;
   word-break: break-word;
   line-height: 0.9rem;
 }

.mircoChart > .uplot,
.mircoChart > .uplot > .u-wrap,
.mircoChart > .uplot > .u-wrap > canvas,
.mircoChart > .uplot > .u-wrap > .u-under,
.mircoChart > .uplot > .u-wrap > .u-over {
  width: inherit !important;
}

</style>
