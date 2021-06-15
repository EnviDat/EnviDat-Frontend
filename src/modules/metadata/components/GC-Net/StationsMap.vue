<template>
  <v-card>
    
          <!-- :style="`height: ${iframeScreenHeight()}px; height: 75vh; overflow: auto;`" -->
    <div
          :style="`height: ${iframeScreenHeight()}px; height: ${height}; overflow: hidden;`"
          class="pa-1"
          id="map_svg"
          ref="map_svg"
          v-html="mapHTML">

    </div>
  </v-card>
</template>

<script>
import mapHTML from './map_html.html';

export default {
  props: {
    currentStation: Object,
    height: {
      type: String,
      default: '70vh',
    },
  },
  data: () => ({
    mapHTML,
  }),
  mounted() {

    const that = this;
    const links = this.$el.querySelectorAll('#map_svg svg > g > g > a');

    if (this.$vuetify.breakpoint.smAndDown) {
      const mainSVG = this.$el.querySelector('#map_svg svg');

      if (this.$vuetify.breakpoint.sm) {
        mainSVG.setAttribute('style', 'height: 80% !important;');
      } else {
        // mainSVG.setAttribute('style', 'height: 120% !important;');
      }
    }

    links.forEach((el) => {
      const url = el.getAttribute('xlink:href');
      if (url) {
        // el.addEventListener('click', that.stationClick(url));
        el.onclick = function () {
          that.mapClick(url);
        };
        el.removeAttribute('xlink:href');
      }
      el.removeAttribute('target');
    });

    if (this.currentStation) {
      this.highlightStation(this.currentStation);
    }    
  },
  watch: {
    currentStation() {
      if (this.currentStation) {
        this.highlightStation(this.currentStation);
      }
    },
  },
  methods: {
    highlightStation(station) {
        const links = this.$el.querySelectorAll('#map_svg svg > g > g > a');

        links.forEach((el) => {
          el.classList.remove('current');
        });

        const stationLink = this.$el.querySelector(`#map_svg svg > g > g > a#${station.alias}`);
        stationLink.classList.add('current');
    },
    iframeScreenHeight() {
      return window.innerHeight - 150;
    },
    mapClick(stationURL) {
      this.$emit('mapClick', stationURL);
    },
  },
};

</script>

<style scoped>

</style>
