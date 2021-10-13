<template>

  <v-container id="EditDataGeo"
                fluid
                class="pa-0">

    <v-row >
      <v-col >
        <MetadataGeo  :genericProps="genericProps" />
      </v-col>
    </v-row>

  </v-container>

</template>


<script>
/**
 * EditDataGeo.vue is wrapper around MetadataGeo.vue for modify geospatial information in the Edit workflow.
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
import axios from 'axios';
import { rewind as tRewind } from '@turf/turf';

import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_DATA_GEO,
  eventBus,
} from '@/factories/eventBus';

import MetadataGeo from '@/modules/metadata/components/Geoservices/MetadataGeo';
// import { createLocation } from '@/factories/metaDataFactory';
import { createWmsCatalog } from '@/modules/metadata/components/Geoservices/catalogWms';


export default {
  name: 'EditDataGeo',
  props: {
    genericProps: Object,
  },
  data: () => ({
  }),
  computed: {
  },
  methods: {
    updateGeospatialInfo(property, value) {
      const newGeospatialInfo = {
        ...this.$props,
        [property]: value,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_GEO,
        data: newGeospatialInfo,
      });
    },
    setGeoServiceLayers(location, layerConfig, wmsUrl) {
      try {
        location = location ? tRewind(location.geoJSON) : null;
      } catch (error) {
        this.geoServiceLayersError = error;
      }

      if (wmsUrl) {
        this.fetchWmsConfig(wmsUrl);
      } else {
        this.geoServiceConfig = {
          site: location,
          layerConfig,
          error: this.geoServiceLayersError,
        };
      }

      this.geoServiceConfig = {
        ...this.geoServiceConfig,
        mapHeight: this.mapHeight,
        mapEditable: this.mapEditable,
      };
      const { components } = this.$options;
      this.$set(components.MetadataGeo, 'genericProps', this.geoServiceConfig);
    },
    fetchWmsConfig(url) {
      createWmsCatalog(url)
        .then((res) => {
          this.setGeoServiceLayers(this.location, res, null);
        });
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
      this.setGeoServiceLayers(this.location, this.geoServiceLayers, this.geoServiceLayers?.wmsUrl);
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
