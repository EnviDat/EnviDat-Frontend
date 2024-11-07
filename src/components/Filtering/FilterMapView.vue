<template>
  <v-card raised class="fill-height" id="FilterMapView">
    <div v-if="errorLoadingLeaflet">
      Error loading leaflet
    </div>

    <v-container v-else class="fill-height pa-0" fluid>
      <div
        :class="{
          'grid-rows': topLayout,
          'grid-columns': !topLayout,
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

import { MarkerClusterGroup } from 'leaflet.markercluster';

import {
  map as createMap,
  tileLayer,
  layerGroup,
  featureGroup,
  control,
} from 'leaflet';

import {
  mapGetters,
  mapState,
} from 'vuex';

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

import {EDNA_MODE} from '@/store/metadataMutationsConsts';
import {
  createLocation,
  getMultiPoint,
  getMultiPolygon,
  getPoint,
  getPolygon,
} from '@/factories/geoFactory';


export default {
  name: 'FilterMapView',
  props: {
    content: Array,
    pinnedIds: Array,
    topLayout: Boolean,
    modeData: Object,
  },
  mounted() {
    this.setupMap();
    if (this.modeData && this.modeData.name === EDNA_MODE && !this.modeData.isShallow){
      this.polygonEnabled = true;
    }
  },
  beforeUnmount() {
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
      if (this.$store) {
        return this.config?.apiKeys?.bing || null;
      }

      return null;
    },
    loading() {
      return this.loadingMetadataIds || this.loadingMetadatasContent;
    },
    widgetWidth() {
      return this.$vuetify.display.smAndDown ? 100 : 350;
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
      this.clearFromClusterLayer('pins')
      this.showMapElements(this.pinLayerGroup, this.pinEnabled);
    },
    catchMultipinClicked() {
      this.multiPinEnabled = !this.multiPinEnabled;
      this.clearFromClusterLayer('multiPins');
      this.showMapElements(this.multiPinLayerGroup, this.multiPinEnabled);
    },
    catchPolygonClicked() {
      this.polygonEnabled = !this.polygonEnabled;
      this.clearFromClusterLayer('polygons');
      this.showMapElements(this.polygonLayerGroup, this.polygonEnabled);
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

/*
        this.map.on('layerremove', (layerEvent) => {
          // eslint-disable-next-line no-underscore-dangle
          console.log('removed Layer', layerEvent.layer._leaflet_id);
        })

        this.map.on('layeradd', (layerEvent) => {
          // eslint-disable-next-line no-underscore-dangle
          console.log('added Layer', layerEvent.layer._leaflet_id);
        })
*/

        this.updateMap();

        this.map.on('zoomend', () => {
          this.clearFromClusterLayer('polygons');
          this.showMapElements(this.polygonLayerGroup, this.polygonEnabled);
        });

        this.map.on('moveend', () => {
          this.clearFromClusterLayer('polygons');
          this.showMapElements(this.polygonLayerGroup, this.polygonEnabled);
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
    createPoints(dataset, location, selected) {
      if (location.isPoint) {
        const pin = getPoint(
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
        const multiPin = getMultiPoint(
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
        const polygon = getPolygon(
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
        const multiPoly = getMultiPolygon(
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

        for (let i = 0; i < this.multiPins.length; i++) {
          const pinCollection = this.multiPins[i];

          if (pinCollection) {
            pinCollection.forEach(pin => {
              if (pin) {
                flatMultiPins.push(pin);
              }
            });
          }
        }

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
    clearFromClusterLayer(specificClear) {
      if (!this.clusterLayer) {
        return;
      }

      let toClear = [];

      if (specificClear) {
        if (specificClear === 'polygons') {
          toClear = this.polygonLayerGroup;
        } else if (specificClear === 'pins') {
          toClear = this.pinLayerGroup;
        } else if (specificClear === 'multiPins') {
          toClear = this.multiPinLayerGroup;
        }
      } else {
        toClear = [...this.polygonLayerGroup, ...this.pinLayerGroup, ...this.multiPinLayerGroup];
      }

      this.showMapElements(toClear, false);
    },
    clearLayersFromMap(specificClear) {
      let toClear = [];

      if (specificClear) {
        if (specificClear === 'polygons') {
          toClear = this.polygonLayerGroup;
        } else if (specificClear === 'pins') {
          toClear = this.pinLayerGroup;
        } else if (specificClear === 'multiPins') {
          toClear = this.multiPinLayerGroup;
        }
      } else {
        toClear = [...this.polygonLayerGroup, ...this.pinLayerGroup, ...this.multiPinLayerGroup];
      }

      for (let i = 0; i < toClear.length; i++) {
        const layer = toClear[i];
        layer.remove();
      }
    },
    showMapElements(elements, show, checkBounds) {
      if (!elements) {
        return;
      }

      let isArray = true;
      if (!(elements instanceof Array)) {
        isArray = false;
      }

      if (!show) {
        if (isArray) {
          this.clusterLayer.removeLayers(elements);
        } else {
          this.clusterLayer.removeLayer(elements)
        }
        return;
      }

      let toAdd = elements;

      if (checkBounds) {
        const currentBounds = this.map.getBounds();
        if (isArray) {
          toAdd = elements.filter((el) => el.getBounds()
            .contains(currentBounds));
        } else {
          toAdd = elements.getBounds().contains(currentBounds) ? elements : undefined;
        }
      }

      if (isArray) {
        this.clusterLayer.addLayers(toAdd);
      } else if (toAdd) {
        this.clusterLayer.addLayer(toAdd)
      }
    },
    updateMap() {
      if (this.clusterLayer) {
        // this.map.removeLayer(this.clusterLayer);
        this.clusterLayer.removeFrom(this.map);
        this.clearFromClusterLayer();
      } else {
        this.clusterLayer = new MarkerClusterGroup();
      }

      // fills this.pinLayerGroup, this.multiPinLayerGroup, this.polygonLayerGroup
      this.createMapElements(this.content);

      this.addElementsToMap(this.pinLayerGroup, this.pinEnabled);
      this.addElementsToMap(this.multiPinLayerGroup, this.multiPinEnabled);
      this.addElementsToMap(this.polygonLayerGroup, this.polygonEnabled, true);

      this.clusterLayer.addTo(this.map);
      // this.map.addLayer(this.clusterLayer)

      if (this.modeData && (this.hasPins || this.hasMultiPins || this.hasPolygons)) {
        this.focusOnLayers();
      }
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
    multiPinLayerGroup: [],
    multiPins: [],
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

.grid-columns {
  display: grid;
  grid-template-columns: 4fr 1fr;
}

.leaflet-marker-pane .leaflet-div-icon {
  background-color: transparent !important;
  border: none !important;
}
</style>
