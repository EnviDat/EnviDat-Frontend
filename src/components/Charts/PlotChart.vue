<script setup lang="ts">
import * as Plot from '@observablehq/plot';
import PlotFigure from './PlotFigure';
import penguins from './penguins.json';
</script>

<template>
  <div>
    <h1>Plot</h1>

    <PlotFigure
      :options="{
        marks: [
          Plot.dot(penguins, {x: 'culmen_length_mm', y: 'culmen_depth_mm'}),
        ],
      }"
    />
  </div>
</template>

<style scoped>

</style>
