<template>
  <!-- eslint-disable vue/no-v-model-argument -->
  <div>
    <span v-if="error"
          class="d-flex pt-4 text-caption" >
      <BaseStatusLabelView
        :status="error.type"
        :status-text="error.details"
        :status-color="error.color"
      />
    </span>

    <v-treeview
      v-if="!error"
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
          v-if="!item.maximumLengthItem"
          :path="mdiArrowRight"
          style="cursor: pointer"
          @click="
            item.isChild
              ? getData(item.title, item.isChild, item.id)
              : toggleOpenedItem()
          "
        />
      </template>

      <template #title="{ item }">
        <v-row
          no-gutters
          dense
          @click="
            item.isChild
              ? getData(item.title, item.isChild, item.id)
              : toggleOpenedItem()
          "
          align="center"
          justify="space-between"
        >
          <v-col class="flex-grow-1 py-0">
            <span
              v-if="item.isLastItem"
              class="title-s3-treeview"
              :style="{
                fontSize: '12px',
                cursor: item.isChild ? 'pointer' : 'default',
              }"
            >
              {{ labels.viewAll }}
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

              <v-progress-circular
                v-if="item.id === lastOpenedItemId && loading && !item.isLoaded"
                :size="18"
                color="white"
                class="ml-2"
                indeterminate
              />

              <v-chip
                v-if="
                  item.isChild &&
                  item.numberOfChildren &&
                  !item.maximumLengthItem
                "
                class="ml-2"
                size="x-small"
                color="white"
                variant="outlined"
              >
                {{ item.numberOfChildren }}
              </v-chip>

              <v-chip
                v-if="!item.isChild"
                class="ml-2"
                size="x-small"
                color="white"
                variant="outlined"
              >
                {{ childrenObject }}
              </v-chip>
            </span>
          </v-col>

          <v-col v-if="item.isFile" class="flex-grow-0 py-0">
            <BaseRectangleButton
              :isXsSmall="true"
              color="white"
              :url="item.link"
              buttonText="download"
            />
          </v-col>

          <v-col v-if="item.isLastItem" class="flex-grow-0 py-0">
            <BaseRectangleButton
              :isXsSmall="true"
              color="white"
              :url="item.link"
              buttonText="View All"
            />
          </v-col>

          <v-col v-if="item.maximumLengthItem" class="flex-grow-0 py-0">
            <BaseRectangleButton
              :isXsSmall="true"
              color="white"
              :url="url"
              buttonText="View All"
            />
          </v-col>
        </v-row>
      </template>
    </v-treeview>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { mdiArrowRight } from '@mdi/js';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';

import { useS3Store } from '@/modules/s3/store/s3Store.ts';
import { S3Node } from '@/types/s3Types';
import { warningMessage } from '@/factories/notificationFactory';

const s3Store = useS3Store();

const props = defineProps({
  url: {
    type: String,
    default: '',
  },
});
const baseUrl = ref('');
const loading = ref(false);

const childrenObject = ref(0);
const lastOpenedItemId = ref(0);
const itemOpened = ref(false);

const s3Content = ref<S3Node[]>();
const error = ref();

const labels = {
  viewAll: 'View all data on the S3 File Browser website',
};

const errorDetailText = 'Sorry at the moment we cannot load the data. Please try again later or click on the download/link icon to download the file directly from the bucket.';

const emit = defineEmits(['loadingChanged', 'changeAutoHeight']);

// set store event for change the style of the resourceCard height if the treeview is opened
function toggleOpenedItem() {
  itemOpened.value = !itemOpened.value;
  emit('changeAutoHeight', itemOpened.value);
  /*
  const value = itemOpened.value;
  s3Store.treeViewIsOpened = value;
*/
}

/**
 *
 * @param {string} url
 * @param {boolean} isChild is needed for understand which function trigger in the store
 * @param {number} nodeId is needed to filter and add the new data to the right node
 */
async function getData(url?: string, isChild?: boolean, nodeId?: number) {
  // set clickedID item
  lastOpenedItemId.value = nodeId;

  let dynamicUrl: string;

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

  try {
    loading.value = true;
    emit('loadingChanged', loading.value);
    s3Content.value = await s3Store.fetchS3Content(
      dynamicUrl,
      isChild,
      nodeId,
      s3Content.value,
    );

    error.value = null;
  } catch (err) {

    error.value = warningMessage(err, errorDetailText, undefined);
  } finally {
    loading.value = false;
    emit('loadingChanged', false);
  }
}

function extractS3Url(inputUrl: string) {
  s3Store.s3BucketUrl = inputUrl;
  const url = new URL(decodeURI(inputUrl));
  // const url = new URL(inputUrl);
  const hash = url.hash.substring(2);
  const hashParams = new URLSearchParams(hash);

  const rawBucket = hashParams.get('bucket') || '';
  const bucket = decodeURIComponent(rawBucket);

  // Remove leading slashes from prefix
  let prefix = decodeURIComponent(hashParams.get('prefix') || '').replace(
    /^\/+/,
    '',
  );

  if (prefix && !prefix.endsWith('/')) {
    prefix += '/';
  }

  let basePath;
  if (bucket && bucket !== 'null') {
    basePath = bucket; // e.g. "https://envicloud.wsl.ch/edna"
  } else {
    // If missing 'bucket', fall back to envicloud
    basePath = 'https://os.zhdk.cloud.switch.ch/envicloud';
  }

  // Use basePath if bucket is missing
  s3Store.s3Url = bucket
    ? bucket.replace(/\/$/, '')
    : basePath.replace(/\/$/, '');

  // Build final direct URL
  const extractedUrl = `${basePath}?prefix=${prefix}&max-keys=100000&delimiter=/`;
  baseUrl.value = extractedUrl;

  getData(extractedUrl);
}

function limitAllNodes(nodes: S3Node[]) {
  const limitResources = 10;
  if (!Array.isArray(nodes)) return [];

  return nodes.map((node) => {
    const newNode = { ...node };

    if (Array.isArray(newNode.children) && newNode.children.length > 0) {
      const processedChildren = limitAllNodes(newNode.children);
      if (newNode.isChild) {
        // number of items in the child element
        newNode.numberOfChildren = processedChildren.length;
        newNode.isLoaded = true;
      }
      childrenObject.value = processedChildren.length;

      if (processedChildren.length > limitResources) {
        const sliced = processedChildren.slice(0, limitResources);

        const lastItem = {
          id: limitResources + 1,
          isChild: true,
          maximumLengthItem: true,
          title: labels.viewAll,
          isFile: false,
          childrenLoaded: false,
          children: [],
        };

        sliced.push(lastItem);
        newNode.children = sliced;
      } else {
        newNode.children = processedChildren;
      }
    }

    return newNode;
  });
}

onMounted(() => {
  extractS3Url(props.url);
});

const limitedItems = computed(() => limitAllNodes(s3Content.value));
/*
const limitedItems = computed(() => limitAllNodes(s3Store.contentFromS3));
*/
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
  padding-inline-start: 10px !important;
}
.s3-treeview .v-list-item__content {
  height: 100%;
}
.s3-treeview .v-list-item__content .v-list-item-title {
  height: 100%;
  display: flex;
}
</style>
