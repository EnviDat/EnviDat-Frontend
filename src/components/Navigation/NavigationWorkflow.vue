<template>
  <v-card
    class="pa-0 flex-column navigationWorkflow"
    :elevation="display.lgAndUp.value ? 2 : 0"
    rounded="xl"
  >
    <v-card-title class="text-h6 font-weight-bold mb-4 pa-md-4 pa-0">
      Create your Dataset
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
          v-for="(step, index) in navigationStore.steps"
          :key="index"
          :class="[
            'navigationWorkflow__item',
            // step.status can be active, completed, error
            step.status,

            // step.id === navigationStore.currentStep ? 'active' : '',
            // step.completed === true ? 'completed' : '',
            // step.hasError === true ? 'error' : '',
            // step.completed === false && step.id != navigationStore.currentStep
            //   ? 'disabled'
            //   : '',
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
            <span
              v-if="navigationStore.currentStep === step.id"
              :class="{
                'font-weight-bold': display.mdAndDown.value,
                'ml-2': navigationStore.currentStep === step.id,
              }"
            >
              {{ step.title }}
            </span>
          </template>

          <template #subtitle v-if="display.lgAndUp.value">
            <span class="text-body-2">{{ step.description }}</span>
          </template>

          <template #append v-if="display.lgAndUp.value">
            <div
              class="navigationWorkflow__append mr-1"
              :class="[
                step.status,
                // active: step.id === navigationStore.currentStep,
                // completed: step.completed,
                // error: step.hasError,
              ]"
            >
              <template v-if="step.completed">
                <!-- If the step has already been completed, but we want to edit it -->
                <span
                  v-if="navigationStore.currentStep === step.id"
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
              (step.id === 3 || step.id === navigationStore.steps.length - 1)
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
      <div
        @click="reserveDoi"
        :class="{
          disabled: !navigationStore.isStepSaveConfirmed,
        }"
        class="navigationWorkflow__actions--item d-flex flex-column"
      >
        <BaseIcon
          :large="true"
          :icon="iconName('print')"
          class="doi-icon"
          :color="navigationStore.isStepSaveConfirmed ? 'primary' : 'black'"
          :class="
            navigationStore.isStepSaveConfirmed && doiPlaceholder === null
              ? 'pulseIcon'
              : ''
          "
        />
        <span class="text-body-2 mt-2">{{
          doiPlaceholder != null ? doiPlaceholder : 'Reserve DOI'
        }}</span>
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
                {{ doiPlaceholder != null ? 'Reserved' : 'Draft' }}
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
    <v-card-text
      v-if="display.smAndUp.value"
      class="pl-4 pr-4 navigationWorkflow__note"
    >
      <span class="font-weight-bold d-block mb-2">Note:</span>
      <span class="text-sm text-gray-600">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. ...
      </span>
    </v-card-text>
  </v-card>
</template>

<script setup>
// import { computed } from 'vue';
import { useStore } from 'vuex';
import { storeToRefs } from 'pinia';
import { useDisplay } from 'vuetify';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { mdiClose } from '@mdi/js';
import { ref } from 'vue';

import BaseIcon from '@/components/BaseElements/BaseIcon.vue';
import { extractIcons } from '@/factories/iconFactory';

import { useDatasetWorkflowStore } from '@/modules/user/store/datasetWorkflow.js';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';


// initialize the store
const store = useStore();
// define useDisplay
const display = useDisplay();

// Placeholder for DOI
const doiPlaceholder = ref(null);

// tooltip activator
const showStatusMenu = ref(false);

// Extract Icon name from IconFactory
const iconName = (data) => extractIcons(data);

const navigationStore = useDatasetWorkflowStore();

// getters from pinia -> navigationStore
const { currentStepObject } = storeToRefs(navigationStore);

const navigateItem = (id, status) => {
  navigationStore.navigateItemAction(id, status);
};

const reserveDoi = async () => {
  // TODO metadataID connect with the real ID, see reference initMetadataUsingId - MetadataEditPage
  // await store.dispatch('user/DOI_RESERVE', 'metadataID');
  if (navigationStore.isStepSaveConfirmed) {
    doiPlaceholder.value = '10.10000/envidat.1234';
  } else {
    doiPlaceholder.value = null;
  }
};

const tooltip = {
  text: 'Scroll up ↑',
  scrim: true,
  persistent: false,
  openOnClick: true,
  openOnHover: false,
};

// init the driver step
const initDriver = () => {
  // DEFINE the guidelines on the store
  driver({
    showProgress: true,
    steps: navigationStore.workflowGuide,
  }).drive();
};
</script>

<style lang="scss">
.navigationWorkflow {
  background-color: #fff;
  @media screen and (min-width: 1280px) {
    // 960 is md for vueitfy
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
