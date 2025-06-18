<template>
  <v-container ref="appContainer" class="fill-height" fluid>
    <v-row
      class="fill-height"
      :class="{ 'overflow-x-scroll': display.smAndDown.value }"
    >
      <v-col cols="12" lg="4" xl="3" class="workflow-navigation__wrapper">
        <NavigationWorkflow />
      </v-col>

      <v-col
        cols="12"
        lg="8"
        xl="9"
        class="workflow-content__wrapper position-relative"
        :class="{ loading: navigationStore.loading }"
      >
        <div>
          <div
            @click="scrollDown()"
            class="scrollToSave d-none d-md-flex flex-column justify-center align-center pt-8"
          >
            <v-icon :size="32" class="mr-1" :color="'#000'">
              {{ iconScroll }}
            </v-icon>
            <p class="text-caption scroll-text">Save</p>
          </div>
        </div>
        <v-card
          id="EditAdditionalInformation"
          class="pt-0"
          elevation="2"
          rounded="xl"
        >
          <div>
            <component
              :is="currentAsyncComponent"
              v-bind="vm"
              @validate="validate"
              @save="save"
              v-if="currentAsyncComponent"
            />
          </div>
          <div ref="nextStepBlock" class="pa-4 d-flex align-center justify-end">
            <v-btn @click="nextStep">{{
              navigationStore.currentStep === 6 ? 'Publish' : 'Next Step'
            }}</v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <!-- dialog, TODO make a external component -->
    <v-dialog v-model="navigationStore.openSaveDialog" max-width="500">
      <v-card rounded="xl">
        <v-card-text class="font-weight-bold"> Before You Proceed </v-card-text>

        <v-card-text>
          Saving your data now will <b>store your dataset in our system</b>, but
          it will not be published yet. Before publication, you will need to
          complete the remaining steps. However, from this point,
          <b>you can request a DOI for your dataset.</b>
        </v-card-text>

        <v-card-text>
          For any questions or clarifications, please contact the team at
          <a href="mailto:envidat@wsl.ch">envidat@wsl.ch</a>
        </v-card-text>

        <v-card-actions class="pa-7">
          <BaseRectangleButton
            :buttonText="'Save and Proceed'"
            @clicked="navigationStore.confirmSave(obj)"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { useDisplay } from 'vuetify';
import { storeToRefs } from 'pinia';

import { ref, watch, computed, nextTick } from 'vue';

import NavigationWorkflow from '@/components/Navigation/NavigationWorkflow.vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';

import { extractIcons } from '@/factories/iconFactory';

import { useDatasetWorkflowStore } from '@/modules/user/store/datasetWorkflow';

// define useDisplay
const display = useDisplay();

const navigationStore = useDatasetWorkflowStore();

const vm = ref(null);

// load the current view model
watch(
  () => navigationStore.currentStep,
  async () => {
    vm.value = navigationStore.currentViewModel;
  },
  { immediate: true },
);

const iconScroll = computed(() => extractIcons('scroll'));

const nextStepBlock = ref(null);

const scrollDown = () => {
  nextTick(() => {
    const target = nextStepBlock.value?.$el || nextStepBlock.value;
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
};

const save = (freshData) => {
  vm.value.save(freshData);
};

const validate = (freshData) => {
  vm.value?.validate(freshData);
};

const { currentStepObject, currentAsyncComponent } =
  storeToRefs(navigationStore);

const nextStep = () => {
  navigationStore.validateStepAction(navigationStore.currentStep);
};
</script>

<style lang="scss">
.loading {
  opacity: 0.2;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}
.scrollToSave {
  position: absolute;
  right: 38px;
  z-index: 2;
  opacity: 1;
  top: 0;
  transition: 0.1s linear;
  animation: bounce 1s infinite ease-in-out;
  &:hover {
    cursor: pointer;
  }
  // .scroll-text {
  //   position: relative;
  //   transform: translateX(-50%);
  // }
}
</style>
