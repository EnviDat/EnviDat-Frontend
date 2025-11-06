// src/modules/workflow/composables/useWorkflowExternal.ts
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useOrganizationsStore } from '@/modules/organizations/store/organizationsStorePinia';
import { useDatasetWorkflowStore } from '@/modules/workflow/datasetWorkflow';

import {
  USER_NAMESPACE,
  USER_SIGNIN_NAMESPACE,
  FETCH_USER_DATA,
  USER_GET_DATASETS,
  METADATA_EDITING_LOAD_DATASET,
  UPDATE_METADATA_EDITING,
} from '@/modules/user/store/userMutationsConsts';

import { DOI_RESERVE } from '@/modules/user/store/doiMutationsConsts';

import { EDITMETADATA_PUBLICATION_INFO } from '@/factories/eventBus';

import {
  getUserOrganizationRoleMap,
  USER_ROLE_EDITOR,
  USER_ROLE_MEMBER,
  USER_ROLE_SYSTEM_ADMIN,
} from '@/factories/userEditingValidations';

export function useWorkflowExternal() {
  const store = useStore();
  const organizationsStore = useOrganizationsStore();
  const workflowStore = useDatasetWorkflowStore();

  const user = computed<any | null>(
    () => (store.state as any)[USER_SIGNIN_NAMESPACE]?.user ?? (store.state as any)[USER_NAMESPACE]?.user ?? null,
  );
  const userId = computed<string | undefined>(() => user.value?.id);

  const userDatasets = computed<any[]>(() => ((store.state as any)[USER_NAMESPACE]?.userDatasets as any[]) ?? []);

  const currentEditingContent = computed<any | null>(
    () => (store.state as any)[USER_NAMESPACE]?.currentEditingContent ?? null,
  );

  const doiWorkflowActive = computed<boolean>(() =>
    Boolean((store.state as any)?.config?.userEditMetadataConfig?.doiWorkflowActive),
  );

  async function fetchUserDatasets() {
    if (!userId.value) return;
    await store.dispatch(`${USER_NAMESPACE}/${FETCH_USER_DATA}`, {
      action: 'user_show',
      body: {
        id: userId.value,
        include_datasets: true,
      },
      commit: true,
      mutation: USER_GET_DATASETS,
    });
  }

  async function loadUserOrganizations() {
    if (!userId.value) return;
    if (!organizationsStore.userOrganizations?.length) {
      await organizationsStore.UserGetOrgIds(userId.value);
    }
  }

  async function initMetadataUsingId(id: string) {
    if (id !== currentEditingContent.value?.name) {
      await store.dispatch(`${USER_NAMESPACE}/${METADATA_EDITING_LOAD_DATASET}`, {
        metadataId: id,
        forceBackendReload: true,
      });
    }

    const c = currentEditingContent.value;
    if (doiWorkflowActive.value && c && !c.doi && (c.publicationState === '' || c.publicationState == null)) {
      await store.dispatch(`${USER_NAMESPACE}/${DOI_RESERVE}`, id);
    }
  }

  function updatePublicationStatus(datasetOrgaId?: string) {
    const userOrganizations = organizationsStore.userOrganizations ?? [];
    const roleMap = getUserOrganizationRoleMap(user.value?.id, userOrganizations);
    const datasetOrga = userOrganizations.find((o) => o.id === datasetOrgaId);

    let userRole = USER_ROLE_MEMBER;

    if (user.value?.sysadmin === true) {
      userRole = USER_ROLE_SYSTEM_ADMIN;
    } else if (datasetOrga) {
      const orgaName = datasetOrga.name;
      userRole = (roleMap as any)[orgaName];

      if (userRole === USER_ROLE_EDITOR) {
        const userIsOwner =
          userDatasets.value?.length > 0
            ? userDatasets.value.some((d) => d.id === currentEditingContent.value?.id)
            : false;
        if (!userIsOwner) {
          userRole = USER_ROLE_MEMBER;
        }
      }
    }

    const editPublicationInfo =
      store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](EDITMETADATA_PUBLICATION_INFO);

    store.commit(`${USER_NAMESPACE}/${UPDATE_METADATA_EDITING}`, {
      object: EDITMETADATA_PUBLICATION_INFO,
      data: {
        ...editPublicationInfo,
        userRole,
        loadingProps: true,
      },
    });
  }

  // TODO remove?
  // function updateStepsOrganizations() {
  //   const userOrganizations = organizationsStore.userOrganizations ?? [];

  //   const editOrgaData = store.getters[
  //     `${USER_NAMESPACE}/getMetadataEditingObject`
  //   ](EDITMETADATA_ORGANIZATION);

  //   store.commit(`${USER_NAMESPACE}/${UPDATE_METADATA_EDITING}`, {
  //     object: EDITMETADATA_ORGANIZATION,
  //     data: {
  //       ...editOrgaData,
  //       userOrganizations,
  //     },
  //   });

  //   const datasetOrgaId = editOrgaData?.organizationId;
  //   updatePublicationStatus(datasetOrgaId);
  // }

  return {
    user,
    userId,
    currentEditingContent,
    fetchUserDatasets,
    loadUserOrganizations,
    initMetadataUsingId,
    // updatePublicationStatus,
    // updateStepsOrganizations,
    workflowStore,
    userDatasets,
  };
}
