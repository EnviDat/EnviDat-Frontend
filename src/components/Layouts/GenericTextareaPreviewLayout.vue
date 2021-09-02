<template>

  <div>

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
  },
  components: {
  },
};


</script>
