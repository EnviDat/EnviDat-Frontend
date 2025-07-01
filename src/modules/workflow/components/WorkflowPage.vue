<template>
  <div ref="appContainer" class="fill-height pa-2 pa-md-6">
    <v-row class="fill-height">
      <v-col cols="12" lg="4" xl="3" class="workflow-navigation__wrapper">
        <NavigationWorkflow
          @navigateItem="catchNavigate"
        />
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
              navigationStore.currentStep === 6 ? 'Finish Demo!' : 'Next Step'
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
            @clicked="catchConfirmSave"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { ref, watch, computed, nextTick, onMounted } from 'vue';

import { useRoute, useRouter } from 'vue-router';
import NavigationWorkflow from '@/components/Navigation/NavigationWorkflow.vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';

import { extractIcons } from '@/factories/iconFactory.ts';

import { useDatasetWorkflowStore } from '@/modules/workflow/datasetWorkflow.ts';
import { DatasetDTO } from '@/types/dataTransferObjectsTypes';

const route = useRoute();
const router = useRouter();

const props = defineProps({
  datasetId: {
    type: String,
    default: undefined,
  },
  dataset: {
    type: Object,
    default: undefined,
  },
});


const navigationStore = useDatasetWorkflowStore();

// TEMPORARY QUERY PARAMAMETER

const changeNavigationInStore = (stepParam: number | string) => {
  const step =  typeof stepParam === 'string' ? Number.parseInt(stepParam, 10) : stepParam;

  if (
    Number.isFinite(step) &&
    step >= 0 &&
    step < navigationStore.steps.length
  ) {
    navigationStore.jumpToStep(step);
  }
}


// END TEMPORARY QUERY PARAMAMETER

if (props.datasetId) {
  navigationStore.loadDataset(props.datasetId);
} else if (props.dataset) {
  navigationStore.initializeDataset(props.dataset as DatasetDTO);
}

const vm = ref(null);

// load the current view model
watch(
  () => navigationStore.currentStep,
  async () => {
    vm.value = navigationStore.currentViewModel;
  },
  { immediate: true },
);

watch( () => route?.query,
  (newQuery) =>   {
    const step = newQuery?.step as string || 0;
    changeNavigationInStore(step);
  },
)

const iconScroll = computed(() => extractIcons('scroll'));

const nextStepBlock = ref(null);

const scrollToFirstError = (errors) => {
  const firstField = Object.keys(errors).find((k) => errors[k]);
  if (!firstField) return;

  const selector = `[data-field="${firstField}"], #${firstField}`;

  const el = document.querySelector(selector);
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

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

const { currentStep, currentAsyncComponent } = storeToRefs(navigationStore);

const navigateRouterToStep = (step: number) => {
  if (router) {
    router.push({
      path: router.currentRoute.value.path,
      query: { step },
    });
  } else {
    // storybook context
    changeNavigationInStore(step);
  }
}

const catchConfirmSave = () => {
  const ok = navigationStore.confirmSave();

  if (ok) {
    navigateRouterToStep(currentStep.value + 1);
  }
}

const catchNavigate = ({ id, status } : { id: number, status: string }) => {
  if (status !== 'disabled') {
    navigateRouterToStep(id);
  }
}

const nextStep = async () => {
  const ok = await navigationStore.validateStepAction(currentStep.value);

  if (ok) {

    if (currentStep.value === 6) {
      // reset the worklfow
      
      // @ts-ignore
      navigationStore.initializeDataset();

      currentStep.value = 0;

      navigateRouterToStep(currentStep.value);

      return;
    }

    navigateRouterToStep( currentStep.value + 1);

  } else if (!ok && vm.value) {
    scrollToFirstError(vm.value.validationErrors);
  }
};

onMounted(() => {

  // always reset it to 0
  navigateRouterToStep(0);

});

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
