<script setup>
/*
  const { foo = 'hello' } = defineProps<{ foo?: string }>()
  const { labels, value } = defineProps({
    labels: [],
    value: [],
  })
*/
  const {
    type = 'trend',
    labels = [],
    data = [],
    width = 200,
    loading = false,
    showCardBorder = false,
  } = defineProps({
    type: {
      type: String,
      required: false,
    },
    labels: {
      type: Array,
      required: false,
    },
    data: {
      type: Array,
      required: false,
    },
    width: {
      type: Number,
      required: false,
    },
    loading: {
      type: Boolean,
      required: false,
    },
    showCardBorder: {
      type: Boolean,
      required: false,
    },
  })


</script>

<template>
  <v-card
    :width
    :variant="showCardBorder ? undefined : 'flat'"
    class="pa-0"
    @click="$emit('clicked')"
  >
    <v-skeleton-loader
      v-if="loading"
      type="image"
      :height="width * 0.5"
    />

    <v-sparkline
      v-if="!loading"
      :labels
      label-size="10"
      :model-value="data"
      line-width="1.5"
      padding="15"
      :auto-draw-duration="500"
      :auto-draw="true"
      :smooth="true"
      :type
      :width
    />
  </v-card>
</template>

<style scoped>

</style>
