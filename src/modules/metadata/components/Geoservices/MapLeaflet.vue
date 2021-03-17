<template>
  <div :id="mapDivId" style="height: 100%; width: 100%; z-index: 100;">
    <div class="zoom">
      <zoom-btn @zoomIn="zoomIn" @zoomOut="zoomOut" @zoomToGeometry="zoomToExtent(layer.bbox)" />
    </div>
    <v-card ripple class="basemap-toggle">
      <img width="40" height="40" v-if="basemap==='streets'" src="./satellite-icon.png" @click="basemap='satellite'">
      <img width="40" height="40" v-if="basemap==='satellite'" src="./streets-icon.png" @click="basemap='streets'">
    </v-card>
    <div style="position: absolute; bottom: 70px; right: 10px; z-index: 99999;">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  /* eslint-disable new-cap */
  import { mapState } from 'vuex';

  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import 'leaflet-bing-layer';
  import { leafletLayer } from './layer-leaflet';
  import ZoomBtn from './ZoomBtn';

    export default {
      name: 'MapLeaflet',
      components: { ZoomBtn },
      data: () => ({
        map: null,
        mapLayer: null,
        basemap: null, // 'streets', 'satellite'
        basemapLayer: null,
      }),
      props: {
        layer: Object,
        mapDivId: String,
      },
      computed: {
        ...mapState([
          'config',
        ]),
        bingApiKey() {
          return this.config?.apiKeys?.bing;
        },
        streets() {
          return L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            noWrap: true,
            },
          );
        },
        satellite() {
          return L.tileLayer.bing({
            bingMapsKey: this.bingApiKey,
            imagerySet: 'AerialWithLabels',
            noWrap: true,
          });
        },
      },
      methods: {
        zoomIn() {
          this.map.zoomIn();
        },
        zoomOut() {
          this.map.zoomOut();
        },
        setupMap() {
          this.map = new L.Map(this.mapDivId, { zoomControl: false });
          this.map.setView(L.latLng(46.57591, 7.84956), 8);
          this.basemap = 'streets';
          L.control.scale()
            .addTo(this.map);
          this.replaceLayer();
        },
        zoomToExtent(bbox) {
          this.map.fitBounds([
            [bbox.miny, bbox.minx],
            [bbox.maxy, bbox.maxx],
          ]);
        },
        replaceLayer() {
          if (this.mapLayer) {
            this.map.removeLayer(this.mapLayer);
            this.mapLayer = null;
          }
          if (this.layer) {
            this.mapLayer = leafletLayer(this.layer);
            this.map.addLayer(this.mapLayer);
            this.mapLayer.bringToFront();
            this.zoomToExtent(this.layer.bbox);
          }
        },
      },
      watch: {
          layer: {
            handler() {
              this.replaceLayer();
            },
            deep: true,
          },
        basemap() {
          if (this.basemapLayer) {
            this.map.removeLayer(this.basemapLayer);
          }
          this.basemapLayer = this.basemap === 'streets' ? this.streets : this.satellite;
          this.map.addLayer(this.basemapLayer);
          this.basemapLayer.bringToBack();
        },
      },
      mounted() {
        this.setupMap();
      },
      beforeDestroy() {
        if (this.map) {
          this.map.remove();
        }
      },
    };
</script>

<style scoped>
  .basemap-toggle {
    position: absolute;
    bottom: 20px;
    right: 15px;
    z-index: 10000;
    cursor: pointer;
    padding: 2px;
    width:44px;
    height: 44px;
  }
  .zoom {
    position: absolute;
    padding: 10px;
    z-index: 999;
  }
</style>
