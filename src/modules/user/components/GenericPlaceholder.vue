<template>

  <div>

    <v-row>

        <v-col > 
          <div class="text-h5">{{ componentTitle }}</div>
        </v-col>

      </v-row>


    <v-row>

        <v-col > 
          <div class="text-subtitle-1"><span class="red--text">{{ disclaimer }}</span></div>
        </v-col>

    </v-row>


    <v-row>

      <v-col>
        <slot></slot>     
      </v-col>

    </v-row>


  </div>

</template>

<script>
/**
 * GenericPlaceholder.vue renders a component title, disclaimer, and slot (used to insert a image from a mockup component screenshot)
 *
 * @summary Renders a component title, disclaimer, and slot
 * @author Rebecca Kurup Buchholz
 *
 * Created        : 2020-08-31
 * Last modified  : 2020-08-31
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_GENERIC_PLACEHOLDER,
  eventBus,
} from '@/factories/eventBus';


export default {
  name: 'GenericPlaceholder',
  data: () => ({
  }),
  props: {  
    genericProps: Object,
  },
  computed: {
    componentTitle: {
      get() {
        return this.mixinMethods_getGenericProp('componentTitle', '');
      },
      set(value) {
        this.setGenericPlaceholder('componentTitle', value);
      },
    },
    disclaimer: {
      get() {
        return this.mixinMethods_getGenericProp('disclaimer', '');
      },
      set(value) {
        this.setGenericPlaceholder('disclaimer', value);
      },
    },
  },
  methods: {
    setGenericPlaceholder(property, value) {
      const newGenericPlaceholder = {
          ...this.genericProps,
          [property]: value,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
          object: EDITMETADATA_GENERIC_PLACEHOLDER,
          data: newGenericPlaceholder,
        });
    },
  },
  components: {
  },
};


</script>
