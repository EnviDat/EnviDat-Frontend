<template>
  <!-- eslint-disable vue/no-v-model-argument -->
  <div>
    <v-treeview
      :items="limitedItems"
      item-value="id"
      class="s3-treeview"
      density="compact"
      bg-color="transparent"
      base-color="white"
      open-on-click
    >
      <template v-slot:prepend="{ item }">
        <v-icon
          :path="mdiArrowRight"
          style="cursor: pointer"
          @click="
            item.isChild ? getData(item.title, item.isChild, item.id) : null
          "
        />
      </template>

      <template #title="{ item }">
        <v-row
          @click="
            item.isChild ? getData(item.title, item.isChild, item.id) : null
          "
        >
          <v-col class="d-flex align-center justify-space-between">
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
              :url="item.link"
              buttonText="download"
            />

            <BaseRectangleButton
              v-if="item.isLastItem"
              :isXsSmall="true"
              marginClass="mx-1 mt-4 mt-sm-0 ml-5"
              color="white"
              :url="item.link"
              buttonText="View All"
            />
          </v-col>
        </v-row>
      </template>
    </v-treeview>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { VTreeview } from 'vuetify/labs/VTreeview';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import { mdiArrowRight } from '@mdi/js';

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

// /envicloud/?prefix=wsl/CORE_S2A/&max-keys=100000&delimiter=/
// http://localhost:8080/null?prefix=wsl/CORE_S2A/&max-keys=100000&delimiter=/
// before deploy function
// function extractS3Url(inputUrl) {
//   // View All link
//   s3Store.s3BucketUrl = inputUrl;
//   const url = new URL(inputUrl);

//   const hash = url.hash.substring(2);
//   const hashParams = new URLSearchParams(hash);

//   const bucket = decodeURIComponent(hashParams.get('bucket'));
//   const prefix = decodeURIComponent(hashParams.get('prefix'));
//   // link for download resourse
//   const s3DownloadUrl = bucket?.replace(/\/$/, '');
//   s3Store.s3Url = s3DownloadUrl;
//   // link for get content
//   const basePath = bucket?.replace('https://envicloud.wsl.ch', '/s3');
//   const extractedUrl = `${basePath}?prefix=${prefix}/&max-keys=100000&delimiter=/`;
//   baseUrl.value = extractedUrl;
//   getData(baseUrl.value);
// }

// with PROXY
// function extractS3Url(inputUrl) {
//   s3Store.s3BucketUrl = inputUrl;
//   const url = new URL(inputUrl);
//   const hash = url.hash.substring(2);
//   const hashParams = new URLSearchParams(hash);

//   const rawBucket = hashParams.get('bucket') || '';
//   const bucket = decodeURIComponent(rawBucket);

//   const prefix = decodeURIComponent(hashParams.get('prefix') || '').replace(
//     /^\/+/,
//     '',
//   );

//   const s3DownloadUrl = bucket.replace(/\/$/, '');
//   s3Store.s3Url = s3DownloadUrl;

//   // Se manca 'bucket' => uso '/s3' come fallback
//   // Altrimenti sostituisco 'https://envicloud.wsl.ch' con '/s3'
//   let basePath;
//   if (bucket && bucket !== 'null') {
//     basePath = bucket.replace('https://envicloud.wsl.ch', '/s3');
//   } else {
//     basePath = '/s3/';
//   }

//   const extractedUrl = `${basePath}?prefix=${prefix}&max-keys=100000&delimiter=/`;
//   baseUrl.value = extractedUrl;

//   getData(baseUrl.value);
// }

// no PROXY

function extractS3Url(inputUrl) {
  s3Store.s3BucketUrl = inputUrl;
  const url = new URL(inputUrl);
  const hash = url.hash.substring(2);
  const hashParams = new URLSearchParams(hash);

  const rawBucket = hashParams.get('bucket') || '';
  const bucket = decodeURIComponent(rawBucket);

  // Remove leading slashes from prefix
  const prefix = decodeURIComponent(hashParams.get('prefix') || '').replace(
    /^\/+/,
    '',
  );

  // link for resource (download) in store
  const s3DownloadUrl = bucket.replace(/\/$/, '');
  s3Store.s3Url = s3DownloadUrl;

  // If missing 'bucket', fall back to envicloud
  let basePath;
  if (bucket && bucket !== 'null') {
    basePath = bucket; // e.g. "https://envicloud.wsl.ch/edna"
  } else {
    // check this url if it works
    basePath = 'https://os.zhdk.cloud.switch.ch/envicloud/';
  }

  // Build final direct URL
  const extractedUrl = `${basePath}?prefix=${prefix}&max-keys=100000&delimiter=/`;
  baseUrl.value = extractedUrl;

  // Perform the fetch
  getData(baseUrl.value);
}

function limitChildren(array) {
  const lastItem = {
    id: 2,
    isChild: true,
    maximumLenghtItem: true,
    title: 'Go to S3',
    isFile: false,
    childrenLoaded: false,
    children: [],
  };
  console.log(array);
  return array;
}

onMounted(() => {
  extractS3Url(props.url);
});

const limitedItems = computed(() => limitChildren(s3Store.contentFromS3));
</script>

<style>
.s3-treeview .v-icon__svg {
  color: #fff;
}
.s3-treeview .v-list-item-action {
  display: none !important;
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
