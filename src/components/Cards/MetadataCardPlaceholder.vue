<template>
  <v-card style="height: 100%; max-height: 375px !important;" >
    <v-skeleton-loader type="article" color="transparent"></v-skeleton-loader>


    <v-card-text primary-title >
      <div class="skeleton skeleton-color-silver skeleton-animation-shimmer"
            style="width: 100%;" >
        <div class="bone bone-type-multiline" />
        <div class="bone bone-type-multiline bone-style-paragraph" />
      </div>

      <v-row class="fill-height"
              align="end"
              no-gutters >
        <v-col v-for="n in 3"
                :key="n"
                class="flex-grow-0">
          <TagChipPlaceholder  />
        </v-col>
      </v-row>

    </v-card-text>
  </v-card>
</template>


<script>
import TagChipPlaceholder from '@/components/Chips/TagChipPlaceholder.vue';

// checkout skeleton
// https://github.com/ToxicJojo/SkeletonPlaceholder

export default {
  components: {
    TagChipPlaceholder,
  },
  props: {
    flatLayout: Boolean,
    categoryColor: String,
  },
  data: () => ({
  }),
  computed: {
  },
  created() {
  },
  methods: {
  },
};
</script>
