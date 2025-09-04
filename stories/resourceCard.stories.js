import ResourceCard from '@/modules/metadata/components/ResourceCard.vue';
import { createResource } from '@/factories/resourceHelpers';
import {
  mobileLargeViewportParams,
  mobileViewportParams,
  tabletViewportParams,
} from './js/envidatViewports';

import metadataCards from './js/metadata';
import { Default } from '~/stories/resourceCardGenerated.stories.js';

const urlRes = createResource(metadataCards[0].resources[0]);
const fileRes = createResource(metadataCards[2].resources[1]);
const loadingRes = createResource(metadataCards[1].resources[0]);
const s3Url = createResource(metadataCards[0].resources[3]);
const S3FolderUrl = createResource(metadataCards[0].resources[3]);
S3FolderUrl.url = 'https://envicloud.wsl.ch/#/?bucket=https%3A%2F%2Fos.zhdk.cloud.switch.ch%2Fenvicloud%2F&prefix=doi%2F1000001.1%2F2023%2F';

loadingRes.loading = true;

const dataset = metadataCards[2];
const protectedResBlocked = createResource(
  dataset.resources[0],
  dataset.name,
  dataset.organization.id,
);

const dSet = metadataCards[0];
const protResWithUserName = createResource(
  dSet.resources[1],
  dSet.name,
  dSet.organization.id,
  'zhichao_he',
  [dSet.organization.id],
);

const protResNotSameOga = createResource(
  dSet.resources[1],
  dSet.name,
  'randomId',
  '',
  [dSet.organization.id],
);

const protResWithSameOga = createResource(
  dSet.resources[1],
  dSet.name,
  dSet.organization.id,
  '',
  [dSet.organization.id],
);

const protResNotSameOgaButUser = createResource(
  dSet.resources[1],
  dSet.name,
  'randomId',
  'zhichao_he',
  [dSet.organization.id],
);

export default {
  title: '1 Base / Cards /  Resource Cards / 2 From Datasets',
  component: ResourceCard,
};

export const UrlLink = {
  args: { ...urlRes },
};

export const UrlLinkS3bucket = {
  args: { ...s3Url, s3Bucket: true },
};

export const UrlS3IntoFolder = {
  args: { ...S3FolderUrl, s3Bucket: true },
};

export const UrlS3IntoFolderWithGenericButtonTop = {
  args: {
    ...UrlS3IntoFolder.args,
    showGenericOpenButton: true,
  },
};

export const WithGenericOpenButtonBottom = {
  args: {
    ...UrlLinkS3bucket.args,
    showGenericOpenButton: true,
    genericOpenButtonBottom: true,
  },
};


export const FileLink = {
  args: { ...fileRes },
};

export const MobileFilled = {
  args: { ...UrlLink.args },
  parameters: mobileViewportParams,
};

export const MobileLargeFilled = {
  args: { ...UrlLink.args },
  parameters: mobileLargeViewportParams,
};

export const TabletFilled = {
  args: { ...UrlLink.args },
  parameters: tabletViewportParams,
};

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
