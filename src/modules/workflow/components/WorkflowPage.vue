<template>
  <div ref="appContainer" class="fill-height pa-2 pa-md-6">
    <v-row class="fill-height">
      <v-col cols="12" lg="4" xl="3" class="workflow-navigation__wrapper">
        <TheWorkflowNavigation
          @navigateItem="catchNavigate"
          :isDatasetEditing="workflowStore.isDatasetEditing"
        />
      </v-col>

      <v-col
        cols="12"
        lg="8"
        xl="9"
        class="workflow-content__wrapper position-relative"
        :class="{ loading: workflowStore.loading }"
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
              :key="workflowStore.currentStep"
              v-bind="vm"
              @validate="validate"
              @save="save"
              v-if="currentAsyncComponent && !workflowStore.loading"
            />
          </div>
          <div ref="nextStepBlock" class="pa-4 d-flex align-center justify-end">
            <v-btn @click="nextStep">{{
              workflowStore.currentStep === 6 ? 'Finish Demo!' : 'Next Step'
            }}</v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <!-- dialog, TODO make a external component -->
    <v-dialog v-model="workflowStore.openSaveDialog" max-width="500">
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
/* =========================
 *  IMPORTS
 * ========================= */
import { storeToRefs } from 'pinia';
import { ref, watch, computed, nextTick, onMounted, toRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TheWorkflowNavigation from '@/components/Navigation/TheWorkflowNavigation.vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';

import { extractIcons } from '@/factories/iconFactory.ts';
import { useDatasetWorkflowStore } from '@/modules/workflow/datasetWorkflow.ts';
import { StepStatus, WorkflowMode } from '@/modules/workflow/utils/workflowEnums';

/* =========================
 *  ROUTER & PROPS
 * ========================= */
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

/* =========================
 *  STORE & REFS/COMPUTEDS
 * ========================= */
const workflowStore = useDatasetWorkflowStore();
const { currentStep, currentAsyncComponent } = storeToRefs(workflowStore);
const vm = computed(() => workflowStore.currentViewModel);
const iconScroll = computed(() => extractIcons('scroll'));
const nextStepBlock = ref(null);

/* =========================
 *  UI HELPERS (SCROLL)
 * ========================= */
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

/* =========================
 *  VALIDATION LOGIC
 * ========================= */
const validate = (freshData) => {
  vm.value?.validate(freshData);
  // TODO: ticket (https://envicloud.atlassian.net/browse/EN-2431)
  // workflowStore.markStepTouched(workflowStore.currentStep, true);
};

const checkValidation = async (data) => {
  const ok = await workflowStore.validateStepAction(data);
  if (!ok) {
    if (vm.value) scrollToFirstError(vm.value.validationErrors);
    return false;
  }
  return true;
};

/* =========================
 *  NAVIGATION LOGIC
 * ========================= */
const changeNavigationInStore = (stepParam: number | string) => {
  const step =
    typeof stepParam === 'string' ? Number.parseInt(stepParam, 10) : stepParam;

  if (Number.isFinite(step) && step >= 0 && step < workflowStore.steps.length) {
    workflowStore.jumpToStep(step);
  }
};

const navigateRouterToStep = async (step: number) => {
  const leaving = currentStep.value;

  if (workflowStore.mustValidateOnLeave(leaving)) {
    const ok = workflowStore.validateStepAction(leaving);
    if (!ok) {
      if (vm.value) scrollToFirstError(vm.value.validationErrors);
      return;
    }
  }

  if (router) {
    router.push({ path: router.currentRoute.value.path, query: { step } });
  } else {
    changeNavigationInStore(step);
  }
};

const catchNavigate = async ({
  id,
  status,
}: {
  id: number;
  status: string;
}) => {
  const valid = await checkValidation(currentStep.value);
  if (!valid) return;

  if (status !== StepStatus.Disabled) {
    navigateRouterToStep(id);
  }
};

const nextStep = async () => {
  const valid = await checkValidation(currentStep.value);
  if (!valid) return;

  if (currentStep.value === workflowStore.steps.length - 1) return;

  let target: number;
  if (workflowStore.mode === WorkflowMode.Create) {
    target = workflowStore.getNextUncompletedStep(currentStep.value);
  } else {
    target = Math.min(currentStep.value + 1, workflowStore.steps.length - 1);
  }

  navigateRouterToStep(target);
};

/* =========================
 *  SAVE LOGIC
 * ========================= */
const save = async (freshData) => {
  // TODO: ticket (https://envicloud.atlassian.net/browse/EN-2431)
  // workflowStore.markStepTouched(workflowStore.currentStep, true);
  // const ok = await vm.value.save(toRaw(freshData));
  const ok = await vm.value.save(freshData);

  // EDIT mode - if we have errors, we block the navigation
  const step = workflowStore.steps[workflowStore.currentStep];
  if (workflowStore.mode === WorkflowMode.Edit && !step.readOnly) {
    if (!ok) {
      workflowStore.markStepDirty(workflowStore.currentStep, true);
      scrollToFirstError(vm.value.validationErrors);
    } else {
      workflowStore.markStepDirty(workflowStore.currentStep, false);
    }
  }
};

const catchConfirmSave = () => {
  const ok = workflowStore.confirmSaveToBackend();

  if (ok) {
    navigateRouterToStep(currentStep.value + 1);
  }
};

/* =========================
 *  WATCHERS
 * ========================= */
watch(
  () => route?.query,
  (newQuery) => {
    const step = (newQuery?.step as string) || 0;
    changeNavigationInStore(step);
  },
);

watch(
  () => route?.params,
  (newParams) => {
    if (newParams.id) {
      workflowStore.loadDataset(newParams.id as string);
    }
})

/*
/!* =========================
 *  STORYBOOK HELPERS
 * ========================= *!/
const datasetExistsInLocalStorage = (datasetId?: string) => {
  if (!datasetId) return false;
  try {
    return !!window.localStorage.getItem(datasetId);
  } catch {
    return false;
  }
};

*/

/* =========================
 *  ON MOUNTED
 * ========================= */
onMounted(async () => {
  let id = props.datasetId;

  if (props.dataset) {
    // STORYBOOK
    // PLEASE NOTE – We are currently in the development phase, and an exception is present to make Storybook work.
    await workflowStore.initializeWorkflowfromDataset(props.dataset);
    id = props.dataset.id;
  } else if(!id) {
    id = route?.params?.id as string;
  }

  await workflowStore.bootstrapWorkflow(id);

  // const step = Number(route?.query?.step ?? 0);
  // workflowStore.setActiveStep(step);
  const stepParam = route?.query?.step;
  if (stepParam !== undefined) {
    workflowStore.setActiveStep(Number(stepParam));
  }
});

/* =========================
 *  LEGACY / OLD BK LOGIC (COMMENTED)
 * ========================= */
// load the current view model
// watch(
//   () => workflowStore.currentStep,
//   async () => {
//     vm.value = workflowStore.currentViewModel;
//   },
//   { immediate: false },
// );
/*
onBeforeMount(() => {
  vm.value = workflowStore.currentViewModel;
})
*/

// const datasetExistsInLocalStorage = (datasetId: string) => {
//   const localData = localStorage.getItem(datasetId);
//   return !!localData;
// };

// if (datasetExistsInLocalStorage(mergedDataset.id)) {
//   // DOMINIK, is this name (initializeWorkflowfromDataset) correct?
//   console.log('localstorage');
//   workflowStore.initializeWorkflowfromDataset(mergedDataset);
// } else {
//   console.log('nolocalstorage');
//   workflowStore.initializeWorkflow(props.datasetId || props.dataset?.id);
// }
// const vm = ref(null);

// onMounted(() => {
//   nextTick(() => {
//     vm.value = workflowStore.currentViewModel;
//   });

//   // always reset it to 0
//   navigateRouterToStep(0);
// });
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
