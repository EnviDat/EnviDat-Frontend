<template>

  <div>

    <v-row>

        <v-col cols="6">     
          <v-textarea  :label="labelTextarea"
                        outlined
                        auto-grow
                        v-model="textareaContent"
                        >
          </v-textarea>
        </v-col>

    </v-row>


    <v-row>

      <v-col cols="6">     
         <ExpandableTextLayout :title="previewTitle"
                          :text="textareaContent"
                          :showPlaceholder="showPlaceholder"
                          :maxTextLength="body ? body.maxTextLength : undefined"
                          :emptyTextColor="emptyTextColor"
                          :emptyText="emptyText" />

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

import ExpandableTextLayout from '@/components/Layouts/ExpandableTextLayout';


export default {
  name: 'GenericTextareaPreviewLayout',
  props: {  
    genericProps: Object,
  },
  computed: {
    textareaContent: {
      get() {
        return this.mixinMethods_getGenericProp('textareaContent', 'WOW');
      },
      set(value) {
        this.setGenericTextarea('textareaContent', value);
      },
    },
    labelTextarea: {
      get() {
        return this.mixinMethods_getGenericProp('labelTextarea', 'Textarea Label');
      },
      set(value) {
        this.setHeaderInfo('labelTextarea', value);
      },
    },
    previewTitle: {
      get() {
        return this.mixinMethods_getGenericProp('previewTitle', 'Related Publications');
      },
      set(value) {
        this.setHeaderInfo('previewTitle', value);
      },
    },
  },
  // created() {
  //   eventBus.$on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
  //   },
  //   beforeDestroy() {
  //     eventBus.$off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
  //   },
  methods: {
    setGenericTextarea(property, value) {
      const newGenericTextarea = {
          ...this.genericprops,
          [property]: value,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
          object: EDITMETADATA_GENERIC_TEXTAREA_PREVIEW_LAYOUT,
          data: newGenericTextarea,
        });
    },
    // notifyChange(newGenericProps) {
    //   eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
    //     object: EDITMETADATA_GENERIC_TEXTAREA_PREVIEW_LAYOUT,
    //     data: newGenericProps,
    //   });
    // },
    // editComponentsChanged(updateObj) {
    //   this.textareaContent = updateObj.data;
    //   // this.textareaContent.set(updateObj);
    // //  this.previewTextarea();
    //       //   if (updateObj.data?.length === this.filledFunderList.length) {
    //       //   //   this.filledFunderList = updateObj.data;
    //       //   // }
    //       //   // if (updateObj.data?.length === this.emptyFunderList.length) {
    //       //   //   this.emptyFunderList = updateObj.data;
    //       //   // }
    // },
  },
  components: {
    ExpandableTextLayout,
  },
};


</script>
