<template>
  <div id="map" ref="map">
    <div style="position: absolute; z-index: 9999; bottom: 20px;">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import 'leaflet-bing-layer';

import L from 'leaflet';
import { mapState } from 'vuex';

// HACK starts
// Solution to loading in the imgs correctly via webpack
// see more https://github.com/PaulLeCam/react-leaflet/issues/255
// stupid hack so that leaflet's images work after going through webpack
import marker from '../../../../assets/map/marker-icon.png';
import marker2x from '../../../../assets/map/marker-icon-2x.png';
import markerShadow from '../../../../assets/map/marker-shadow.png';

// HACK end

export default {
  props: {
    geom: Object,
    genericProps: Object,
    showPlaceholder: Boolean,
    zoomExtent: Object,
    color: String,
    fillAlpha: Number,
    outlineWidth: Number,
    selectedMapService: Object,
    mapServiceUrl: String,
  },
  data: () => ({
    marker,
    marker2x,
    markerShadow,
    map: null,
    mapServiceLayer: null,
  }),
  mounted() {
    this.setupMap();
  },
  beforeDestroy() {
    if (this.map) {
      this.map.remove();
    }
  },
  computed: {
    ...mapState(['config']),
    bingApiKey() {
      return this.config?.apiKeys?.bing;
    },
  },
  methods: {
    setupMap() {
      // Create map with basemap
      this.map = L.map(this.$refs.map, { scrollWheelZoom: false });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      // Set marker icon
      const iconOptions = L.Icon.Default.prototype.options;
      iconOptions.iconUrl = this.marker;
      iconOptions.iconRetinaUrl = this.marker2x;
      iconOptions.shadowUrl = this.markerShadow;
      const icon = L.icon(iconOptions);

      const bingKey = this.bingApiKey;
      this.addImageMapLayer(this.map, bingKey);

      // Add geodata to map
      L.geoJSON(this.geom, {
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
      }).addTo(this.map);

      // Zoom to extent of geodata
      this.map.fitBounds([
        [this.zoomExtent.minY, this.zoomExtent.minX],
        [this.zoomExtent.maxY, this.zoomExtent.maxX],
      ]);
      this.replaceMapServiceLayer();
    },
    addImageMapLayer(map, bingKey) {
      const streetTiles = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        },
      );

      const layers = [streetTiles];
      const baseMaps = {};

      if (bingKey) {
        const aerialTiles = L.tileLayer.bing({
          bingMapsKey: bingKey,
          imagerySet: 'AerialWithLabels',
        });
        layers.push(aerialTiles);

        baseMaps['Satellit (Bingmaps)'] = aerialTiles;
      }

      // put is afterwards, because default seems to be the last one
      baseMaps['Roads (OpenStreetMaps)'] = streetTiles;

      this.mapLayerGroup = L.layerGroup(layers);
      this.mapLayerGroup.addTo(map);

      L.control.layers(baseMaps).addTo(map);
    },
    replaceMapServiceLayer() {
      if (!this.map) return;
      if (this.mapServiceLayer) {
        this.map.removeLayer(this.mapServiceLayer);
      }
      if (this.mapServiceUrl && this.selectedMapService) {
        // eslint-disable-next-line new-cap
        this.mapServiceLayer = new L.tileLayer.wms(this.mapServiceUrl, {
          layers: this.selectedMapService.id,
          transparent: 'true',
          format: 'image/png',
        });
        this.map.addLayer(this.mapServiceLayer);
      }
    },
  },
  watch: {
    selectedMapService: {
      handler() {
        this.replaceMapServiceLayer();
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style></style>
