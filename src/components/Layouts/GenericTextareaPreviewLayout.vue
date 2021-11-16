<template>

  <div>


    <div v-if="isVerticalLayout">

      <v-row>

        <v-col :cols="columns">
          <v-textarea  :label="labelTextarea"
                        outlined
                        auto-grow
                        :prepend-icon="prependIcon"
                        :value="textareaContent"
                         @input="catchInputedText($event)"
                         @change="catchChangedText($event)"
                        >
          </v-textarea>
        </v-col>

      </v-row>


      <v-row v-if="subtitlePreview" >
        <v-col :cols="columns"
                class="text-subtitle-1">
          {{ subtitlePreview }}
        </v-col>
      </v-row>


      <v-row>
        <v-col :cols="columns">
          <slot />
        </v-col>
      </v-row>

    </div>


    <v-row v-if="!isVerticalLayout">

      <v-col >
        <v-textarea  :label="labelTextarea"
                      outlined
                      auto-grow
                      :value="textareaContent"
                       @input="catchInputedText($event)"
                       @change="catchChangedText($event)"
                      >
        </v-textarea>
      </v-col>

      <v-col >
        <v-row v-if="subtitlePreview">
          <v-col class="text-subtitle-1">
            {{ subtitlePreview }}
          </v-col>
        </v-row>

        <v-row>
          <v-col >
            <slot />
          </v-col>
        </v-row>
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
  props: {
    isVerticalLayout: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: String,
      default: '',
    },
    textareaContent: {
      type: String,
      default: '',
    },
    subtitlePreview: {
      type: String,
      default: '',
    },
    labelTextarea: {
      type: String,
      default: '',
    },
    prependIcon: {
      type: String,
      default: '',
    },
  },
  methods: {
    catchInputedText(event) {
      this.$emit('inputedText', event);
    },
    catchChangedText(event) {
      this.$emit('changedText', event);
    },
  },
};


</script>
