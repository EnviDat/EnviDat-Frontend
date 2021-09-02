<template>

  <div>


    <div v-if="isVerticalLayout">

      <v-row>

          <v-col :cols="columns">  
            <v-textarea  :label="labelTextarea"
                          outlined
                          auto-grow
                          :value="textareaContent"
                          @input="catchChangedText($event)"
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
          <slot></slot>
        </v-col>

      </v-row>

    </div>


    <div v-if="!isVerticalLayout">

      <v-row>

        <v-col >  
            <v-textarea  :label="labelTextarea"
                          outlined
                          auto-grow
                          :value="textareaContent"
                          @input="catchChangedText($event)"
                          >
            </v-textarea>
          </v-col>

          <v-col > 
            <div class="text-subtitle-1">{{ subtitlePreview }}</div>     
            <slot></slot>
          </v-col>

        </v-row>

    </div>


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
 * Last modified  : 2020-08-19
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

export default {
  name: 'GenericTextareaPreviewLayout',
  data: () => ({
  }),
  props: {  
    genericProps: Object,
  },
  computed: {
    isVerticalLayout: {
      get() {
        return this.mixinMethods_getGenericProp('isVerticalLayout', false);
      },
    },
    columns: {
      get() {
        return this.mixinMethods_getGenericProp('columns', '');
      },
    },
    textareaContent: {
      get() {
        return this.mixinMethods_getGenericProp('textareaContent', '');
      },
    },
    subtitlePreview: {
      get() {
        return this.mixinMethods_getGenericProp('subtitlePreview', 'Preview');
      },
    },
    labelTextarea: {
      get() {
        return this.mixinMethods_getGenericProp('labelTextarea', 'Textarea label');
      },
    },
  },
  methods: {
    catchChangedText(event) {
      this.$emit('changedText', event);
    },
  //   setGenericTextareaPreview(property, value) {
  //   const newGenericTextareaPreview = {
  //       ...this.genericProps,
  //       [property]: value,
  //   };

  //   eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
  //       object: EDITMETADATA_CUSTOMFIELDS,
  //       data: newCustomFields,
  //     });
  // },
  },
  components: {
  },
};


</script>
