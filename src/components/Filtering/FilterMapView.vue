<template>
  <v-card raised class="fill-height" id="FilterMapView">
    <div v-if="errorLoadingLeaflet">
      Error loading leaflet
    </div>

    <v-container v-else class="fill-height pa-0" fluid>
      <div
        :class="{
          'grid-rows': topLayout,
          'grid-colmuns': !topLayout,
        }"
        style="width: 100%; height: 100%"
      >
        <div v-if="!topLayout" id="map" ref="map" class="fill-height" />

        <div id="mapWidget" ref="mapWidget">
          <filter-map-widget
            :title="modeTitle"
            :pinnedIds="pinnedIds"
            :hasPins="hasPins"
            :pinEnabled="pinEnabled"
            :pinNumber="hasPins ? pinLayerGroup.length : 0"
            :hasMultiPins="hasMultiPins"
            :multiPinEnabled="multiPinEnabled"
            :multiPinNumber="hasMultiPins ? multiPins.length : 0"
            :hasPolygons="hasPolygons"
            :polygonEnabled="polygonEnabled"
            :polygonNumber="hasPolygons ? polygonLayerGroup.length : 0"
            :topLayout="topLayout"
            @clickedFocus="focusOnLayers"
            @clickedPin="catchPinClicked"
            @clickedMultipin="catchMultipinClicked"
            @clickedPolygon="catchPolygonClicked"
            @clickedClear="catchClearClicked"
          />
        </div>

        <div v-if="topLayout" id="map" ref="map" class="fill-height" />
      </div>
    </v-container>
  </v-card>
</template>

<script>
/**
 * ProjectCard.vue creates a card with a header image, title, keywords and preview description.
 * When clicked its emits the 'clickedEvent' event, also the clickedTag can be emitted.
 *
 * @summary card with img, title, keywords and preview description
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00
 * Last modified  : 2021-01-06 14:47:30
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet-bing-layer';

import {
  map as createMap,
  icon as createIcon,
  tileLayer,
  Icon,
  geoJSON,
  marker as createMarker,
  layerGroup,
  polygon as createPolygon,
  featureGroup,
  control,
} from 'leaflet';

import {
  mapGetters,
  mapState,
} from 'vuex';

const MarkerClusterGroupImport = () => import('leaflet.markercluster');

// HACK start
/* eslint-disable import/first */
// Solution to loading in the imgs correctly via webpack
// see more https://github.com/PaulLeCam/react-leaflet/issues/255
// stupid hack so that leaflet's images work after going through webpack
import marker from '@/assets/map/marker-icon.png';
import marker2x from '@/assets/map/marker-icon-2x.png';
import markerShadow from '@/assets/map/marker-shadow.png';
import selectedMarker from '@/assets/map/selected-marker-icon.png';
import selectedMarker2x from '@/assets/map/selected-marker-icon-2x.png';
// HACK end
import FilterMapWidget from '@/components/Filtering/FilterMapWidget.vue';
import { createLocation } from '@/factories/metaDataFactory';
import {EDNA_MODE} from '@/store/metadataMutationsConsts';

export default {
  name: 'FilterMapView',
  props: {
    content: Array,
    pinnedIds: Array,
    topLayout: Boolean,
    modeData: Object,
  },
  beforeMount() {
    this.pinIcon = this.mixinMethods_getIcon('marker');
    this.multiPinIcon = this.mixinMethods_getIcon('markerMulti');
    this.polygonIcon = this.mixinMethods_getIcon('polygons');
    this.eyeIcon = this.mixinMethods_getIcon('eye');
  },
  mounted() {
    this.setupMap();
    if (this.modeData && this.modeData.name === EDNA_MODE && !this.modeData.isShallow){
      this.polygonEnabled = true;
    }
  },
  beforeDestroy() {
    if (this.map) {
      this.map.remove();
    }
  },
  computed: {
    ...mapState(['config']),
    ...mapGetters({
      metadataIds: 'metadata/metadataIds',
      metadatasContent: 'metadata/metadatasContent',
      searchedMetadatasContent: 'metadata/searchedMetadatasContent',
      searchingMetadatasContent: 'metadata/searchingMetadatasContent',
      loadingMetadataIds: 'metadata/loadingMetadataIds',
      loadingMetadatasContent: 'metadata/loadingMetadatasContent',
    }),
    bingApiKey() {
      return this.config?.apiKeys?.bing || null;
    },
    loading() {
      return this.loadingMetadataIds || this.loadingMetadatasContent;
    },
    widgetWidth() {
      return this.$vuetify.breakpoint.smAndDown ? 100 : 350;
    },
    hasPins() {
      return this.pinLayerGroup && this.pinLayerGroup.length > 0;
    },
    hasMultiPins() {
      return this.multiPinLayerGroup && this.multiPinLayerGroup.length > 0;
    },
    hasPolygons() {
      return this.polygonLayerGroup && this.polygonLayerGroup.length > 0;
    },
    modeTitle() {
      // use undefined here so the default value for the title is being used
      return this.modeData ? this.modeData.title : undefined;
    },
    modeIconData() {
      return this.modeData ? this.modeData.icons[0] : null;
    },
    modeIconInfrastructure() {
      return this.modeData ? this.modeData.icons[1] : null;
    },
    modeIconModel() {
      return this.modeData ? this.modeData.icons[2] : null;
    },
  },
  methods: {
    checkError() {
      this.errorLoadingLeaflet = true;
    },
    catchPointClick(e) {
      this.$emit('pointClicked', e.target.id);
    },
    catchPointHover(e) {
      e.target.bindPopup(`<p>${e.target.title}</p>`).openPopup();
      this.$emit('pointHover', e.target.id);
    },
    catchPointHoverLeave(e) {
      e.target.closePopup();
      this.$emit('pointHoverLeave', e.target.id);
    },
    catchClearButtonClicked() {
      this.$emit('clearButtonClicked');
    },
    catchPinClicked() {
      this.pinEnabled = !this.pinEnabled;
      this.updatePins();
    },
    catchMultipinClicked() {
      this.multiPinEnabled = !this.multiPinEnabled;
      this.updateMultiPins();
    },
    catchPolygonClicked() {
      this.polygonEnabled = !this.polygonEnabled;
      this.updatePolygons();
    },
    catchClearClicked() {
      this.$emit('clearButtonClicked');
    },
    toggleMapExpand() {
      return this.$emit('toggleMapFilterExpand');
    },
    setupMap() {
      if (this.mapIsSetup) {
        return;
      }

      this.map = this.initLeaflet(this.$refs.map);

      if (this.map) {
        this.map.on('locationerror', () => {
          this.errorLoadingLeaflet = true;
        });

        const bingKey = this.bingApiKey;
        this.addImageMapLayer(this.map, bingKey);

        this.updateMap();

        this.map.on('zoomend', () => {
          this.updatePolygons();
        });

        this.map.on('moveend', () => {
          this.updatePolygons();
        });

        this.mapIsSetup = true;
      }
    },
    initLeaflet(mapElement) {
      const map = createMap(mapElement, {
        // scrollWheelZoom: false,
        center: this.setupCenterCoords,
        zoom: 7,
        zoomSnap: 0.5,
      });

      this.initialBounds = map.getBounds();

      return map;
    },
    parseGeoJSON(geoJsonString) {
      try {
        return geoJSON(geoJsonString);
      } catch (error) {
        return undefined;
      }
    },
    addImageMapLayer(map, bingKey) {
      const streetTiles = tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        },
      );

      const layers = [streetTiles];
      const baseMaps = {};

      if (bingKey) {
        const aerialTiles = tileLayer.bing({
          bingMapsKey: bingKey,
          imagerySet: 'AerialWithLabels',
        });
        layers.push(aerialTiles);

        baseMaps['Satellit (Bingmaps)'] = aerialTiles;
      }

      // put is afterwards, because default seems to be the last one
      baseMaps['Roads (OpenStreetMaps)'] = streetTiles;

      this.mapLayerGroup = layerGroup(layers);
      this.mapLayerGroup.addTo(map);

      control.layers(baseMaps).addTo(map);
    },
    getPointIcon(dataset, modeData, selected) {
      const iconOptions = Icon.Default.prototype.options;
      // use the defaultoptions to ensure that all untouched defaults stay in place

      let iconUrl = null;
      let iconRetinaUrl = null;
      let iconShadowUrl = null;
      let height = 41;
      let width = 25;
      let iconClass = '';

      if (modeData && modeData.name !== EDNA_MODE && modeData.icons) {
        let extraValue = dataset[modeData.extrasKey];

        if (extraValue) {
          extraValue = extraValue.toLowerCase();
          iconUrl = modeData.icons[extraValue];
        } else {
          iconUrl = Object.values(modeData.icons)[0];
        }

        width = 30;
        height = 30;
        iconRetinaUrl = iconUrl;
        iconClass = 'swissFL_icon';
      } else {
        iconUrl = selected ? this.selectedMarker : this.marker;
        iconRetinaUrl = selected ? this.selectedMarker2x : this.marker2x;
        iconShadowUrl = this.markerShadow;
      }

      iconOptions.iconUrl = iconUrl;
      iconOptions.iconRetinaUrl = iconRetinaUrl;
      iconOptions.shadowUrl = iconShadowUrl;
      iconOptions.iconSize = [width, height];
      iconOptions.className = iconClass;

      return createIcon(iconOptions);
    },
    getPoint(dataset, coords, id, title, selected) {
      const icon = this.getPointIcon(dataset, this.modeData, selected);

      let opacity = null;

      if (this.modeData && this.modeData.icons) {
        opacity = selected ? 1 : 0.65;
      } else {
        opacity = selected ? 0.8 : 0.65;
      }

      const point = createMarker(coords, {
        icon,
        opacity,
        riseOnHover: true,
      });

      point.id = id;
      point.title = title;
      point.on({ click: this.catchPointClick });
      point.on({ mouseover: this.catchPointHover });
      point.on({ mouseout: this.catchPointHoverLeave });

      return point;
    },
    getPolygon(coords, id, title, selected) {
      // create a polygon from an array of LatLng points
      // var latlngs = [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]];
      const polygon = createPolygon(coords, {
        color: selected
          ? this.$vuetify.theme.themes.light.primary
          : this.$vuetify.theme.themes.light.accent,
        opacity: 0.45,
        fillOpacity: 0,
      });

      polygon.on({ click: this.catchPointClick });
      polygon.id = id;
      polygon.title = title;

      return polygon;
    },
    getMultiPoint(dataset, coords, id, title, selected) {
      const points = [];
      for (let i = 0; i < coords.length; i++) {
        const pointCoord = coords[i];
        const point = this.getPoint(dataset, pointCoord, id, title, selected);
        points.push(point);
      }

      return points;
    },
    getMultiPolygon(coords, id, title, selected) {
      const polys = [];
      for (let i = 0; i < coords.length; i++) {
        const pointCoord = coords[i];
        const poly = this.getPolygon(pointCoord, id, title, selected);
        polys.push(poly);
      }

      return polys;
    },
    createPoints(dataset, location, selected) {
      if (location.isPoint) {
        const pin = this.getPoint(
            dataset,
            location.pointArray,
            dataset.id,
            dataset.title,
            selected,
        );
        if (pin) {
          this.pinLayerGroup.push(pin);
        }
      }

      if (location.isMultiPoint) {
        const multiPin = this.getMultiPoint(
            dataset,
            location.pointArray,
            dataset.id,
            dataset.title,
            selected,
        );
        if (multiPin) {
          this.multiPins.push(multiPin);
        }
      }
      if (location.isPolygon) {
        const polygon = this.getPolygon(
            location.pointArray,
            dataset.id,
            dataset.title,
            selected,
        );
        if (polygon) {
          this.polygonLayerGroup.push(polygon);
        }
      }
      // this case is not being counted for polygons
      if (location.isMultiPolygon) {
        const multiPoly = this.getMultiPolygon(
            location.pointArray,
            dataset.id,
            dataset.title,
            selected,
        );
        if (multiPoly) {
          this.multiPolygonLayerGroup.push(multiPoly);
        }
      }

    },
    createMapElements(locationDataSet) {
      if (!locationDataSet) return;

      this.pinLayerGroup = [];
      this.multiPins = [];
      this.polygonLayerGroup = [];
      this.multiPinLayerGroup = [];
      this.multiPolygonLayerGroup = [];

      for (let i = 0; i < locationDataSet.length; i++) {
        const dataset = locationDataSet[i];

        let location = dataset.location;
        if (!location) {
          location = createLocation(dataset);
        }
        const selected = this.pinnedIds.includes(location.id);

        if (location.isGeomCollection) {
          location.pointArray.forEach(item => {
            this.createPoints(dataset, item, selected)
          });
        }
        else{
          this.createPoints(dataset, location, selected)
        }
      }
      if (this.multiPins.length > 0) {
        const flatMultiPins = [];
        this.multiPins.forEach(pinCollection => {
          if (pinCollection) {
            pinCollection.forEach(pin => {
              if (pin) {
                flatMultiPins.push(pin);
              }
            });
          }
        });
        this.multiPinLayerGroup = flatMultiPins;

        // merge the multipins with the normal pins on one layer?
        // this.pinLayerGroup = [...pins, ...flatMultiPins];
      } else {
        this.multiPinLayerGroup = [];
      }

    },
    addElementsToMap(elements, enabled, checkBounds) {
      if (!enabled || !elements || elements.length <= 0) {
        return;
      }

      this.showMapElements(elements, true, checkBounds);
    },
    focusOnLayers() {
      const allLayers = [];

      if (this.pinEnabled) {
        this.pinLayerGroup.forEach(l => {
          allLayers.push(l);
        });
      }

      if (this.multiPinEnabled) {
        this.multiPinLayerGroup.forEach(l => {
          allLayers.push(l);
        });
      }

      if (this.polygonEnabled) {
        this.polygonLayerGroup.forEach(l => {
          allLayers.push(l);
        });
      }

      if (allLayers.length > 0) {
        const feat = featureGroup(allLayers);
        const featBounds = feat.getBounds();
        this.map.fitBounds(featBounds, { maxZoom: 8 });

      }
    },
    clearLayers(map, specificClear) {
      if (!map) {
        return;
      }

      if (this.polygonLayerGroup) {
        if ((specificClear && specificClear === 'polygons') || !specificClear) {
          this.showMapElements(this.polygonLayerGroup, false);
        }
      }

      if (this.pinLayerGroup) {
        if ((specificClear && specificClear === 'pins') || !specificClear) {
          this.showMapElements(this.pinLayerGroup, false);
        }
      }

      if (this.multiPinLayerGroup) {
        if (
          (specificClear && specificClear === 'multiPins') ||
          !specificClear
        ) {
          this.showMapElements(this.multiPinLayerGroup, false);
        }
      }
    },
    showMapElements(elements, show, checkBounds) {
      const currentBounds = this.map.getBounds();

      if (elements instanceof Array) {
        elements.forEach(el => {
          if (
            (show && !checkBounds) ||
            (show && checkBounds && !el.getBounds().contains(currentBounds))
          ) {
            this.clusterLayer.addLayer(el);
          } else {
            this.clusterLayer.removeLayer(el);
          }
        });
      } else {
        /* eslint-disable no-lonely-if */
        if (
          (show && !checkBounds) ||
          (show && checkBounds && !elements.getBounds().contains(currentBounds))
        ) {
          this.clusterLayer.addLayer(elements);
        } else {
          this.clusterLayer.removeLayer(elements);
        }
      }
    },
    async updateMap() {
      if (!this.clusterLayer) {
        const { MarkerClusterGroup } = await MarkerClusterGroupImport();
        this.clusterLayer = new MarkerClusterGroup();
      }

      this.clusterLayer.removeFrom(this.map);
      this.clearLayers(this.map);

      // fills this.pinLayerGroup, this.multiPinLayerGroup, this.polygonLayerGroup
      this.createMapElements(this.content);

      this.addElementsToMap(this.pinLayerGroup, this.pinEnabled);
      this.addElementsToMap(this.multiPinLayerGroup, this.multiPinEnabled);
      this.addElementsToMap(this.polygonLayerGroup, this.polygonEnabled, true);

      this.clusterLayer.addTo(this.map);

      if (this.modeData && (this.hasPins || this.hasMultiPins || this.hasPolygons)) {
        this.focusOnLayers();
      }
    },
    updatePins() {
      this.clearLayers(this.map, 'pins');

      this.addElementsToMap(this.pinLayerGroup, this.pinEnabled);
    },
    updateMultiPins() {
      this.clearLayers(this.map, 'multiPins');

      this.addElementsToMap(this.multiPinLayerGroup, this.multiPinEnabled);
    },
    updatePolygons() {
      this.clearLayers(this.map, 'polygons');

      this.addElementsToMap(this.polygonLayerGroup, this.polygonEnabled, true);
    },
  },
  watch: {
    content() {
      this.updateMap();
    },
    pinnedIds() {
      this.updateMap();
    },
  },
  data: () => ({
    map: null,
    mapIsSetup: false,
    setupCenterCoords: [46.943961, 8.19924],
    initialBounds: null,
    errorLoadingLeaflet: false,
    mapLayerGroup: null,
    polygonEnabled: false,
    polygonLayerGroup: [],
    multiPolygonLayerGroup: [],
    pinEnabled: true,
    pinLayerGroup: [],
    multiPinEnabled: true,
    multiPinLayerGroup: null,
    multiPins: [],
    pinIcon: null,
    multiPinIcon: null,
    polygonIcon: null,
    eyeIcon: null,
    filterText: 'Pinned: ',
    marker,
    marker2x,
    selectedMarker,
    selectedMarker2x,
    markerShadow,
    clusterLayer: null,
  }),
  components: {
    FilterMapWidget,
  },
};
</script>

<style>
.swissFL_icon {
  margin-top: -28px !important;
  margin-left: -15px !important;
}

.leaflet-popup-content-wrapper .leaflet-popup-content {
  font-family: 'Raleway', sans-serif !important;
}

.grid-rows {
  display: grid;
  grid-template-rows: 1fr 5fr;
}

.grid-colmuns {
  display: grid;
  grid-template-columns: 4fr 1fr;
}
</style>
