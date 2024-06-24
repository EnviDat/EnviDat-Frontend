<template>
  <v-card style="height: 100%; max-height: 375px !important;" >
    <v-skeleton-loader type="article" ></v-skeleton-loader>


    <v-card-text primary-title >

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
