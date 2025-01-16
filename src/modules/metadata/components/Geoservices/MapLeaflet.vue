<template>
  <div
    :id="mapDivId"
    ref="map"
    :style="`min-height: ${mapHeight + 'px'}; height: 100%;`"
  ></div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

import {
  map as createMap,
  icon as createIcon,
  Icon,
  geoJSON,
  marker as createMarker,
  divIcon,
  control,
} from 'leaflet';

import { mapState } from 'vuex';

import markerIcon from '@/assets/map/marker-icon.png';
import markerIcon2x from '@/assets/map/marker-icon-2x.png';
import markerIconShadow from '@/assets/map/marker-shadow.png';
import {
  eventBus,
  GCNET_PREPARE_DETAIL_CHARTS,
  MAP_GEOMETRY_MODIFIED,
  MAP_ZOOM_CENTER,
  MAP_ZOOM_IN,
  MAP_ZOOM_OUT,
  EDITMETADATA_DATA_GEO_MAP_ERROR,
} from '@/factories/eventBus';

import { defaultSwissLocation, defaultWorldLocation, geomanGeomsToGeoJSON } from '@/factories/geoFactory';
import {
  createImageryLayer,
  createTopoLayer,
  getMultiPointLayer,
  getPointLayer,
  getPolygonLayer,
} from '@/factories/leafleftFunctions';
import { LOCATION_TYPE_MULTIPOINT, LOCATION_TYPE_POINT, LOCATION_TYPE_POLYGON } from '@/factories/metadataConsts';

/* eslint-disable vue/no-unused-components */

export default {
  name: 'MapLeaflet',
  components: {},
  props: {
    baseMapLayerName: String,
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
    eventBus.on(MAP_ZOOM_IN, this.zoomIn);
    eventBus.on(MAP_ZOOM_OUT, this.zoomOut);
    eventBus.on(MAP_ZOOM_CENTER, this.triggerCenter);

    this.setupMap();

    if (this.isMapEditable) {
      this.setupEditing();
    }
  },
  beforeUnmount() {
    eventBus.off(MAP_ZOOM_IN, this.zoomIn);
    eventBus.off(MAP_ZOOM_OUT, this.zoomOut);
    eventBus.off(MAP_ZOOM_CENTER, this.triggerCenter);

    if (this.map) {
      this.map.remove();
    }
  },
  computed: {
    ...mapState(['config']),
    layerConfig() {
      return this.$store?.state.geoservices.layerConfig || null;
    },
    isTopoActive() {
      return this.baseMapLayerName === 'topo';
    },
    topoLayer() {
      return createTopoLayer();
    },
    imageryLayer() {
      return createImageryLayer();
    },
    isMapEditable() {
      return this.mapEditable;
    },
  },
  methods: {
    removeSite() {
      if (this.siteLayer) {
        this.map.removeLayer(this.siteLayer);
        this.siteLayer = null;
      }
      if (this.isMapEditable) {
        const layerArray = this.map.pm.getGeomanLayers();
        layerArray.forEach(layer => {
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
        geoJson.geometries.forEach(geometry => {
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

      const vueInstance = this;

      this.siteLayer = geoJSON(geoJsonArray, {
        pointToLayer(feature, latlng) {
          if (isGcnet) {
            let gcLayer;

            if (feature.properties.active === null || feature.properties.active === undefined) {
              gcLayer = createMarker(latlng, styleObj.gcnetMissingStyle);
            } else if (feature.properties.active === true) {
                gcLayer = createMarker(latlng, styleObj.gcnetStyle);
            } else if (feature.properties.active === false) {
              gcLayer = createMarker(latlng, styleObj.gcnetInactiveStyle);
            }

            gcLayer.on({
              click: () => {
                vueInstance.catchGcnetStationClick(feature.properties.alias);
              },
            });

            return gcLayer;
          }

          const title = feature.properties?.name || undefined;
          const layerType = feature.geometry?.type;

          if (layerType === LOCATION_TYPE_POINT) {
            return getPointLayer(latlng, '1', title, false, undefined);
          }

          if(layerType === LOCATION_TYPE_MULTIPOINT) {
            return getMultiPointLayer(latlng, '2', title, false, undefined);
          }

          if(layerType === LOCATION_TYPE_POLYGON) {
            return getPolygonLayer(latlng, '2', title, false, undefined);
          }

          return getPointLayer(latlng, '1', title, false, undefined);
          // return createMarker(latlng, styleObj.customPointStyle);
        },
        style: styleObj.customPolygonStyle,
      });

      if (isGcnet) {
        this.siteLayer.eachLayer(layer => {
          layer.bindTooltip(
            `<div>
              <b>${layer.feature.properties.name}</b>
              <br/>
              Elevation: ${layer.feature.properties.elevation}
            </div>
            `,
            {
              className: 'rounded-xl text-md-center subtitle-1',
              permanent: false,
            },
          );

          // Open popup data modal on click
        });
      }

      // this.siteLayer.bindPopup(layer => layer.feature.properties.description);

      this.map.addLayer(this.siteLayer);

      // Editing event listeners on map layers
      if (this.isMapEditable) {
        const allLayers = this.map.pm.getGeomanLayers();
        allLayers.forEach(editableLayer => {
          editableLayer.on('pm:update', () => {
            this.triggerGeometryEditEvent();
          });
          editableLayer.on('pm:dragend', () => {
            this.triggerGeometryEditEvent();
          });
        });
      }
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
      /*
      if (this.isGcnet) {
        // Disable editing
        this.isMapEditable = false;
      }
*/

      this.map = createMap(this.$refs.map, {
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
      this.map.setMinZoom(
        Math.ceil(
          Math.log2(
            Math.max(this.$refs.map.clientWidth, this.$refs.map.clientHeight) /
              256,
          ),
        ),
      );

      control.scale().addTo(this.map);
      this.replaceBasemap();

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
      }
    },
    replaceBasemap() {
      if (this.basemapLayer) {
        this.map.removeLayer(this.basemapLayer);
      }

      this.basemapLayer = this.isTopoActive ? this.topoLayer : this.imageryLayer;

      this.map.addLayer(this.basemapLayer);
      // this.basemapLayer.bringToBack();
    },
    triggerGeometryEditEvent() {
      // Collect edited geometries and pass to event bus

      const layerArray = this.map.pm.getGeomanLayers();
      const geoJSONArray = geomanGeomsToGeoJSON(layerArray);
      eventBus.emit(MAP_GEOMETRY_MODIFIED, geoJSONArray);
    },
    getCustomLeafletStyle() {
      const iconOptions = Icon.Default.prototype.options;
      iconOptions.iconUrl = this.markerIcon;
      iconOptions.iconRetinaUrl = this.markerIcon2x;
      iconOptions.shadowUrl = this.markerIconShadow;

      const icon = createIcon(iconOptions);

      return {
        customPointStyle: {
          icon,
          opacity: 0.65,
          riseOnHover: true,
        },
        customPolygonStyle: {
          color: this.$vuetify.theme.themes.light.colors.accent,
          // fillOpacity: 0.5,
          // opacity: 1,
          // weight: 1,
        },
        gcnetStyle: {
          icon: divIcon({
            className: 'rounded-circle green',
            iconSize: [20, 20],
          }),
          opacity: 0.75,
          riseOnHover: true,
        },
        gcnetInactiveStyle: {
          icon: divIcon({
            className: 'rounded-circle red',
            iconSize: [20, 20],
          }),
          opacity: 0.75,
          riseOnHover: true,
        },
        gcnetMissingStyle: {
          icon: divIcon({
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
        drawText: false,
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

      // Add event listener for dropping files
      this.map.getContainer().addEventListener('drop', event => {
        event.preventDefault();

        // Get dropped files
        const files = event.dataTransfer.files;

        // Loop through each dropped file
        for (const file of files) {
          const reader = new FileReader();
          reader.onload = () => {
            // Attempt GeoJSON
            try {
              const geojson = JSON.parse(reader.result);
              this.map.addLayer(geoJSON(geojson));
              this.triggerGeometryEditEvent();
            } catch {
              eventBus.emit(
                EDITMETADATA_DATA_GEO_MAP_ERROR,
                'Could not load file. Is it GeoJSON?',
              );
            }
            // Attempt KML, requires a plugin (wait for user request)
            // try {
            //   const geojson = JSON.parse(reader.result);
            //   this.map.addLayer(geoJSON(geojson));
            //   this.triggerGeometryEditEvent()
            // } catch {
            //   console.error('Could not load file. Is it GeoJSON?')
            // }
          };
          reader.readAsText(file);
          // }
        }
      });
      // Prevent default behavior for dragover and dragenter events
      this.map.getContainer().addEventListener('dragover', event => {
        event.preventDefault();
      });
      this.map.getContainer().addEventListener('dragenter', event => {
        event.preventDefault();
      });


      // Add custom buttons
      // https://stackoverflow.com/questions/64091134/how-can-i-add-multiple-button-with-events-for-leaflet-marker-tool
      // https://geoman.io/docs/leaflet/customize/toolbar
      this.map.pm.Toolbar.createCustomControl({
        name: 'add_swiss_geom',
        block: 'custom',
        title: 'Add Switzerland Geom',
        className: 'control-icon swissIconMap',
        onClick: () => {
          this.addPredefinedGeomToMap('swiss');
        },
        toggle: false,
      });

      this.map.pm.Toolbar.createCustomControl({
        name: 'add_world_geom',
        block: 'custom',
        title: 'Add World Geom',
        className: 'control-icon worldIconMap',
        onClick: () => {
          this.addPredefinedGeomToMap('world');
        },
        toggle: false,
      });
    },
    catchGcnetStationClick(stationAlias) {
      eventBus.emit(GCNET_PREPARE_DETAIL_CHARTS, stationAlias);
    },
    addPredefinedGeomToMap(type) {
      const layerArray = this.map.pm.getGeomanLayers();
      const geoJSONArray = this.geomanGeomsToGeoJSON(layerArray);

      if (type === 'swiss') {
        geoJSONArray.push(defaultSwissLocation);
      } else if (type === 'world') {
        geoJSONArray.push(defaultWorldLocation)
      }

      eventBus.emit(MAP_GEOMETRY_MODIFIED, geoJSONArray);
    },
  },
  watch: {
    opacity() {
      this.mapLayer.setOpacity(this.opacity / 100);
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
    // isMapEditable: JSON.parse(JSON.stringify(this.mapEditable)),
    markers: [],
    markerIcon,
    markerIcon2x,
    markerIconShadow,
  }),
};
</script>

<style>
.leaflet-container {
  cursor: default;
}
.basemap-toggle {
  position: absolute;
  bottom: 20px;
  right: 8px;
  z-index: 10000;
}

.control-icon.swissIconMap {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>hospital-box</title><path fill="rgb(53, 168, 157)" d="M18,14H14V18H10V14H6V10H10V6H14V10H18M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" /></svg>');
}
.control-icon.worldIconMap {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>web</title><path fill="rgb(53, 168, 157)" d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>');
}
a.leaflet-pm-action {
  color: white!important;
}
</style>
