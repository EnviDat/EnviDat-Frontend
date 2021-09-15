<template>

  <div>


    <div v-if="isVerticalLayout">

      <v-row>

        <v-col :cols="columns">
          <v-textarea  :label="labelTextarea"
                        outlined
                        auto-grow
                        :value="textareaContent"
                        :prepend-icon="prependIcon"
                        @input="catchChangedText($event)"
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
                      @input="catchChangedText($event)"
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
        return this.mixinMethods_getGenericProp('subtitlePreview', '');
      },
    },
    labelTextarea() {
      return this.mixinMethods_getGenericProp('labelTextarea', 'Textarea label');
    },
    prependIcon() {
      return this.mixinMethods_getGenericProp('prependIcon', '');
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
