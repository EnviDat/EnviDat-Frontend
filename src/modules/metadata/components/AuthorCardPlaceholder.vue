<template>
  <v-card >
    <v-container class="fill-height pb-0" >
      <v-row >
        <v-col cols="12">
          <div class="skeleton skeleton-size-big skeleton-color-concrete skeleton-animation-shimmer">
            <div class="bone bone-type-heading bone-style-paragraph" />
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-card-text >
      <div class="skeleton skeleton-color-silver skeleton-animation-shimmer"
            style="width: 100%;" >
        <div class="bone bone-type-multiline bone-style-paragraph" />
      </div>
    </v-card-text>

    <v-card-text >
      <div class="skeleton skeleton-color-silver skeleton-animation-shimmer"
            style="width: 100%;" >
        <div class="bone bone-type-multiline bone-style-paragraph" />
      </div>
    </v-card-text>

  </v-card>
</template>


<script>
import defaultTexture from '@/assets/cards/forest/c_b_forest_texture_bark2.jpg';

// checkout skeleton
// https://github.com/ToxicJojo/SkeletonPlaceholder

export default {
  components: {
  },
  props: {
    flatLayout: Boolean,
    categoryColor: String,
  },
  data: () => ({
    defaultTexture,
    blackTopToBottom: 'rgba(20,20,20, 0.1) 0%, rgba(20,20,20, 0.9) 60%',
    whiteTopToBottom: 'rgba(255,255,255, 0.6) 0%, rgba(255,255,255, 0.99) 70%',
  }),
  computed: {
    dynamicCardBackground: function dynamicCardBackground() {
      const gradient = this.dark ? this.blackTopToBottom : this.whiteTopToBottom;

      if (this.$vuetify.breakpoint.mdAndUp && this.defaultTexture) {
        return `background-image: linear-gradient(0deg, ${gradient}), url(${this.defaultTexture});
                background-position: center, center;
                background-size: cover; background-repeat: initial; `;
      }

      return `background-color: ${this.categoryColor}`;
    },
  },
  created() {
  },
  methods: {
  },
};
</script>
