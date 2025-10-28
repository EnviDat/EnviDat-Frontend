<template>
  <v-card
    class="pa-0 flex-column navigationWorkflow"
    :elevation="display.lgAndUp.value ? 2 : 0"
    rounded="xl"
  >
    <v-card-title class="text-h6 font-weight-bold mb-4 pa-md-4 pa-0">
      <v-row class="w-100" no-gutters align="center" justify="space-between">
        <!-- Left: title + inline icon(s) -->
        <v-col cols="auto" class="d-flex align-center">
          <span class="text-h6 font-weight-bold mr-2">Create your Dataset</span>
        </v-col>

        <!-- Right: close icon -->
        <v-col cols="auto" class="d-flex justify-end">
          <BaseIconButton
            class="metadataEditCloseButton ma-1 ma-md-0 ml-md-2"
            :icon="iconName('eye')"
            icon-color="black"
            color="black"
            outlined
            tooltip-text="Show Preview"
            tooltip-bottom
            @clicked="emit('catchCloseClick')"
          />
          <BaseIconButton
            class="metadataEditCloseButton ma-1 ma-md-0 ml-md-2"
            :icon="iconName('close')"
            icon-color="black"
            color="black"
            outlined
            tooltip-text="Close Workflow"
            tooltip-bottom
            @clicked="emit('catchCloseClick')"
          />
        </v-col>
      </v-row>
    </v-card-title>

    <v-expansion-panels
      class="mb-4 navigationWorkflow__note--mobile"
      elevation="0"
      v-if="display.smAndDown.value"
    >
      <v-expansion-panel>
        <v-expansion-panel-title class="pa-0">
          <BaseIcon :icon="iconName('info')" color="black" class="mr-4" />Note
        </v-expansion-panel-title>

        <v-expansion-panel-text class="pa-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua…
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-card-text class="pa-0">
      <v-list class="pa-0 navigationWorkflow__list" density="comfortable" nav>
        <v-list-item
          v-for="(step, index) in workflowStore.steps"
          :key="index"
          :class="[
            'navigationWorkflow__item',
            {
              readOnly:
                !step.isEditable && workflowStore.mode !== WorkflowMode.Create,
              unlocked: isUnlocked(step),
            },
            // step.status can be active, completed, error
            step.status,
          ]"
          @click="navigateItem(step.id, step.status)"
          class="pl-4 pr-4 mb-md-4 mb-xl-6 navigationWorkflow__item"
        >
          <template #prepend>
            <BaseIcon
              :icon="iconName(step.icon)"
              color="black"
              class="mr-md-4"
            />
          </template>

          <template #title v-if="display.lgAndUp.value">
            <span class="text-subtitle-1">{{ step.title }}</span>
          </template>

          <template #title v-else>
            <!-- step.status === 'active'  -->
            <div class="d-flex align-center">
              <span
                v-if="workflowStore.currentStep === step.id"
                :class="{
                  'font-weight-bold': display.mdAndDown.value,
                  'ml-2': workflowStore.currentStep === step.id,
                }"
              >
              </span>
              <BaseIcon
                :icon="!step.isEditable ? iconName('noedit') : iconName('edit')"
                color="null"
                class="ml-2"
              />
            </div>
          </template>

          <template #subtitle v-if="display.lgAndUp.value">
            <span class="text-body-2">{{ step.description }}</span>
          </template>

          <template #append v-if="display.lgAndUp.value">
            <div
              class="navigationWorkflow__append--edit"
              :class="[step.status, { readonly: step.readOnly }]"
              v-if="props.isDatasetEditing"
            >
              <BaseIcon
                :icon="!step.isEditable ? iconName('noedit') : iconName('edit')"
                color="null"
              />
            </div>

            <div
              v-else
              class="navigationWorkflow__append mr-1"
              :class="[step.status]"
            >
              <template v-if="step.completed">
                <!-- If the step has already been completed, but we want to edit it -->
                <span
                  v-if="workflowStore.currentStep === step.id"
                  class="navigationWorkflow__append--number font-weight-bold"
                >
                  {{ step.id + 1 }}
                </span>
                <!-- If the step has been completed-->
                <BaseIcon
                  v-else
                  :icon="iconName('success')"
                  class="navigationWorkflow__append--number"
                  color="#fff"
                />
              </template>

              <span v-else class="navigationWorkflow__append--number">
                {{ step.id + 1 }}
              </span>
            </div>
          </template>

          <div
            class="navigationWorkflow__divider"
            v-if="
              display.lgAndUp.value &&
              (step.id === 3 || step.id === workflowStore.steps.length - 1)
            "
          ></div>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions
      class="d-flex mt-4 navigationWorkflow__actions justify-space-between pl-4 pr-4"
    >
      <div
        @click="initDriver"
        class="navigationWorkflow__actions--item d-flex flex-column"
      >
        <BaseIcon
          :class="'pulseIcon help-icon'"
          :large="true"
          :icon="iconName('question')"
          :color="'black'"
        />
        <span class="text-body-2 mt-2">Help mode</span>
      </div>
      <!-- TODO get from the backend the status of the dataset and not use workflowStore.isStepSaveConfirmed -->
      <div
        @click="reserveDoi"
        :class="{ disabled: !isBackend }"
        class="navigationWorkflow__actions--item d-flex flex-column"
      >
        <v-progress-circular
          v-if="doiLoading"
          color="primary"
          indeterminate
        ></v-progress-circular>

        <BaseIcon
          v-else
          :large="true"
          :icon="iconName('print')"
          class="doi-icon"
          :class="{ pulseIcon: !hasDoi && isBackend }"
          :color="isBackend ? (hasDoi ? 'primary' : 'primary') : 'black'"
        />
        <span class="text-body-2 mt-2">{{ doi ?? 'Reserve DOI' }}</span>
      </div>
      <div class="navigationWorkflow__actions--item d-flex flex-column">
        <v-menu
          v-model="showStatusMenu"
          scrim="false"
          :close-on-content-click="false"
          location="bottom"
        >
          <!-- attivatore -->
          <template #activator="{ props }">
            <div
              class="navigationWorkflow__actions--item d-flex flex-column"
              v-bind="props"
            >
              <BaseIcon
                :large="true"
                :icon="iconName('draft')"
                class="status-icon"
                :color="'black'"
              />

              <span class="text-body-2 mt-2">
                {{ publicationState }}
              </span>
            </div>
          </template>

          <!-- contenuto -->
          <v-card width="320" rounded="xl" class="pa-4">
            <div class="d-flex justify-space-between align-center mb-3">
              <span class="text-subtitle-1 font-weight-bold"
                >Publication status</span
              >
              <BaseIconButton
                :icon="mdiClose"
                color="transparent"
                icon-color="primary"
                @clicked="showStatusMenu = false"
              />
            </div>

            <p class="text-body-2 mb-2">
              <strong>Draft:</strong> Not saved and DOI not reserved yet
            </p>
            <p class="text-body-2 mb-2">
              <strong>Reserved:</strong> A DOI has been provided, but it’s not
              published yet
            </p>
            <p class="text-body-2 mb-2">
              <strong>Pending:</strong> Publication in progress. The EnviDat
              team is reviewing your dataset.
            </p>
            <p class="text-body-2">
              <strong>Published:</strong> Your dataset is published.
            </p>
          </v-card>
        </v-menu>
      </div>
    </v-card-actions>
    <!-- <v-expansion-panels
      class="mb-4 mt-4 navigationWorkflow__note--mobile"
      elevation="0"
      v-if="display.smAndUp.value"
    >
      <v-expansion-panel>
        <v-expansion-panel-title class="pa-4">
          <BaseIcon :icon="iconName('info')" color="black" class="mr-4" />Note
        </v-expansion-panel-title>

        <v-expansion-panel-text class="pa-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua…
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels> -->
    <!-- <v-card-text
      v-if="display.smAndUp.value"
      class="pl-4 pr-4 navigationWorkflow__note"
    >
      <span class="font-weight-bold d-block mb-2">Note:</span>
      <span class="text-sm text-gray-600">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. ...
      </span>
    </v-card-text> -->
  </v-card>
</template>

<script setup>
import { useDisplay } from 'vuetify';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { mdiClose } from '@mdi/js';
import { ref, computed } from 'vue';

import BaseIcon from '@/components/BaseElements/BaseIcon.vue';
import { extractIcons } from '@/factories/iconFactory';

import { useDatasetWorkflowStore } from '@/modules/workflow/datasetWorkflow';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import { WorkflowMode } from '@/modules/workflow/utils/workflowEnums';

const workflowStore = useDatasetWorkflowStore();
const display = useDisplay();

const emit = defineEmits(['navigateItem', 'catchCloseClick']);

// Props
const props = defineProps({
  isDatasetEditing: Boolean,
  currentDataset: {
    type: Object,
    default: undefined,
  },
});

const isBackend = computed(() => workflowStore.dataSource === 'backend');
const doi = computed(() => {
  if (!isBackend.value) return undefined;
  const d = workflowStore.backendStorageService?.dataset?.doi;
  return typeof d === 'string' && d.trim() === '' ? undefined : d;
});

const hasDoi = computed(() => !!(doi.value && doi.value.trim()));
const publicationState = computed(() =>
  isBackend.value
    ? (workflowStore.backendStorageService?.dataset?.publication_state ??
      'Draft')
    : 'Draft',
);

const doiLoading = computed(() => workflowStore.isLoading?.('doi') === true);

// tooltip activator
const showStatusMenu = ref(false);

// Extract Icon name from IconFactory
const iconName = (name) => extractIcons(name);
const DISABLED_IN_CREATE_LOCAL_BY_ID = new Set([4, 5, 6]);

const isDisabledBySource = (step) =>
  workflowStore.mode === WorkflowMode.Create &&
  workflowStore.dataSource !== 'backend' &&
  DISABLED_IN_CREATE_LOCAL_BY_ID.has(step.id);

const navigateItem = (id, status) => {
  // workflowStore.navigateItemAction(id, status);
  const step = workflowStore.steps[id];
  if (isDisabledBySource(step)) return;
  emit('navigateItem', { id, status });
};

const reserveDoi = async () => {
  if (!isBackend.value || hasDoi.value || doiLoading.value) return;
  const id = props.currentDataset.dataset.name;

  try {
    await workflowStore.withLoading(
      () => workflowStore.backendStorageService.requestDoi(id),
      'doi',
    );
  } catch (e) {
    console.error(e);
  }
};

/*
const tooltip = {
  text: 'Scroll up ↑',
  scrim: true,
  persistent: false,
  openOnClick: true,
  openOnHover: false,
};
*/

// Unlock the step
const isUnlocked = (step) => {
  if (workflowStore.mode !== WorkflowMode.Create) return false;
  if (isDisabledBySource(step)) return false;
  if (step.id <= 0) return false;
  const prev = workflowStore.steps[step.id - 1];
  return !!prev?.completed;
};

// init the driver step
const initDriver = () => {
  // DEFINE the guidelines on the store
  driver({
    showProgress: true,
    steps: workflowStore.workflowGuide,
  }).drive();
};
</script>

<style lang="scss">
.navigationWorkflow {
  background-color: #fff;
  @media screen and (min-width: 1280px) {
    // 960 is md for vuetify
    background-color: #f8f8f8;
    position: sticky;
    top: 25px;
  }

  position: relative;
  &__list {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    gap: 8px;
    scrollbar-width: none;
    background-color: #fff;

    @media screen and (min-width: 1280px) {
      // 960 is md for vueitfy
      flex-direction: column;
      overflow-x: hidden;
      gap: 0px;
      background-color: #f8f8f8;
    }
  }
  &__divider {
    background-color: #cac4d0;
    height: 1px;
    width: 100%;
    position: absolute;
    bottom: -12px;
    left: 0;
  }
  &__actions {
    @media screen and (max-width: 1280px) {
      // 960 is md for vueitfy
      border-radius: 10px;
      background-color: #f8f8f8;
    }
    &--item {
      align-items: center;
      .baseIcon .baseIconFontIcon {
        width: 42px;
        height: 42px;
      }
      &:hover {
        cursor: pointer;
      }
      // REMOVE after testing

      &.disabled {
        opacity: 0.5;
        &:hover {
          cursor: not-allowed;
        }
      }
    }
  }
  &__item {
    @media screen and (max-width: 1280px) {
      // 960 is md for vueitfy
      border-radius: 10px;
      display: flex;
      &.readOnly {
        background-color: #888888 !important;
      }
    }
    &:hover {
      cursor: pointer;
    }
    // REMOVE after testing

    &.disabled {
      opacity: 0.5;
      @media screen and (max-width: 1280px) {
        // 960 is md for vueitfy
        background-color: #e8e8e8;
      }
      &:hover {
        cursor: not-allowed;
      }
    }
    &.unlocked {
      opacity: 1;

      &:hover {
        cursor: pointer;
      }
    }
    &.active {
      @media screen and (max-width: 1280px) {
        // 960 is md for vueitfy
        // gap: 8px;
        background-color: #499df7;
        .navigationWorkflow__append--number,
        .v-list-item-title,
        .v-icon__svg {
          color: #fff;
          font-weight: bold;
        }
      }
    }
    &.completed {
      @media screen and (max-width: 1280px) {
        // 960 is md for vueitfy
        background-color: #40c057;
        .navigationWorkflow__append--number,
        .v-list-item-title,
        .v-icon__svg {
          color: #fff;
          font-weight: bold;
        }
      }
    }
    &.error {
      @media screen and (max-width: 1280px) {
        // 960 is md for vueitfy
        background-color: #e38c2f;
        .navigationWorkflow__append--number,
        .v-list-item-title,
        .v-icon__svg {
          color: #fff;
          font-weight: bold;
        }
      }
    }
  }
  &__append {
    height: 30px;
    width: 30px;
    background-color: #fff;
    border-radius: 50%;
    position: relative;
    &--number {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #000;
      font-size: 14px;
    }
    &.active {
      background-color: #499df7;
      .navigationWorkflow__append--number {
        color: #fff;
        font-weight: bold;
      }
    }
    &.completed {
      background-color: #40c057;
      .navigationWorkflow__append--number {
        color: #fff;
      }
    }
    &.error {
      background-color: #e38c2f;
      .navigationWorkflow__append--number {
        color: #fff;
        font-weight: bold;
      }
    }
  }
  &__note {
    &--mobile {
      background-color: #fff;
      .v-expansion-panel-title__overlay {
        opacity: 0 !important;
      }
      .v-expansion-panel-text__wrapper {
        padding: 10px 0;
      }
    }
  }
}

.navigationWorkflow__append--edit {
  display: flex;
  align-items: center;
  justify-content: center;

  &.active {
    color: #499df7;
  }
  &.completed {
    color: #40c057;
  }
  &.error {
    color: #e38c2f;
  }
  &.readonly {
    color: #000;
  }
}

@keyframes pulseIcon {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.06);
    opacity: 0.55;
  }
}
.pulseIcon {
  animation: pulseIcon 1.2s ease-in-out infinite;
}
</style>
