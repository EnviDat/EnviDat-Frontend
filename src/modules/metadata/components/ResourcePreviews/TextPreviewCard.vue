<template>
  <v-card id="TextPreviewCard">
    <v-card-text
      v-if="fileContent && !enableMarkdown"
      style="white-space: break-spaces;"
    >
      {{ fileContent }}
    </v-card-text>

    <v-card-text v-if="fileContent && enableMarkdown">
      <div v-html="markdownText"></div>
    </v-card-text>

    <v-card-text
      v-if="errorObject"
      :style="`color: ${$vuetify.theme.themes.light.error};`"
    >
      {{ errorObject.title }}
      <br />
      {{ errorObject.message }}
    </v-card-text>

    <v-card-text v-show="loading">
      <div class="skeleton skeleton-animation-shimmer" style="height: 100%;">
        <div
          style="width: 100%; min-height: 100%; "
          class="bone bone-type-paragrah"
        ></div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
/**
 * TextPreviewCard.vue a card which previews a text resource
 *
 * @summary renders text
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-01-05 15:33:05
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import axios from 'axios';

import { renderMarkdown } from '@/factories/stringFactory';

export default {
  name: 'TextPreviewCard',
  props: {
    url: String,
    content: String,
    enableMarkdown: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    this.getFileContent();
  },
  computed: {
    markdownText() {
      return renderMarkdown(this.fileContent.trim());
    },
    errorObject() {
      if (this.fileError) {
        if (!this.url) {
          return {
            title: 'No file provided for the Preview!',
          };
        }

        const splits = this.url.split('/');
        const fileName = splits[splits.length - 1];

        if (this.fileError.response?.status === 404) {
          return {
            title: `Could not load ${fileName}`,
            message: `The file ${fileName} doesn't exist at ${this.url}`,
          };
        }

        return {
          title: `Could not load ${fileName}`,
          message: `Because of a ${this.fileError}. Try downloading it directly.`,
        };
      }

      return null;
    },
  },
  methods: {
    getFileContent() {
      this.loading = true;

      if (this.url) {
        axios
          .get(this.url)
          .then(response => {
            this.loading = false;
            this.fileContent = response.data;
          })
          .catch(reason => {
            this.loading = false;
            this.fileError = reason;
          });
      } else {
        this.fileContent = this.content;
        this.loading = false;
      }
    },
  },
  data: () => ({
    fileContent: '',
    fileError: '',
    loading: false,
  }),
};
</script>

<style scoped></style>
