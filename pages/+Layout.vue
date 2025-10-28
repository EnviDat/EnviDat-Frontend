<template>
  <article class="content"><slot /></article>
</template>

<style>
body {
  margin: 0;
  font-family: sans-serif;
}
* {
  box-sizing: border-box;
}
a {
  text-decoration: none;
}
</style>

<style scoped>
.layout {
  display: flex;
  max-width: 900px;
  margin: auto;
}
.content {
  padding: 20px;
  border-left: 2px solid #eee;
  padding-bottom: 50px;
  min-height: 100vh;
}
.navigation {
  padding: 20px;
  padding-top: 42px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.8em;
}
.navitem {
  padding: 3px;
}
</style>

<script setup lang="ts">

/*
import { useDisplay } from 'vuetify';

const display = useDisplay();
console.log('setup of +Layout.vue', display);
*/
</script>
