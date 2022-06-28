<template>
  <div
    :id="mapDivId"
    ref="map"
    :style="`min-height: ${mapHeight + 'px'}; height: 100%;`"
  >

  </div>

</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-bing-layer';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import axios from 'axios';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import markerIcon from '@/assets/map/marker-icon.png';
import markerIcon2x from '@/assets/map/marker-icon-2x.png';
import markerIconShadow from '@/assets/map/marker-shadow.png';
import { mapState } from 'vuex';
import {
  MAP_ZOOM_IN,
  MAP_ZOOM_OUT,
  MAP_ZOOM_CENTER,
  MAP_GEOMETRY_MODIFIED,
  GCNET_OPEN_DETAIL_CHARTS,
  eventBus,
} from '@/factories/eventBus';
// import { leafletLayer } from './layer-leaflet';

/* eslint-disable vue/no-unused-components */

export default {
  name: 'MapLeaflet',
  components: {},
  props: {
    baseMapLayerName: String,
    wmsLayer: Object,
    site: Object,
    maxExtent: Object,
    opacity: Number,
    mapDivId: {
      type: String,
      default: 'map-small',
    },
    mapHeight: {
      type: Number,
      default: 0,
    },
    mapEditable: {
      type: Boolean,
      default: false,
    },
    isGcnet: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    eventBus.$on(MAP_ZOOM_IN, this.zoomIn);
    eventBus.$on(MAP_ZOOM_OUT, this.zoomOut);
    eventBus.$on(MAP_ZOOM_CENTER, this.triggerCenter);

    this.setupMap();

    if (this.mapEditable) {
      this.setupEditing();
    }
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
    ...mapState(['config']),
    layerConfig() {
      return this.$store?.state.geoservices.layerConfig || null;
    },
    streets() {
      return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        noWrap: true,
      });
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
    removeSite() {
      if (this.siteLayer) {
        this.map.removeLayer(this.siteLayer);
        this.siteLayer = null;
      }
      if (this.mapEditable) {
        const layerArray = this.map.pm.getGeomanLayers();
        layerArray.forEach((layer) => {
          this.map.removeLayer(layer);
        });
      }
    },
    addSite(geoJson) {
      if (!geoJson) {
        this.siteLayer = null;
        return;
      }

      let geoJsonArray = [];
      // const propertiesArray = [];

      if (geoJson.type === 'GeometryCollection') {
        // Split geometries from geometries list
        geoJson.geometries.forEach((geometry) => {
          geoJsonArray.push(geometry);
        });

        // } else if (geoJson.type === 'Feature') {
        //   // Split geometry from feature object
        //   geoJsonArray.push(geoJson.geometry);
        //   propertiesArray.push(geoJson.properties);

        // } else if (geoJson.type === 'FeatureCollection') {
        //   // Split geometries from feature list
        //   geoJson.features.forEach((feature) => {
        //     geoJsonArray.push(feature.geometry);
        //     propertiesArray.push(feature.properties);
        //   });
      } else {
        geoJsonArray = [geoJson];
      }

      const styleObj = this.getCustomLeafletStyle();

      const isGcnet = this.isGcnet;

      this.siteLayer = L.geoJSON(geoJsonArray, {
        pointToLayer(feature, latlng) {
          if (isGcnet) {

            if (feature.properties.active === false) {
              return L.marker(latlng, styleObj.gcnetInactiveStyle);
            }

            if (feature.properties.active === null) {
              return L.marker(latlng, styleObj.gcnetMissingStyle);
            }

            return L.marker(latlng, styleObj.gcnetStyle);
          }

          return L.marker(latlng, styleObj.customPointStyle);
        },
        style: styleObj.customPolygonStyle,
      });

      if (isGcnet) {
        this.siteLayer.eachLayer((layer) => {
          layer.bindTooltip(
            `<div">
            <b>${layer.feature.properties.name}</b>
            <p>
            Elevation: ${layer.feature.properties.elevation}
            </div>
            `,
            {
              className: 'rounded-xl text-md-center subtitle-1',
              permanent: false,
            },
          );

          // Open popup data modal on click
          layer.on('click', () => {
            this.catchGcnetStationClick(layer.feature.properties.alias);
          });
        });
      }

      // this.siteLayer.bindPopup(layer => layer.feature.properties.description);

      this.map.addLayer(this.siteLayer);

      // Editing event listeners on map layers
      if (this.mapEditable) {
        const allLayers = this.map.pm.getGeomanLayers();
        allLayers.forEach((editableLayer) => {
          editableLayer.on('pm:update', () => {
            this.triggerGeometryEditEvent();
          });
          editableLayer.on('pm:dragend', () => {
            this.triggerGeometryEditEvent();
          });
        });
      }
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
        const promise = axios.get(url).then((res) => {
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

      Promise.all(promises).then(() =>
        this.$store.commit('addTimeSeries', {
          values: featureinfo,
          coords: latlng,
        }),
      );
    },
    getFeatureInfoUrl(latlng, start, stop) {
      // Construct a GetFeatureInfo request URL given a point
      const point = this.map.latLngToContainerPoint(latlng, this.map.getZoom()); // coords to n pixels from upper left corner
      const size = this.map.getSize(); // map container dimensions (in pixel)
      let bbox = this.map.getBounds(); // bbox in WGS coordinates
      // eslint-disable-next-line no-underscore-dangle
      bbox = `${bbox._southWest.lat},${bbox._southWest.lng},${bbox._northEast.lat},${bbox._northEast.lng}`;
      const layers = this.layerConfig.layers
        .map((layer) => layer.name)
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
      return (
        this.layerConfig.baseURL +
        L.Util.getParamString(params, this.layerConfig.baseURL, true)
      );
    },
    zoomIn(mapId) {
      if (this.mapDivId !== mapId) {
        return;
      }

      this.map.zoomIn();
    },
    zoomOut(mapId) {
      if (this.mapDivId !== mapId) {
        return;
      }

      this.map.zoomOut();
    },
    triggerCenter(mapId) {
      if (this.mapDivId !== mapId) {
        return;
      }

      if (this.maxExtent) {
        this.zoomToExtent(this.maxExtent);
      }
    },
    setupMap() {
      if (this.isGcnet) {
        // Disable editing
        this.mapEditable = false;
      }

      this.map = new L.Map(this.$refs.map, {
        zoomControl: false,
        center: [46.943961, 8.19924],
        zoom: 7,
        maxBounds: [
          [-90, -180],
          [90, 180],
        ],
        maxBoundsViscosity: 1,
      });

      // Lock zoom to bounds
      this.map.setMinZoom(Math.ceil(Math.log2(Math.max(
        this.$refs.map.clientWidth,
        this.$refs.map.clientHeight,
      ) / 256)));

      L.control.scale().addTo(this.map);
      this.replaceBasemap();

/*
      if (this.layerConfig && this.layerConfig.timeseries) {
        this.map.on('click', e => this.getFeatureInfo(e.latlng));
      }
*/

      this.addSiteIfAvailable();
    },
    addSiteIfAvailable() {

      this.removeSite();

      if (this.site) {
        this.addSite(this.site);
      }

      if (this.maxExtent) {
        this.zoomToExtent(this.maxExtent);
      }

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
        this.mapLayer = this.leafletLayer(this.wmsLayer);
        this.map.addLayer(this.mapLayer);
        this.mapLayer.setOpacity(this.opacity / 100);
        this.mapLayer.bringToFront();
      }
    },
    leafletLayer(config) {
      // eslint-disable-next-line new-cap
      return new L.tileLayer.wms(config.baseURL, {
        layers: config.name,
        transparent: true,
        format: 'image/png',
        noWrap: true,
      });
    },
    replaceBasemap() {
      if (this.basemapLayer) {
        this.map.removeLayer(this.basemapLayer);
      }
      this.basemapLayer = this.baseMapLayerName === 'streets' ? this.streets : this.satellite;
      this.map.addLayer(this.basemapLayer);
      // this.basemapLayer.bringToBack();
    },
    geomanGeomsToGeoJSON(layerArray) {
      // Convert leaflet-geoman editing layers into GeoJSON for Leaflet

      const geoJSONArray = [];

      if (layerArray.length !== 0) {
        layerArray.forEach((geometry) => {
          const geoJSON = geometry.toGeoJSON();
          geoJSONArray.push(geoJSON.geometry);
        });
      }

      return geoJSONArray;
    },
    triggerGeometryEditEvent() {
      // Collect edited geometries and pass to event bus

      const layerArray = this.map.pm.getGeomanLayers();
      const geoJSONArray = this.geomanGeomsToGeoJSON(layerArray);
      eventBus.$emit(MAP_GEOMETRY_MODIFIED, geoJSONArray);
    },
    getCustomLeafletStyle() {
      const iconOptions = L.Icon.Default.prototype.options;
      iconOptions.iconUrl = this.markerIcon;
      iconOptions.iconRetinaUrl = this.markerIcon2x;
      iconOptions.shadowUrl = this.markerIconShadow;
      const icon = L.icon(iconOptions);
      return {
        customPointStyle: {
          icon,
          opacity: 0.65,
          riseOnHover: true,
        },
        customPolygonStyle: {
          color: this.$vuetify.theme.themes.light.accent,
          // fillOpacity: 0.5,
          // opacity: 1,
          // weight: 1,
        },
        gcnetStyle: {
          icon: L.divIcon({
            className: 'rounded-circle green',
            iconSize: [20, 20],
          }),
          opacity: 0.75,
          riseOnHover: true,
        },
        gcnetInactiveStyle: {
          icon: L.divIcon({
            className: 'rounded-circle red',
            iconSize: [20, 20],
          }),
          opacity: 0.75,
          riseOnHover: true,
        },
        gcnetMissingStyle: {
          icon: L.divIcon({
            className: 'rounded-circle grey',
            iconSize: [20, 20],
          }),
          opacity: 0.75,
          riseOnHover: true,
        },
      };
    },
    setupEditing() {
      // Set styles for markers and polygons
      const styleObj = this.getCustomLeafletStyle();
      this.map.pm.setGlobalOptions({
        markerStyle: styleObj.customPointStyle,
        pathOptions: styleObj.customPolygonStyle,
      });

      this.map.pm.addControls({
        drawMarker: true,
        drawPolygon: true,
        drawRectangle: true,
        editMode: true,
        position: 'topright',
        drawPolyline: false,
        drawCircle: false,
        drawCircleMarker: false,
        cutPolygon: false,
        rotateMode: false,
      });

      // Editing event listeners on this.map element
      this.map.on('pm:create', () => {
        this.triggerGeometryEditEvent();
      });
      this.map.on('pm:remove', () => {
        this.triggerGeometryEditEvent();
      });

      // // Add custom toolbar
      // this.map.pm.Toolbar.createCustomControl({
      //   name: "add_global_geom",
      //   block: "custom",
      //   title: "Add Global Geometry",
      //   className: "marker-icon marker-icon-middle material-icons language",
      //   onClick: this.tempFunction,
      //   toggle: false,
      // });
    },
    catchGcnetStationClick(stationAlias) {
      eventBus.$emit(GCNET_OPEN_DETAIL_CHARTS, stationAlias);
    },
    // tempFunction() {
    //   const geoms = this.map.pm.getGeomanLayers()
    //   console.log(geoms);
    //   console.log(geoms[0].feature.geometry.coordinates);
    // },
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
    baseMapLayerName() {
      this.replaceBasemap();
    },
    site() {
      this.addSiteIfAvailable();
    },
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
};
</script>

<style scoped>
.leaflet-container {
  cursor: default;
}
.basemap-toggle {
  position: absolute;
  bottom: 20px;
  right: 8px;
  z-index: 10000;
}
</style>
