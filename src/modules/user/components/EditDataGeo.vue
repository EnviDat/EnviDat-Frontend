<template>
  <v-container id="EditDataGeo" fluid class="pa-0">
    <v-row>
      <v-col>
        <MetadataGeo :genericProps="genericProps" />
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
/**
 * EditDataGeo.vue is a wrapper around MetadataGeo.vue for modify geospatial information in the Edit workflow.
 *
 *
 * @summary wrapper for geospatial metadata editing
 * @author Sam Woodcock
 *
 * Created        : 2021-10-08
 * Last modified  : 2021-10-08 13:19:00
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
// import { mapState } from "vuex";
import axios from "axios";

import { mergeGeomsToMultiGeoms } from '@/factories/metaDataFactory';

import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_DATA_GEO,
  MAP_ADD_NEW_GEOM,
  MAP_EDIT_EXISTING_GEOM,
  eventBus,
} from "@/factories/eventBus";
// import { METADATA_NAMESPACE } from "@/store/metadataMutationsConsts";

import MetadataGeo from "@/modules/metadata/components/Geoservices/MetadataGeo";

export default {
  name: "EditDataGeo",
  props: {
    initialMapDivId: {
      type: String,
      default: "map-small",
    },
    initialMapHeight: {
      type: Number,
      default: 450,
    },
    initialGeoJSON: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    // Used to update EDITMETADATA_DATA_GEO
    geometries: {
      type: Object,
      default: null,
    },
  }),
  mounted() {
    this.geometries = this.initialGeoJSON;
    eventBus.$on(MAP_ADD_NEW_GEOM, this.triggerGeometryUpdate);
    eventBus.$on(MAP_EDIT_EXISTING_GEOM, this.triggerGeometryUpdate);
  },
  beforeDestroy() {
    eventBus.$off(MAP_ADD_NEW_GEOM, this.triggerGeometryUpdate);
    eventBus.$off(MAP_EDIT_EXISTING_GEOM, this.triggerGeometryUpdate);
  },
  computed: {
    genericProps() {
      const props = {
        mapDivId: this.initialMapDivId,
        site: this.initialGeoJSON,
        layerConfig: null,
        error: null,
        mapHeight: this.initialMapHeight,
        mapEditable: true,
      };
      return props;
    },
  },
  methods: {
    setGeometriesOnRecord(property, value) {
      const geometries = {
        ...this.$props,
        [property]: value,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_GEO,
        data: geometries,
      });
    },
    removeGeometryFromRecord(item) {
      const removeIndex = this.newGeometries.indexOf(item);
      const geometriesCopy = this.newGeometries;
      geometriesCopy.splice(removeIndex, 1);
      // console.log(localKeywords);
      // Process and emit localKeywords to eventBus
      // this.notifyChange('keywords', localKeywords);
      this.setGeometriesOnRecord(
        "geometries",
        this.processValues(geometriesCopy)
      );
    },
    triggerGeometryUpdate(geomJSONFromMap) {
      // Re-calculate genericProps property, adding additional geoms (for MetadataGeo.vue)

      const combined = mergeGeomsToMultiGeoms(this.geometries, geomJSONFromMap);
      this.geometries = combined;

    },
    // createMetadataContent() {
    //   const currentContent = this.currentMetadataContent;

    //   // always initialize because when changing the url directly the reloading
    //   // would not work and the old content would be loaded
    //    this.location = null;

    //   if (currentContent && currentContent.title !== undefined) {

    //     this.location = createLocation(currentContent);

    //    }
    // },
    // setMetadataContent() {
    //   const { components } = this.$options;

    //   this.configInfos = {
    //     stationsConfigUrl: null,
    //     stationParametersUrl: null,
    //     geoUrl: null,
    //   };

    //   if (this.resources?.resources) {
    //     this.configInfos = getConfigFiles(this.resources.resources);

    //     enhanceElementsWithStrategyEvents(this.resources.resources);
    //   }

    //   if (this.configInfos?.geoConfigUrl) {
    //     // the setting of the MetadataGeo genericProps is done via watch on the geoServiceLayers
    //     this.loadGeoServiceLayers(this.configInfos.geoConfigUrl);
    //   } else {
    //     this.setGeoServiceLayers(this.location, null, null);
    //   }
    // },
    loadGeoServiceLayers(url) {
      this.geoServiceLayers = null;
      this.geoServiceLayersError = null;

      axios
        .get(url)
        .then((response) => {
          this.geoServiceLayers = response.data;
        })
        .catch((error) => {
          this.geoServiceLayersError = error;
        });
    },
  },
  watch: {
    geoServiceLayers() {
      this.setGeoServiceLayers(
        this.location,
        this.geoServiceLayers,
        this.geoServiceLayers?.wmsUrl
      );
    },
    geoServiceLayersError() {
      if (this.geoServiceLayersError) {
        this.setGeoServiceLayers(null, null, null);
      }
    },
    // /**
    //  * @description react on changes of the route (browser back / forward click)
    //  */
    // $route: function watchRouteChanges() {
    //   this.loadMetaDataContent();
    // },
    // /**
    //  * @description watch the currentMetadataContent when it is the same as the url
    //  * the components will be filled with the metdata contents
    //  */
    // async currentMetadataContent() {
    //   if (this.isCurrentIdOrName(this.metadataId)) {
    //     this.createMetadataContent();
    //     this.setMetadataContent();
    //   }
    // },
    // /**
    //  * in case all the metadataContents are already loaded take it from there
    //  * if EnviDat is called via MetadataDetailPage URL directly
    //  */
    // metadatasContent() {
    //   if (!this.loadingMetadatasContent && !this.loadingCurrentMetadataContent
    //       && !this.isCurrentIdOrName(this.metadataId)) {
    //     this.$store.dispatch(`${METADATA_NAMESPACE}/${LOAD_METADATA_CONTENT_BY_ID}`, this.metadataId);
    //   }
    // },
  },
  components: {
    MetadataGeo,
  },
};
</script>
