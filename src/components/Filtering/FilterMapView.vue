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
            :multiPinNumber="hasMultiPins ? multiPinLayerGroup.length : 0"
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

import FilterMapWidget from '@/components/Filtering/FilterMapWidget.vue';

import {EDNA_MODE} from '@/store/metadataMutationsConsts';
import {
  getMultiPointLayer,
  getMultiPolygonLayer,
  getPointLayer,
  getPolygonLayer,
} from '@/factories/leafleftFunctions';

import { createLocation, creationGeometry } from '@/factories/geoFactory';


export default {
  name: 'FilterMapView',
  props: {
    content: Array,
    pinnedContent: Array,
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
      return this.pinLayerGroup?.length > 0;
    },
    hasMultiPins() {
      return this.multiPinLayerGroup?.length > 0;
    },
    hasPolygons() {
      return this.polygonLayerGroup?.length > 0;
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
    pinLayerGroup() {
      return Array.from(this.pinLayerGroupMap.values());
    },
    multiPinLayerGroup() {
      const groupedMultiPins = Array.from(this.multiPinLayerGroupMap.values());
      const flatMultiPins = [];

      for (let i = 0; i < groupedMultiPins.length; i++) {
        const pinCollection = groupedMultiPins[i];

        if (pinCollection) {
          pinCollection.forEach(pin => {
            if (pin) {
              flatMultiPins.push(pin);
            }
          });
        }
      }

      return flatMultiPins;
    },
    polygonLayerGroup() {
      return Array.from(this.polygonLayerGroupMap.values());
    },
    pinnedIds() {
      if (this.pinnedContent.length <= 0) {
        return [];
      }

      return this.pinnedContent.map((dataset) => dataset.id);
    },
  },
  methods: {
    checkError() {
      this.errorLoadingLeaflet = true;
    },
    catchPointClick(datasetId) {
      this.$emit('pointClicked', datasetId);
    },
    catchClearButtonClicked() {
      this.$emit('clearButtonClicked');
    },
    catchPinClicked() {
      this.pinEnabled = !this.pinEnabled;
      this.clearFromClusterLayer('pins')
      this.showLayersOnCluster(this.pinLayerGroup, this.pinEnabled);
    },
    catchMultipinClicked() {
      this.multiPinEnabled = !this.multiPinEnabled;
      this.clearFromClusterLayer('multiPins');
      this.showLayersOnCluster(this.multiPinLayerGroup, this.multiPinEnabled);
    },
    catchPolygonClicked() {
      this.polygonEnabled = !this.polygonEnabled;
      this.clearFromClusterLayer('polygons');
      this.showLayersOnCluster(this.polygonLayerGroup, this.polygonEnabled, this.polygonEnabled);
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

        // fills this.pinLayerGroup, this.multiPinLayerGroup, this.polygonLayerGroup
        this.createMapElements(this.content);

        this.updateMap();

        this.map.on('zoomend', () => {
          this.clearFromClusterLayer('polygons');
          this.showLayersOnCluster(this.polygonLayerGroup, this.polygonEnabled, true);
        });

        this.map.on('moveend', () => {
          this.clearFromClusterLayer('polygons');
          this.showLayersOnCluster(this.polygonLayerGroup, this.polygonEnabled, true);
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
    createLeafletLayer(dataset, location, selected) {
      let layer;

      if (location.isPoint) {
        layer = getPointLayer(
            location.geomCollection.geometries,
            dataset.id,
            dataset.title,
            selected,
            this.catchPointClick,
            this.modeData,
            dataset,
        );
      } else if (location.isMultiPoint) {
        layer = getMultiPointLayer(
            location.geomCollection.geometries,
            dataset.id,
            dataset.title,
            selected,
            this.catchPointClick,
            this.modeData,
            dataset,
        );
      } else if (location.isPolygon) {
        layer = getPolygonLayer(
            location.geomCollection.geometries,
            dataset.id,
            dataset.title,
            selected,
            this.catchPointClick,
        );
      } else if (location.isMultiPolygon) {
        layer = getMultiPolygonLayer(
          location.geomCollection.geometries,
          dataset.id,
          dataset.title,
          selected,
          this.catchPointClick,
        );
      } else if (location.isGeomCollection) {
        const flatLayers = [];

        location.geomCollection.geometries.forEach(item => {
          const geo = creationGeometry(item, location)
          const sublayer = this.createLeafletLayer(dataset, geo, selected);

          if (sublayer) {
            flatLayers.push(sublayer);
          }
        });

        return flatLayers.length > 1 ? flatLayers : flatLayers[0];
      }
      
      return layer;
    },
    createAllLayers(dataset, location, selected) {

      const layer = this.createLeafletLayer(dataset, location, selected);

      if (layer) {
        if (location.isPoint) {
          this.pinLayerGroupMap.set(dataset.id, layer);
        }
        if (location.isMultiPoint) {
          this.multiPinLayerGroupMap.set(dataset.id, layer);
        }
        if (location.isPolygon) {
          this.polygonLayerGroupMap.set(dataset.id, layer);
        }
        // this case is not being counted for polygons
        if (location.isMultiPolygon) {
          this.multiPolygonLayerGroupMap.set(dataset.id, layer);
        }

      }
    },
    createMapElements(locationDataSet) {
      if (!locationDataSet) return;
      // console.time('createMapElements');

      this.pinLayerGroupMap = new Map();
      // this.multiPins = [];
      this.polygonLayerGroupMap = new Map();
      this.multiPinLayerGroupMap = new Map();
      this.multiPolygonLayerGroupMap = new Map();
      const idsPinned = this.pinnedIds;

      for (let i = 0; i < locationDataSet.length; i++) {
        const dataset = locationDataSet[i];

        let location = dataset.location;
        if (!location) {
          location = createLocation(dataset);
        }
        const selected = idsPinned.includes(dataset.id);

        this.createAllLayers(dataset, location, selected)

/*
        if (location.isGeomCollection) {
          location.geomCollection.geometries.forEach(item => {
            this.createAllLayers(dataset, item, selected)
          });
        }
        else{
          this.createAllLayers(dataset, location, selected)
        }
*/
      }

      // console.timeEnd('createMapElements');
    },
    addElementsToMap(elements, enabled, checkBounds) {
      if (!enabled || !elements || elements.length <= 0) {
        return;
      }

      this.showLayersOnCluster(elements, true, checkBounds);
    },
    focusOnLayers() {
      const pins = this.pinEnabled ? this.pinLayerGroup : [];
      const multis = this.multiPinEnabled ? this.multiPinLayerGroup : [];
      const polys = this.polygonEnabled ? this.polygonLayerGroup : [];

      const allLayers = [...pins, ...multis, ...polys];

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

      this.showLayersOnCluster(toClear, false);
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
        if (layer) {
          if (layer instanceof Array) {
            layer.forEach((l) => {
              l.remove();
            });
          } else {
            layer.remove();
          }
        }
      }
    },
    showLayersOnCluster(elements, show, checkBounds) {
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
          toAdd = elements.filter((el) => currentBounds.contains(el.getBounds()) );
        } else {
          toAdd = currentBounds.contains(elements.getBounds()) ? elements : undefined;
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
        this.clusterLayer.removeFrom(this.map);
        this.clearFromClusterLayer();
      } else {
        this.clusterLayer = new MarkerClusterGroup();
      }

      this.addElementsToMap(this.pinLayerGroup, this.pinEnabled);
      this.addElementsToMap(this.multiPinLayerGroup, this.multiPinEnabled);
      this.addElementsToMap(this.polygonLayerGroup, this.polygonEnabled, true);

      this.clusterLayer.addTo(this.map);

      if (this.modeData && (this.hasPins || this.hasMultiPins || this.hasPolygons)) {
        this.focusOnLayers();
      }
    },
    updateGeoSelection(toUpdate, map, selected) {
      for (let i = 0; i < toUpdate.length; i++) {
        const dataset = toUpdate[i];
        let layer = map.get(dataset.id);

        if (layer) {
          this.showLayersOnCluster(layer, false);
          this.map.removeLayer(layer);

          layer = this.createLeafletLayer(dataset, dataset.location, selected);

          this.showLayersOnCluster(layer, true);
          map.set(dataset.id, layer);
        }
      }
    },
  },
  watch: {
    content() {
      // fills this.pinLayerGroup, this.multiPinLayerGroup, this.polygonLayerGroup
      this.clearLayersFromMap();
      this.clearFromClusterLayer();

      this.createMapElements(this.content);

      this.updateMap();
    },
    pinnedContent(newPinnedContent, oldPinnedContent) {

      const newIdList = newPinnedContent.map(item => item.id);
      const toDeselect = oldPinnedContent.filter((d) => !newIdList.includes(d.id));

      const oldIdList = oldPinnedContent.map(item => item.id);
      const toSelect = newPinnedContent.filter((d) => !oldIdList.includes(d.id));

      if (this.pinEnabled) {
        this.updateGeoSelection(toDeselect, this.pinLayerGroupMap, false);
        this.updateGeoSelection(toSelect, this.pinLayerGroupMap, true);
      }

      if (this.multiPinEnabled) {
        this.updateGeoSelection(toDeselect, this.multiPinLayerGroupMap, false);
        this.updateGeoSelection(toSelect, this.multiPinLayerGroupMap, true);
      }

      if (this.polygonEnabled) {
        this.updateGeoSelection(toDeselect, this.polygonLayerGroupMap, false);
        this.updateGeoSelection(toSelect, this.polygonLayerGroupMap, true);
      }
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
    polygonLayerGroupMap: new Map(),
    multiPinEnabled: true,
    multiPinLayerGroupMap: new Map(),
    multiPolygonLayerGroupMap: new Map(),
    pinEnabled: true,
    pinLayerGroupMap: new Map(),
    filterText: 'Pinned: ',
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

.grid-rows {
  display: grid;
  grid-template-rows: 1fr 5fr;
}

.grid-columns {
  display: grid;
  grid-template-columns: 4fr 1fr;
}


</style>
