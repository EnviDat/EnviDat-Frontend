<template>
  <v-card elevation="3" class="fill-height" id="FilterMapView">
    <div v-if="errorLoadingLeaflet">Error loading leaflet</div>

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
            :pinNumber="hasPins ? pinLayerGroupMap.size : 0"
            :hasMultiPins="hasMultiPins"
            :multiPinEnabled="multiPinEnabled"
            :multiPinNumber="hasMultiPins ? multiPinLayerGroupMap.size : 0"
            :hasPolygons="hasPolygons"
            :polygonEnabled="polygonEnabled"
            :polygonNumber="hasPolygons ? polygonLayerGroupMap.size : 0"
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

import { map as createMap, featureGroup, control } from 'leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// import has to be after leaflet import
import { MarkerClusterGroup } from 'leaflet.markercluster';

import { mapGetters, mapState } from 'vuex';

import FilterMapWidget from '@/components/Filtering/FilterMapWidget.vue';

import { EDNA_MODE } from '@/store/metadataMutationsConsts';
import { createImageryLayer, createLeafletLayerCollections, createTopoLayer } from '@/factories/leafletFunctions';

import { convertSinglePointsToMultiPoint, createLocation } from '@/factories/geoFactory';
import {
  LOCATION_TYPE_GEOMCOLLECTION,
  LOCATION_TYPE_MULTIPOINT,
  LOCATION_TYPE_MULTIPOLYGON,
  LOCATION_TYPE_POINT,
  LOCATION_TYPE_POLYGON,
} from '@/factories/metadataConsts';

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

    if (this.modeData && this.modeData.name === EDNA_MODE && !this.modeData.isShallow) {
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
      searchMetadataLoading: 'metadata/searchMetadataLoading',
      loadingMetadataIds: 'metadata/loadingMetadataIds',
      loadingMetadatasContent: 'metadata/loadingMetadatasContent',
    }),
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
      const mapEntries = Array.from(this.pinLayerGroupMap.values());
      return mapEntries.flat();
    },
    multiPinLayerGroup() {
      const mapEntries = Array.from(this.multiPinLayerGroupMap.values());
      const groupedMultiPins = mapEntries.flat();

      const flatMultiPins = [];

      for (let i = 0; i < groupedMultiPins.length; i++) {
        const pinCollection = groupedMultiPins[i];

        if (pinCollection instanceof Array) {
          pinCollection.forEach((pin) => {
            if (pin) {
              flatMultiPins.push(pin);
            }
          });
        } else {
          flatMultiPins.push(pinCollection);
        }
      }

      return flatMultiPins;
    },
    polygonLayerGroup() {
      const mapEntries = Array.from(this.polygonLayerGroupMap.values());
      return mapEntries.flat();
    },
    pinnedIds() {
      if (!this.pinnedContent || this.pinnedContent.length <= 0) {
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
      this.clearFromClusterLayer('pins');
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

        // fills this.pinLayerGroup, this.multiPinLayerGroup, this.polygonLayerGroup
        this.createLayersFromDatasets(this.content);

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
      const topoTiles = createTopoLayer();
      const aerialTiles = createImageryLayer();

      const baseMaps = {
        'Satellit (Esri World Imagery)': aerialTiles,
        'Topo (Esri World Topo)': topoTiles, // default seems to be the last one
      };

      const map = createMap(mapElement, {
        center: this.setupCenterCoords,
        zoom: 7,
        zoomSnap: 0.5,
        // zoomAnimation: false,
        markerZoomAnimation: false,
        layers: topoTiles, // only default layer to avoid showing both attributions
      });

      // add little box to switch the base layers
      control.layers(baseMaps).addTo(map);

      this.initialBounds = map.getBounds();

      return map;
    },
    addLayerToGroupMap(map, id, layer) {
      let layerCollection = map.get(id);

      if (!layerCollection) {
        layerCollection = [layer];
        map.set(id, layerCollection);
      } else if (!layerCollection.includes(layer)) {
        layerCollection.push(layer);
      }
    },
    clearLayersFromGroup(map, id) {
      // always clear everything because for a dataset layers need to be removed
      map.set(id, []);
    },
    createLeafletLayers(dataset, location, selected) {
      const layerCollections = [];
      const pointGeometries = [];

      location.geomCollection.geometries.forEach((geometry) => {
        if (geometry.type === LOCATION_TYPE_POINT) {
          // only collect the point geometries here for potential merging them
          // into a multipoint layer
          pointGeometries.push(geometry);
        } else {
          const layerCollection = createLeafletLayerCollections(
            geometry,
            dataset,
            selected,
            this.catchPointClick,
            false,
            this.modeData,
            this,
          );

          layerCollections.push(layerCollection);
        }
      });

      let pointLayer;

      if (pointGeometries.length === 1) {
        pointLayer = createLeafletLayerCollections(
          pointGeometries[0],
          dataset,
          selected,
          this.catchPointClick,
          false,
          this.modeData,
          this,
        );
      } else if (pointGeometries.length >= 2) {
        const multiPointGeometry = convertSinglePointsToMultiPoint(pointGeometries);

        pointLayer = createLeafletLayerCollections(
          multiPointGeometry,
          dataset,
          selected,
          this.catchPointClick,
          false,
          this.modeData,
          this,
        );
      }

      if (pointLayer) {
        return layerCollections.length <= 0 ? [pointLayer] : [pointLayer, ...layerCollections];
      }

      return layerCollections;
    },
    createAllLayers(dataset, location, selected) {
      const layerCollections = this.createLeafletLayers(dataset, location, selected);

      for (let i = 0; i < layerCollections.length; i++) {
        const { type, layers } = layerCollections[i];

        let mapInQuestion;
        if (type === LOCATION_TYPE_POINT) {
          mapInQuestion = this.pinLayerGroupMap;
        } else if (type === LOCATION_TYPE_MULTIPOINT) {
          mapInQuestion = this.multiPinLayerGroupMap;
        } else if (
          type === LOCATION_TYPE_POLYGON ||
          type === LOCATION_TYPE_MULTIPOLYGON ||
          type === LOCATION_TYPE_GEOMCOLLECTION
        ) {
          mapInQuestion = this.polygonLayerGroupMap;
        }

        for (let j = 0; j < layers.length; j++) {
          const layer = layers[j];
          this.addLayerToGroupMap(mapInQuestion, dataset.id, layer);
        }
      }
    },
    createLayersFromDatasets(locationDataSet) {
      if (!locationDataSet) return;
      // console.time('createLayersFromDatasets');

      this.pinLayerGroupMap = new Map();
      // this.multiPins = [];
      this.polygonLayerGroupMap = new Map();
      this.multiPinLayerGroupMap = new Map();

      const idsPinned = this.pinnedIds;

      for (let i = 0; i < locationDataSet.length; i++) {
        const dataset = locationDataSet[i];

        let location = dataset.location;
        if (!location) {
          location = createLocation(dataset);
        }
        const selected = idsPinned.includes(dataset.id);

        this.createAllLayers(dataset, location, selected);
      }

      // console.timeEnd('createLayersFromDatasets');
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

      if (toClear.length <= 0) {
        return;
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

      const isArray = elements instanceof Array;

      if (!show) {
        if (isArray) {
          this.clusterLayer.removeLayers(elements);

          for (let i = 0; i < elements.length; i++) {
            this.map.removeLayer(elements[i]);
          }
        } else {
          this.map.removeLayer(elements);
          this.clusterLayer.removeLayer(elements);
        }
        return;
      }

      let toAdd = elements;

      if (checkBounds) {
        const currentBounds = this.map.getBounds();
        if (isArray) {
          toAdd = elements.filter((el) => currentBounds.contains(el.getBounds()));
        } else {
          toAdd = currentBounds.contains(elements.getBounds()) ? elements : undefined;
        }
      }

      if (isArray) {
        this.clusterLayer.addLayers(toAdd, true);
      } else if (toAdd) {
        // always use array to avoid getting the layer.addParentEvent() error (undefined function)
        this.clusterLayer.addLayers([toAdd], true);
      }
    },
    updateMap() {
      if (this.clusterLayer) {
        this.clearFromClusterLayer();
      } else {
        this.clusterLayer = new MarkerClusterGroup({ animate: false });
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
        const existingLayers = map.get(dataset.id);

        if (existingLayers) {
          this.showLayersOnCluster(existingLayers, false);
          this.clearLayersFromGroup(map, dataset.id);

          const layerCollections = this.createLeafletLayers(dataset, dataset.location, selected);

          for (let j = 0; j < layerCollections.length; j++) {
            const { layers } = layerCollections[j];

            for (let k = 0; k < layers.length; k++) {
              this.addLayerToGroupMap(map, dataset.id, layers[k]);
            }

            this.showLayersOnCluster(layers, true);
          }
        }
      }
    },
  },
  watch: {
    content() {
      // fills this.pinLayerGroup, this.multiPinLayerGroup, this.polygonLayerGroup
      this.clearLayersFromMap();
      this.clearFromClusterLayer();

      this.createLayersFromDatasets(this.content);

      this.updateMap();
    },
    pinnedContent(newPinnedContent, oldPinnedContent) {
      const newIdList = newPinnedContent.map((item) => item.id);
      const toDeselect = oldPinnedContent.filter((d) => !newIdList.includes(d.id));

      const oldIdList = oldPinnedContent.map((item) => item.id);
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
    polygonEnabled: false,
    polygonLayerGroupMap: new Map(),
    multiPinEnabled: true,
    multiPinLayerGroupMap: new Map(),
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
