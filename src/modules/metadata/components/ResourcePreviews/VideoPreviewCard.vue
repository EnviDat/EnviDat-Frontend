<template>
  <v-card id="ImagePreviewCard">

    <v-card-text >
      <v-row no-gutters >
        <v-col >

          <video v-show="!loadingViedo && !videoError"
                 ref="videoRef"
                 @click="catchVideoClick"
                 @load="loadingViedo = false"
                 @error="catchLoadError"
                >
          </video>
          
          <div class="videoErrorContainer">

            
            <v-img v-show="!loadingViedo && videoError"
                   id="curtain"
                   :src="notFoundImg"
                   style="max-height: 100%; max-width: 100%; opacity: 0.25;"
                   alt="resource image could not be loaded!"/>

            <div v-show="loadingViedo"
                 id="curtain"
                 class="skeleton skeleton-animation-shimmer"
                 style="height: 100%; width: 100%; "
            >
              <div style="width: 100%; min-height: 100%; "
                   class="bone bone-type-image"
              ></div>
            </div>

            <div v-show="!loadingViedo && videoError"
                 id="backdrop"
                 class="pa-4 text-body-1">Video could not be loaded! {{ videoError }} </div>
          </div>

        </v-col>

      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
/**
 * VideoPreviewCard.vue a card which shows an video
 *
 * @summary renders an video
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import notFoundImg from '@/modules/user/assets/imageNotFound.jpg';

export default {
  name: 'VideoPreviewCard',
  props: {
    url: String,
  },
  mounted() {
    this.loadVideo(this.url)
  },
  computed: {
  },
  methods: {
    loadVideo(url) {
      this.videoError = null;
      this.loadingViedo = true;
      const vm = this;

      try {
        this.$nextTick(() => {
          const imageRefs = vm.$refs.videoRef;
          const imageRef = (imageRefs instanceof Array) ? imageRefs[0] : imageRefs;

          imageRef.src = url;
        });
      } catch (e) {
        this.videoError = e;
        console.error(`Loading video failed: ${e}`);
      } finally {
        this.loadingViedo = false;
      }
    },
    catchVideoClick() {
      this.$emit('previewImageClicked');
    },
    catchLoadError(event) {
      console.log('catchLoadError');
      console.error(event);
      this.loadingViedo = false;
      this.videoError = event;
    },
  },
  data: () => ({
    videoError: null,
    loadingViedo: false,
    notFoundImg,
  }),
};
</script>

<style scoped>
.videoErrorContainer {
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
