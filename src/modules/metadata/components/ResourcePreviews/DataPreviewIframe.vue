<template>
  <v-card id="DataPreviewIframe" height="100vh" width="100%">
    <iframe id="data-preview" :src="url" width="100%" height="100%"></iframe>
  </v-card>
</template>

<script>
/**
 * DataPreviewIframe.vue a card which previews external data within an iframe
 *
 * @summary loads an iframed data preview
 * @author Sam Woodcock
 *
 * Created at     : 2023-01-24 14:11:27
 * Last modified  : 2023-01-24 16:11:27
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export default {
  name: 'DataPreviewIframe',
  props: {
    url: String,
  },
};
</script>

<style scoped></style>
