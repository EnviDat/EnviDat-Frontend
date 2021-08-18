<template>


  <div>

    <v-row>

        <v-col :cols="columns">  
          <v-textarea  :label="labelTextarea"
                        outlined
                        auto-grow
                        v-model="textareaContent"
                        >
          </v-textarea>
        </v-col>

    </v-row>

    <v-row>

        <v-col :cols="columns"> 
          <div class="text-subtitle-1">{{ subtitlePreview }}</div>
        </v-col>

    </v-row>


    <v-row>

      <v-col :cols="columns">     
          <slot name="preview">
            <metadata-publications />
          </slot>
      
  
          <!-- <ExpandableTextLayout :title="previewTitle"
                          :text="textareaContentProxy"
                          :showPlaceholder="showPlaceholder"
                          :maxTextLength="body ? body.maxTextLength : undefined"
                          :emptyTextColor="emptyTextColor"
                          :emptyText="emptyText" /> -->
 

        </v-col>

    </v-row>

  </div>

</template>

<script>
/**
 * GenericTextareaPreviewLayout.vue renders a textarea and a preview of the text entered in the textarea
 *
 * @summary Renders a textarea and a preview of the text entered in the textarea
 * @author Rebecca Kurup Buchholz
 *
 * Created        : 2020-08-16
 * Last modified  : 2020-08-16
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_GENERIC_TEXTAREA_PREVIEW_LAYOUT,
  eventBus,
} from '@/factories/eventBus';

import MetadataPublications from '@/modules/metadata/components/Metadata/MetadataPublications';


export default {
  name: 'GenericTextareaPreviewLayout',
  data: () => ({
    previewTitle: 'TEST TITLE',
  }),
  props: {  
    genericProps: Object,
  },
  computed: {
    columns: {
      get() {
        return this.mixinMethods_getGenericProp('columns', '');
      },
      set(value) {
        this.setGenericTextarea('columns', value);
      },
    },
    textareaContent: {
      get() {
        return this.mixinMethods_getGenericProp('textareaContent', '');
      },
      set(value) {
        this.setGenericTextarea('textareaContent', value);
      },
    },
    subtitlePreview: {
      get() {
        return this.mixinMethods_getGenericProp('subtitlePreview', 'Preview');
      },
      set(value) {
        this.setGenericTextarea('subtitlePreview', value);
      },
    },
    labelTextarea: {
      get() {
        return this.mixinMethods_getGenericProp('labelTextarea', 'Textarea Label');
      },
      set(value) {
        this.setGenericTextarea('labelTextarea', value);
      },
    },
    // previewTitle: {
    //   get() {
    //     return this.mixinMethods_getGenericProp('previewTitle', 'Related Publications');
    //   },
    //   set(value) {
    //     this.setGenericTextarea('previewTitle', value);
    //   },
    // },
  },
  methods: {
    setGenericTextarea(property, value) {
      const newGenericTextarea = {
          ...this.genericProps,
          [property]: value,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
          object: EDITMETADATA_GENERIC_TEXTAREA_PREVIEW_LAYOUT,
          data: newGenericTextarea,
        });
    },
  },
  components: {
    MetadataPublications,
  },
};


</script>
