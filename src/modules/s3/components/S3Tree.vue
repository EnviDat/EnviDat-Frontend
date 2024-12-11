<template>
  <!-- eslint-disable vue/no-v-model-argument -->

  <v-treeview
    :items="s3Store.contentFromS3"
    item-value="id"
    class="s3-treeview"
    density="compact"
    bg-color="transparent"
    base-color="white"
    open-on-click
  >
    <!-- cerare due append slot check -->
    <template #title="{ item }">
      <v-row>
        <v-col
          class="d-flex align-center justify-space-between"
          @click="
            item.isChild ? getData(item.title, item.isChild, item.id) : null
          "
        >
          <span
            v-if="item.isLastItem"
            class="title-s3-treeview"
            :style="{
              fontSize: '12px',
              cursor: item.isChild ? 'pointer' : 'default',
            }"
          >
            Go to S3
          </span>
          <span
            v-else
            class="title-s3-treeview"
            :style="{
              fontSize: '12px',
              cursor: item.isChild ? 'pointer' : 'default',
            }"
          >
            {{ item.title }}
          </span>

          <BaseRectangleButton
            v-if="item.isFile"
            :isXsSmall="true"
            marginClass="mx-1 mt-4 mt-sm-0 ml-5"
            color="white"
            buttonText="download"
          />
          <BaseRectangleButton
            v-if="item.isLastItem"
            :isXsSmall="true"
            marginClass="mx-1 mt-4 mt-sm-0 ml-5"
            color="white"
            buttonText="View All"
          />
        </v-col>
      </v-row>
    </template>
  </v-treeview>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { VTreeview } from 'vuetify/labs/VTreeview';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';

import { useS3Store } from '@/modules/s3/store/s3Store';

const s3Store = useS3Store();

const props = defineProps({
  url: {
    type: String,
    default: '',
  },
});
const baseUrl = ref('');

// isChild is needed for undestand wich function triggher in the store
// nodeId is needed to filter and add the new data to the right node
function getData(url, isChild, nodeId) {
  let dynamicUrl;

  if (url && isChild) {
    // create dynamic URL
    const currentPrefix = new URLSearchParams(baseUrl.value.split('?')[1]).get(
      'prefix',
    );
    const newPrefix = `${currentPrefix}${url}/`;
    dynamicUrl = `${baseUrl.value.split('?')[0]}?prefix=${newPrefix}&max-keys=100000&delimiter=/`;
  } else {
    dynamicUrl = baseUrl.value;
  }

  s3Store.fetchS3Content(dynamicUrl, isChild, nodeId);
}

function extractS3Url(inputUrl) {
  const url = new URL(inputUrl);

  const hash = url.hash.substring(2);
  const hashParams = new URLSearchParams(hash);

  const bucket = decodeURIComponent(hashParams.get('bucket'));
  const prefix = decodeURIComponent(hashParams.get('prefix'));

  const basePath = bucket?.replace('https://envicloud.wsl.ch', '/s3');
  const extractedUrl = `${basePath}?prefix=${prefix}/&max-keys=100000&delimiter=/`;
  baseUrl.value = extractedUrl;

  getData(baseUrl.value);
}

onMounted(() => {
  extractS3Url(props.url);
});
</script>

<style>
.s3-treeview .v-icon__svg {
  color: #fff;
}
.s3-treeview
  .v-list-item--density-compact:not(.v-list-item--nav).v-list-item--one-line {
  padding: 0;
}
.s3-treeview .v-treeview-group.v-list-group .v-list-group__items .v-list-item {
  padding: 0;
  padding-inline-start: 0 !important;
}
</style>
