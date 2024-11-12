import ResourceCard from '@/modules/metadata/components/ResourceCard.vue';
import { createResource } from '@/factories/metaDataFactory';
import { mobileLargeViewportParams, mobileViewportParams, tabletViewportParams } from './js/envidatViewports';

import metadataCards from './js/metadata';

const urlRes = createResource(metadataCards[0].resources[0]);
const fileRes = createResource(metadataCards[2].resources[1]);
const loadingRes = createResource(metadataCards[1].resources[0]);
loadingRes.loading = true;

const dataset = metadataCards[2];
const protectedResBlocked = createResource(dataset.resources[0], dataset.name, dataset.organization.id);

const dSet = metadataCards[0];
const protResWithUserName = createResource(dSet.resources[1], dSet.name, dSet.organization.id,
  'zhichao_he',
  [dSet.organization.id]);

const protResNotSameOga = createResource(dSet.resources[1], dSet.name, 'randomId',
  '',
  [dSet.organization.id]);

const protResWithSameOga = createResource(dSet.resources[1], dSet.name, dSet.organization.id,
  '',
  [dSet.organization.id]);

const protResNotSameOgaButUser = createResource(dSet.resources[1], dSet.name, 'randomId',
  'zhichao_he',
  [dSet.organization.id]);

export default {
  title: '3 Cards / Resource Cards / 2 From Datasets',
  component: ResourceCard,
  decorators: [],
  parameters: {
  },
};



export const UrlLink = {
  args: { ...urlRes },
};

export const FileLink = {
  args: { ...fileRes },
};


export const MobileFilled = {
  args: { ...UrlLink.args },
  parameters: mobileViewportParams,
}

export const MobileLargeFilled = {
  args: { ...UrlLink.args },
  parameters: mobileLargeViewportParams,
}

export const TabletFilled = {
  args: { ...UrlLink.args },
  parameters: tabletViewportParams,
}

export const AccessWithoutUser = {
  args: { ...protectedResBlocked },
};

export const AccessWithUser = {
  args: { ...protResWithUserName },
};


export const AccessWithSameOrganization = {
  args: { ...protResWithSameOga },
};

export const AccessNotSameOrganization = {
  args: { ...protResNotSameOga },
};

export const AccessNotSameOrganizationButUserAccess = {
  args: { ...protResNotSameOgaButUser },
};

