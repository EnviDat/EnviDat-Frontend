<template>

  <v-container id="EditDataGeo"
                fluid
                class="pa-0">

    <v-row >
      <v-col >
        <MetadataGeo :newFeaturesMessage="false"
                      :editable="true" />
      </v-col>
    </v-row>

  </v-container>

</template>


<script>
/**
 * EditDataGeo.vue is a map component to display and edit geospatial information.
 *
 *
 * @summary displays geospatial info on a map
 * @author Sam Woodcock
 *
 * Created        : 2021-10-08
 * Last modified  : 2021-10-08 13:19:00
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_DATA_GEO,
  INJECT_MAP_FULLSCREEN,
  eventBus,
} from '@/factories/eventBus';

import MetadataGeo from '@/modules/metadata/components/Geoservices/MetadataGeo';


export default {
  name: 'EditDataInfo',
  props: {
    geometryWKT: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
  }),
  computed: {
  },
  methods: {
    setGeospatialInfo(property, value) {
      const newGeospatialInfo = {
        ...this.$props,
        [property]: value,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_GEO,
        data: newGeospatialInfo,
      });
    },
  },
  created() {
    eventBus.$on(INJECT_MAP_FULLSCREEN, this.showFullscreenMapModal);
  },
  components: {
    MetadataGeo,
  },
};


</script>
