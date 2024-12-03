<template>
  <v-card id="ImagePreviewCard">

    <v-card-text >
      <v-row no-gutters >
        <v-col >


          <v-img v-show="!loadingImagePreview && !imagePreviewError"
                 ref="imagePreview"
                 style="max-height: 100%; max-width: 100%; cursor: pointer;"
                 @click="catchImageClick"
                 @load="loadingImagePreview = false"
                 :src="urlImage"
                 @error="catchImageLoadError"
                 alt="resource image preview"/>

          <div class="imagePreviewErrorContainer">

            <v-img v-show="!loadingImagePreview && imagePreviewError"
                   id="curtain"
                   :src="notFoundImg"
                   style="max-height: 100%; max-width: 100%; opacity: 0.25;"
                   alt="resource image could not be loaded!"/>

            <v-skeleton-loader v-show="loadingImagePreview" height='100%' width='100%' type="image" />

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
 * ImagePreviewCard.vue a card which shows an image
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
    this.loadImagePreview(this.url);
  },
  computed: {
  },
  methods: {
    loadImagePreview(url) {
      this.imagePreviewError = null;
      this.loadingImagePreview = true;

      try {
        const imageRef = this.$refs.imagePreview;

        if (imageRef?.$el) {
          this.urlImage = url;
        }
      } catch (e) {
        this.imagePreviewError = e;
        console.error(`Loading image preview failed: ${e}`);
      } finally {
        this.loadingImagePreview = false;
      }
    },
    catchImageClick() {
      this.$emit('previewImageClicked');
    },
    catchImageLoadError(event) {
      console.error('catchImageLoadError');
      console.error(event);
      this.loadingImagePreview = false;
      this.imagePreviewError = event;
    },
  },
  data: () => ({
    imagePreviewError: null,
    loadingImagePreview: false,
    notFoundImg,
    urlImage: null,
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

.customIcon {
  opacity: 0.5;
}

</style>
