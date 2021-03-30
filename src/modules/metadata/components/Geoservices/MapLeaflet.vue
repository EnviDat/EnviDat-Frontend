<template>
  <div :id="mapDivId" style="height: 100%; width: 100%; z-index: 100;">
    <div class="zoom">
      <zoom-btn @zoomIn="zoomIn" @zoomOut="zoomOut" @zoomToGeometry="zoomToExtent(wmsLayer.bbox)"/>
    </div>
    <v-card ripple class="basemap-toggle">
      <img width="40" height="40" v-if="basemap==='streets'" src="./satellite-icon.png" @click="basemap='satellite'">
      <img width="40" height="40" v-if="basemap==='satellite'" src="./streets-icon.png" @click="basemap='streets'">
    </v-card>
    <div style="position: absolute; bottom: 70px; right: 16px; z-index: 99999; cursor: auto;">
      <slot></slot>
    </div>
    <div  v-if="map">
    <map-leaflet-point v-for="(point, key) in featureInfoPts" :key="key" :data="point" @add="addPoint"
                       @remove="removePoint"></map-leaflet-point>
    </div>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-bing-layer';
import axios from 'axios';
import MapLeafletPoint from '@/modules/metadata/components/Geoservices/MapLeafletPoint';
import markerIcon from '@/assets/map/marker-icon.png';
import markerIcon2x from '@/assets/map/marker-icon-2x.png';
import markerIconShadow from '@/assets/map/marker-shadow.png';
import { leafletLayer } from './layer-leaflet';
import ZoomBtn from './ZoomBtn';

export default {
  name: 'MapLeaflet',
  components: {
    MapLeafletPoint,
    ZoomBtn,
  },
  data: () => ({
    bingApiKey: process.env.VUE_APP_BING_API_KEY,
    map: null,
    mapLayer: null,
    basemapLayer: null,
    markers: [],
    markerIcon,
    markerIcon2x,
    markerIconShadow,
  }),
  props: {
    wmsLayer: Object,
    site: Object,
    featureInfoPts: Array,
    opacity: Number,
    mapDivId: String,
  },
  computed: {
    linkedScreens() {
      return this.$store.state.geoservices.linkedScreens;
    },
    extent() {
      return this.$store.state.geoservices.extent;
    },
    basemap: {
      get() {
        return this.$store.state.geoservices.basemap;
      },
      set(value) {
        this.$store.commit('setBasemap', value);
      },
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
    removeSite() {
      this.map.removeLayer(this.siteLayer);
      this.siteLayer = null;
    },
    addSite() {
      // Set marker icon
      const iconOptions = L.Icon.Default.prototype.options;
      iconOptions.iconUrl = this.markerIcon;
      iconOptions.iconRetinaUrl = this.markerIcon2x;
      iconOptions.shadowUrl = this.markerIconShadow;
      const icon = L.icon(iconOptions);

      // Add geodata to map
      this.siteLayer = L.geoJSON(this.site.geoJSON, {
        pointToLayer(feature, latlng) {
          return L.marker(latlng, {
            icon,
            opacity: 0.65,
            riseOnHover: true,
          });
        },
        style: {
          color: this.color,
          fillOpacity: this.fillAlpha,
          opacity: 1,
          weight: this.outlineWidth,
        },
      });
      this.map.addLayer(this.siteLayer);
    },
    getFeatureInfo(latlng) {
      if (Math.abs(latlng[0]) > 90 || Math.abs(latlng[1]) > 180) {
        return;
      }
      let start = 0;
      const featureinfo = [];
      const promises = [];
      while (start < this.$store.state.geoservices.layerConfig.layers.length) {
        const url = this.getFeatureInfoUrl(latlng, start, start + 50);
        const promise = axios.get(url)
          .then((res) => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(res.data, 'text/xml');
            const layers = xmlDoc.getElementsByTagName('Layer');
            layers.forEach((layer) => {
              featureinfo.push({
                name: layer.attributes.name.nodeValue,
                value: Number(layer.childNodes[1].attributes.value.nodeValue),
              });
            });
          });
        promises.push(promise);
        start += 50;
      }
      Promise.all(promises)
        .then(() => this.$store.commit('addTimeSeries',
          {
            values: featureinfo,
            coords: latlng,
          }));
    },
    getFeatureInfoUrl(latlng, start, stop) {
      // Construct a GetFeatureInfo request URL given a point
      const point = this.map.latLngToContainerPoint(latlng, this.map.getZoom()); // coords to n pixels from upper left corner
      const size = this.map.getSize(); // map container dimensions (in pixel)
      let bbox = this.map.getBounds(); // bbox in WGS coordinates
      // eslint-disable-next-line no-underscore-dangle
      bbox = `${bbox._southWest.lat},${bbox._southWest.lng},${bbox._northEast.lat},${bbox._northEast.lng}`;
      const layers = this.$store.state.geoservices.layerConfig.layers.map(layer => layer.name)
        .slice(start, stop);
      const params = {
        request: 'GetFeatureInfo',
        service: 'WMS',
        srs: 'EPSG:4326',
        version: '1.3.0',
        bbox,
        height: size.y,
        width: size.x,
        query_layers: layers,
        info_format: 'text/xml',
        i: point.x,
        j: point.y,
      };
      return this.wmsLayer.baseURL + L.Util.getParamString(params, this.wmsLayer.baseURL, true);
    },
    zoomIn() {
      this.map.zoomIn();
    },
    zoomOut() {
      this.map.zoomOut();
    },
    setupMap() {
      this.map = new L.Map(this.mapDivId,
        {
          zoomControl: false,
          maxBounds: [
            [-90, -180],
            [90, 180],
          ],
          maxBoundsViscosity: 0.5,
        });
      L.control.scale().addTo(this.map);
      this.replaceLayer();
      this.replaceBasemap();

      this.map.on('click', e => this.getFeatureInfo(e.latlng));
      this.map.on('drag', () => this.$store.commit('setExtent', this.map.getBounds()));
      this.map.on('zoom', () => this.$store.commit('setExtent', this.map.getBounds()));
      if (this.site) {
        this.addSite();
      }
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
      } else if (this.wmsLayer) {
        this.zoomToExtent(this.wmsLayer.bbox);
        this.mapLayer = leafletLayer(this.wmsLayer);
        this.map.addLayer(this.mapLayer);
        this.mapLayer.setOpacity(this.opacity / 100);
        this.mapLayer.bringToFront();
      }
    },
    replaceBasemap() {
      if (this.basemapLayer) {
        this.map.removeLayer(this.basemapLayer);
      }
      this.basemapLayer = this.basemap === 'streets' ? this.streets : this.satellite;
      this.map.addLayer(this.basemapLayer);
      this.basemapLayer.bringToBack();
    },
    addPoint(data) {
      const marker = L.circle(data.coords, {
        id: data.id,
        color: data.color,
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 1000,
      }).addTo(this.map);
      marker.bindPopup(`${data.id} Coords: ${data.coords.lat} / ${data.coords.lng}`);
      this.markers.push(marker);
    },
    removePoint(id) {
      const marker = this.markers.find(m => m.options.id === id);
      this.map.removeLayer(marker);
      this.markers = this.markers.filter(m => m.options.id !== id);
    },
  },
  watch: {
    opacity() {
      this.mapLayer.setOpacity(this.opacity / 100);
    },
    linkedScreens() {
      if (this.linkedScreens && !this.map.getBounds()
        .equals(this.extent)) {
        this.map.fitBounds(this.extent);
      }
    },
    extent() {
      if (this.linkedScreens && !this.map.getBounds().equals(this.extent)) {
        this.map.fitBounds(this.extent);
      }
    },
    wmsLayer: {
      handler() {
        this.replaceLayer();
      },
      deep: true,
    },
    basemap() {
      this.replaceBasemap();
    },
    site() {
      if (this.site) this.addSite();
      else this.removeSite();
    },
  },
  mounted() {
    this.setupMap();
  },
  beforeDestroy() {
    if (this.map) this.map.remove();
  },
};
</script>

<style scoped>
.leaflet-container {
  cursor: default;
}

.basemap-toggle {
  position: absolute;
  bottom: 20px;
  right: 15px;
  z-index: 10000;
  cursor: pointer;
  padding: 2px;
  width: 44px;
  height: 44px;
}

.zoom {
  position: absolute;
  padding: 10px;
  z-index: 999;
}
</style>
