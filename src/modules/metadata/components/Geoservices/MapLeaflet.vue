<template>
  <div :id="mapDivId" style="height: 100%; width: 100%; z-index: 100;">

    <basemap-toggle v-model="basemap" class="basemap-toggle"></basemap-toggle>

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
import { mapState } from 'vuex';
import {
  MAP_ZOOM_IN,
  MAP_ZOOM_OUT,
  MAP_ZOOM_CENTER,
  eventBus,
} from '@/factories/eventBus';
import { leafletLayer } from './layer-leaflet';
import BasemapToggle from './BasemapToggle/BasemapToggle';


export default {
  name: 'MapLeaflet',
  components: {
    BasemapToggle,
    MapLeafletPoint,
  },
  data: () => ({
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
    maxExtent: Object,
    opacity: Number,
    mapDivId: String,
  },
  mounted() {
    eventBus.$on(MAP_ZOOM_IN, this.zoomIn);
    eventBus.$on(MAP_ZOOM_OUT, this.zoomOut);
    eventBus.$on(MAP_ZOOM_CENTER, this.triggerCenter);

    this.setupMap();
  },
  beforeDestroy() {
    eventBus.$off(MAP_ZOOM_IN, this.zoomIn);
    eventBus.$off(MAP_ZOOM_OUT, this.zoomOut);
    eventBus.$off(MAP_ZOOM_CENTER, this.triggerCenter);

    if (this.map) {
      this.map.remove();
    }
  },
  computed: {
    ...mapState([
      'config',
    ]),
    layerConfig() {
      return this.$store.state.geoservices.layerConfig;
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
        bingMapsKey: this.config?.apiKeys?.bing || null,
        imagerySet: 'AerialWithLabels',
        noWrap: true,
      });
    },
  },
  methods: {
    setBasemap(value) {
      this.basemap = value;
    },
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
      while (start < this.layerConfig.layers.length) {
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
      const layers = this.layerConfig.layers.map(layer => layer.name).slice(start, stop);
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
      return this.layerConfig.baseURL + L.Util.getParamString(params, this.layerConfig.baseURL, true);
    },
    zoomIn(mapId) {
      if (this.mapDivId === mapId) {
        this.map.zoomIn();
      }
    },
    zoomOut(mapId) {
      if (this.mapDivId === mapId) {
        this.map.zoomOut();
      }
    },
    triggerCenter(mapId) {
      if (this.mapDivId === mapId) {
        this.zoomToExtent(this.maxExtent);
      }
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
      this.replaceBasemap();

      if (this.layerConfig && this.layerConfig.timeseries) {
        this.map.on('click', e => this.getFeatureInfo(e.latlng));
      }
      if (this.site) {
        this.addSite();
      }
      this.zoomToExtent(this.maxExtent);
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
      } else if (this.wmsLayer) {
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
}

.zoom {
  position: absolute;
  padding: 10px;
  z-index: 999;
}
</style>
