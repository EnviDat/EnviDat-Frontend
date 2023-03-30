<template>
  <v-card id="ImagePreviewCard">

    <v-card-text >
      <v-row no-gutters >
        <v-col >

          <v-img v-show="!loadingImagePreview && !imagePreviewError"
                 :src="url"
                 ref="imagePreview"
                 style="max-height: 100%; max-width: 100%; cursor: pointer;"
                 @click="catchImageClick"
                 @load="loadingImagePreview = true"
                 @error="catchImageLoadError"
                 alt="resource image preview"/>

          <div class="imagePreviewErrorContainer">

            <v-img v-show="!loadingImagePreview && imagePreviewError"
                   id="curtain"
                   :src="notFoundImg"
                   style="max-height: 100%; max-width: 100%; opacity: 0.25;"
                   alt="resource image could not be loaded!"/>

            <div v-show="loadingImagePreview"
                 id="curtain"
                 class="skeleton skeleton-animation-shimmer"
                 style="height: 100%; width: 100%; "
            >
              <div style="width: 100%; min-height: 100%; "
                   class="bone bone-type-image"
              ></div>
            </div>

            <div v-show="!loadingImagePreview && imagePreviewError"
                 id="backdrop"
                 class="pa-4 text-body-1">Image preview could not be loaded! {{ imagePreviewError }} </div>
          </div>

        </v-col>

      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
/**
 * ImagePreviewCard.vue a card which previews an image
 *
 * @summary renders an image
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import notFoundImg from '@/modules/user/assets/imageNotFound.jpg';

export default {
  name: 'ImagePreviewCard',
  props: {
    url: String,
  },
  mounted() {
  },
  computed: {
  },
  methods: {
/*
    loadImagePreview(url) {
      this.imagePreviewError = null;
      this.loadingImagePreview = true;
      const vm = this;

      try {
        vm.$nextTick(() => {
          const imageRefs = vm.$refs.imagePreview;
          const imageRef = (imageRefs instanceof Array) ? imageRefs[0] : imageRefs;

          imageRef.src = url;
        })
      } catch (e) {
        this.imagePreviewError = e;
        console.error(`Loading image preview failed: ${e}`);
      } finally {
        this.loadingImagePreview = false;
      }
    },
*/
    catchImageClick() {
      this.$emit('previewImageClicked');
    },
    catchImageLoadError(event) {
      this.loadingImagePreview = false;
      this.imagePreviewError = event;
    },
  },
  data: () => ({
    imagePreviewError: null,
    loadingImagePreview: false,
    notFoundImg,
  }),
};
</script>

<style scoped>
.imagePreviewErrorContainer {
  display: grid;
}

#backdrop, #curtain {
  grid-area: 1/1;
}

#backdrop {  }
#curtain {  }

.customIcon {
  opacity: 0.5;
}

</style>
