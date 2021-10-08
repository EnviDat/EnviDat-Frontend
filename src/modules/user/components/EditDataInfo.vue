<template>

  <v-container id="EditDataInfo"
                fluid
                class="pa-0">

    <v-row >
      <v-col >

        <v-card id="EditDataInfoForm"
                class="pa-4" >

            <v-row>
              <v-col>
                <div class="text-h5">{{ infoCardTitle }}</div>
              </v-col>
            </v-row>

            <v-row >
              <v-col >
                <EditImgPlaceholder :disclaimer="disclaimer"
                                    :img="dataInfo"
                                    />
              </v-col>
            </v-row>

         </v-card>

      </v-col>
    </v-row>

  </v-container>

</template>


<script>
/**
 * EditDataInfo.vue shows information for the data attached to a metadata entry.
 *
 *
 * @summary shows info for data attached to a metadata entry
 * @author Sam Woodcock
 *
 * Created        : 2021-08-31
 * Last modified  : 2021-10-07 17:19:00
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_DATA_INFO,
  eventBus,
} from '@/factories/eventBus';

import EditImgPlaceholder from '@/modules/user/components/EditImgPlaceholder';
import dataInfo from '@/modules/user/assets/placeholders/dataInfo.jpg';


export default {
  name: 'EditDataInfo',
  props: {
  },
  data: () => ({
    dataInfo,
    infoCardTitle: 'Additional Information about the Resource',
  }),
  computed: {
    disclaimer() {
      return 'Please note that the screenshot below will serve as a template for the future component.';
    },
  },
  methods: {
    setDataInfo(property, value) {
      const newDataInfo = {
        ...this.$props,
        [property]: value,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_INFO,
        data: newDataInfo,
      });
    },
  },
  components: {
    EditImgPlaceholder,
  },
};


</script>
