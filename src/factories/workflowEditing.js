import {
  EDIT_STEP_TITLE_MAIN_METADATA,
  EDIT_STEP_TITLE_MAIN_PUBLICATION,
  EDIT_STEP_TITLE_MAIN_RELATED,
  EDIT_STEP_TITLE_MAIN_RESOURCES,
  EDIT_STEP_TITLE_SUB_DATA,
  EDIT_STEP_TITLE_SUB_DATES,
  EDIT_STEP_TITLE_SUB_GEO,
} from '@/factories/metadataConsts';

import {
  EDITMETADATA_DATA,
  EDITMETADATA_DATA_GEO,
  EDITMETADATA_DATA_INFO,
  EDITMETADATA_DATA_RESOURCES,
  EDITMETADATA_MAIN,
  EDITMETADATA_PUBLICATION_INFO,
  EDITMETADATA_RELATED_PUBLICATIONS,
} from '@/factories/eventBus';

import EditDataAndResources from '@/modules/user/components/EditDataAndResources.vue';
import EditDataInfo from '@/modules/user/components/EditDataInfo.vue';
import EditDataGeo from '@/modules/user/components/EditDataGeo.vue';

import MetadataGenericSubStepper from '@/modules/user/components/MetadataGenericSubStepper.vue';
import EditRelatedInfo from '@/modules/user/components/EditRelatedInfo.vue';
import EditPublication from '@/modules/user/components/edit/EditPublication.vue';


import {mainDetailSteps} from '@/factories/workflowFactory';


/**
 * detail steps for the "data and resources" major step only for the editing workflow
 * includes resource upload components
 * @type {step[]}
 */
const editingDataDetailSteps = [
  {
    title: EDIT_STEP_TITLE_SUB_DATA,
    completed: false,
    component: EditDataAndResources,
    key: EDITMETADATA_DATA_RESOURCES,
    genericProps: {},
  },
  {
    title: EDIT_STEP_TITLE_SUB_DATES,
    completed: false,
    key: EDITMETADATA_DATA_INFO,
    component: EditDataInfo,
    genericProps: {},
  },
  {
    title: EDIT_STEP_TITLE_SUB_GEO,
    completed: false,
    key: EDITMETADATA_DATA_GEO,
    component: EditDataGeo,
    genericProps: {},
  },
];


/**
 * The major steps for the editing workflow
 * @type {step[]}
 */
export const metadataEditingSteps = [
  {
    title: EDIT_STEP_TITLE_MAIN_METADATA,
    completed: false,
    component: MetadataGenericSubStepper,
    key: EDITMETADATA_MAIN,
    detailSteps: mainDetailSteps,
    stepTitle: mainDetailSteps[0].title,
    color: 'white',
    genericProps: {},
  },
  {
    title: EDIT_STEP_TITLE_MAIN_RESOURCES,
    completed: false,
    component: MetadataGenericSubStepper,
    key: EDITMETADATA_DATA,
    detailSteps: editingDataDetailSteps,
    stepTitle: editingDataDetailSteps[0].title,
    color: 'white',
    genericProps: {},
  },
  {
    title: EDIT_STEP_TITLE_MAIN_RELATED,
    completed: false,
    component: EditRelatedInfo,
    key: EDITMETADATA_RELATED_PUBLICATIONS,
    genericProps: {},
  },
  {
    title: EDIT_STEP_TITLE_MAIN_PUBLICATION,
    completed: false,
    component: EditPublication,
    key: EDITMETADATA_PUBLICATION_INFO,
    genericProps: {},
  },
];
