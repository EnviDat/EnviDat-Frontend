<template>
  <div ref="appContainer" class="fill-height pa-2 pa-md-6">
    <v-row class="fill-height">
      <v-col cols="12" lg="4" xl="3" class="workflow-navigation__wrapper">
        <TheWorkflowNavigation
          @navigateItem="catchNavigate"
          :isDatasetEditing="isDatasetEditing"
          :currentDataset="workflowStore?.datasetModel"
          @catchCloseClick="catchCloseClick"
        />
      </v-col>

      <v-col
        cols="12"
        lg="8"
        xl="9"
        class="workflow-content__wrapper position-relative"
        :class="{ loading: storeLoading }"
      >
        <div>
          <!-- <div
            @click="scrollDown()"
            class="scrollToSave d-none d-md-flex flex-column justify-center align-center pt-8"
          >
            <v-icon :size="32" class="mr-1" :color="'#000'">
              {{ iconScroll }}
            </v-icon>
            <p class="text-caption scroll-text">Save</p>
          </div> -->
        </div>

        <v-card
          id="EditAdditionalInformation"
          class="pt-0"
          elevation="2"
          rounded="xl"
        >
          <div>
            <component
              :is="resolvedComponent"
              :key="currentStepNum"
              v-bind="vm"
              :user-role="workflowStore.userRole ?? 'member'"
              @validate="validate"
              @save="save"
              @reload="reloadDataset"
              v-if="resolvedComponent && !storeLoading"
            />
          </div>
          <div ref="nextStepBlock" class="pa-4 d-flex align-center justify-end">
            <v-btn @click="nextStep">{{
              currentStepNum === 6 ? 'Close' : 'Next Step'
            }}</v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <WorkflowSaveDialog
      v-model="openSaveDialog"
      :ready-to-save="readyToSaveFlag"
      :error-message="saveErrMsg"
      :loading="savingLoading"
      @close="closeModal"
      @confirm="catchConfirmSave"
    />
  </div>
</template>

<script setup lang="ts">
/* =========================
 *  IMPORTS
 * ========================= */
// import { storeToRefs } from 'pinia';
import {
  ref,
  watch,
  computed,
  nextTick,
  onMounted,
  onBeforeUnmount,
  defineAsyncComponent,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { USER_DASHBOARD_PAGENAME } from '@/router/routeConsts';
import TheWorkflowNavigation from '@/components/Navigation/TheWorkflowNavigation.vue';

import { useWorkflowExternal } from '@/modules/workflow/utils/useWorkflowExternal.ts';
import { useOrganizationsStore } from '@/modules/organizations/store/organizationsStorePinia';

// import { extractIcons } from '@/factories/iconFactory.ts';
import { useDatasetWorkflowStore } from '@/modules/workflow/datasetWorkflow.ts';
import WorkflowSaveDialog from '@/modules/workflow/components/steps/WorkflowSaveDialog.vue';
import {
  StepStatus,
  WorkflowMode,
} from '@/modules/workflow/utils/workflowEnums';

const workflowStore = useDatasetWorkflowStore();
const orgStore = useOrganizationsStore();
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
const currentStep = computed(() => workflowStore?.currentStep ?? 0);
const currentAsyncComponent = computed(
  () => workflowStore?.currentAsyncComponent ?? null,
);
const vm = computed(() => workflowStore.currentViewModel);
// const iconScroll = computed(() => extractIcons('scroll'));
const nextStepBlock = ref(null);

/* use external orchestration */
const {
  fetchUserDatasets,
  loadUserOrganizations,
  // initMetadataUsingId,
  // updateStepsOrganizations,
  user,
  userDatasets,
} = useWorkflowExternal();

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

const openSaveDialog = computed({
  get: () => workflowStore?.openSaveDialog ?? false,
  set: (val: boolean) => {
    if (workflowStore) workflowStore.openSaveDialog = val;
  },
});
const readyToSaveFlag = computed(
  () => workflowStore?.readyToSaveToBackend ?? false,
);
const saveErrMsg = computed(() => workflowStore?.saveErrorMessage ?? undefined);
const savingLoading = computed(
  () => workflowStore?.backendStorageService?.loadingDataset ?? false,
);
const isDatasetEditing = computed(
  () => workflowStore?.isDatasetEditing ?? false,
);

const storeLoading = computed(() => !!workflowStore?.loading);
const currentStepNum = computed(() => workflowStore?.currentStep ?? 0);

const resolvedComponent = computed(() => {
  const c = currentAsyncComponent.value;
  if (!c) return null;
  // already component
  if (
    typeof c === 'object' &&
    ('setup' in (c as any) || 'render' in (c as any))
  )
    return c as any;
  // load
  if (typeof c === 'function') return defineAsyncComponent(c as any);
  // promise
  if ((c as any)?.then) return defineAsyncComponent(() => c as Promise<any>);
  return null;
});

const scrollDown = () => {
  nextTick(() => {
    const target = (nextStepBlock.value as any)?.$el || nextStepBlock.value;
    (target as HTMLElement | undefined)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  });
};

/* =========================
 *  VALIDATION LOGIC
 * ========================= */
const validate = (freshData) => {
  vm.value?.validate(freshData);
  // FIX Validation during navigation
  workflowStore.markStepTouched(workflowStore.currentStep, true);
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
  const stepNum =
    typeof stepParam === 'string' ? Number.parseInt(stepParam, 10) : stepParam;

  if (
    Number.isFinite(stepNum) &&
    (stepNum as number) >= 0 &&
    (stepNum as number) < workflowStore.steps.length
  ) {
    workflowStore.jumpToStep(stepNum as number);
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

// if the step is completed, the next one can be jumped to
const canJumpFromDisabled = (id: number) => {
  if (workflowStore.mode !== WorkflowMode.Create) return false;
  if (id <= 0) return false;
  const prev = workflowStore.steps[id - 1];
  return !!prev?.completed;
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

  if (status !== StepStatus.Disabled || canJumpFromDisabled(id)) {
    navigateRouterToStep(id);
  }
};

const nextStep = async () => {
  // FIX Validation during navigation
  workflowStore.markStepTouched(workflowStore.currentStep, true);
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
  // FIX Validation during navigation
  workflowStore.markStepTouched(workflowStore.currentStep, true);
  const ok = await vm.value.save(freshData);

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

// CONFIRM- If confirmed, save to the backend, close the dialog, and mark the step as validated.
const closeModal = () => {
  workflowStore.openSaveDialog = false;
  workflowStore.readyToSaveToBackend = false;
};
const catchConfirmSave = async () => {
  const dataset = workflowStore.datasetModel.dataset;

  if (workflowStore.backendStorageService.loadingDataset) {
    return;
  }

  workflowStore.readyToSaveToBackend = true;
  workflowStore.saveErrorMessage = undefined;

  try {
    await workflowStore.backendStorageService.createDataset(dataset);

    workflowStore.isStepSaveConfirmed = true;
    workflowStore.openSaveDialog = false;
    navigateRouterToStep(currentStep.value + 1);
  } catch (e: any) {
    workflowStore.isStepSaveConfirmed = false;
    workflowStore.openSaveDialog = true;
    workflowStore.readyToSaveToBackend = false;
    workflowStore.saveErrorMessage =
      e?.message ??
      e?.response?.data?.error?.message ??
      'Error saving the dataset';
  } finally {
    workflowStore.readyToSaveToBackend = false;
  }
};

const catchCloseClick = () => {
  router.push({ name: USER_DASHBOARD_PAGENAME });
};

const reloadDataset = () => {
  workflowStore.loadDataset(route?.params?.id as string);
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
  () => [
    workflowStore.datasetModel?.dataset?.id,
    orgStore.userOrganizations,
    userDatasets.value,
    user.value,
  ],
  () => {
    workflowStore.computeUserRole({
      user: user.value,
      userOrganizations: orgStore.userOrganizations,
      userDatasets: userDatasets.value,
    });
  },
  { deep: true },
);

watch(user, (u) => {
  workflowStore.setCurrentUser(u);
});

// Handle save modal opening
watch(
  () => workflowStore.openSaveDialog,
  (open) => {
    if (open) {
      workflowStore.readyToSaveToBackend = true;
      workflowStore.saveErrorMessage = undefined;
    }
  },
);
// TODO check with dominik, this creates double loading
// watch(
//   () => route?.params,
//   (newParams) => {
//     if (newParams.id) {
//       workflowStore.loadDataset(newParams.id as string);
//     }
//   },
// );

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
  } else if (!id) {
    id = route?.params?.id as string;
  }

  await workflowStore.bootstrapWorkflow(id);

  // await initMetadataUsingId(id);

  await Promise.all([loadUserOrganizations(), fetchUserDatasets()]);
  // SET currentUser
  workflowStore.setCurrentUser(user.value);
  // SET user role
  workflowStore.computeUserRole({
    user: user.value,
    userOrganizations: orgStore.userOrganizations,
    userDatasets: userDatasets.value,
  });

  workflowStore.currentDatasetId = id;
  // updateStepsOrganizations();

  const stepParam = route?.query?.step;
  if (stepParam !== undefined) {
    workflowStore.setActiveStep(Number(stepParam));
  }
});

onBeforeUnmount(() => {
  if (!workflowStore) return;
  workflowStore.openSaveDialog = false;
  workflowStore.readyToSaveToBackend = false;
  workflowStore.saveErrorMessage = undefined;
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
