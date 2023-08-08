

import globalMethods from '@/factories/globalMethods';
import ResourceCard from '@/modules/metadata/components/ResourceCard.vue';
import ResourceCardPlaceholder from '@/modules/metadata/components/ResourceCardPlaceholder.vue';
import { createResource } from '@/factories/metaDataFactory';
import { mobileLargeViewportParams, mobileViewportParams, tabletViewportParams } from './js/envidatViewports';

import dateCreatedIcon from '../src/assets/icons/dateCreated.png';
import lastModifiedIcon from '../src/assets/icons/dateModified.png';
import doiIcon from '../src/assets/icons/doi.png';
import fileSizeIcon from '../src/assets/icons/fileSize.png';
import unFormatedMetadataCards from './js/metadata';

const iconImgPath = require.context('@/assets/icons/', false, /\.png$/);
const iconFiles = globalMethods.methods.mixinMethods_importImages(iconImgPath);

// let str = '';
// for (const [key, value] of iconFiles) {
//   str += `got key ${key} value ${value} \n`;
// }

// console.log(`icons ${str}`);

const metadataCards = unFormatedMetadataCards;

const urlRes = createResource(metadataCards[0].resources[0]);
const fileRes = createResource(metadataCards[1].resources[1]);
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
  title: '3 Cards / Resource Cards',
  component: ResourceCard,
  decorators: [],
  parameters: {
  },
};

const Template = (args, { argTypes }) => ({
  components: { ResourceCard },
  props: Object.keys(argTypes),
  template: '<ResourceCard v-bind="$props" />',
});

export const Empty = Template.bind({});

export const Filled = Template.bind({});
Filled.args = { ...urlRes };

export const FilledFile = Template.bind({});
FilledFile.args = { ...fileRes };

export const Loading = Template.bind({});
Loading.args = { ...loadingRes };


export const MobileFilled = Template.bind({});
MobileFilled.args = { ...Filled.args };
MobileFilled.parameters = mobileViewportParams;

export const MobileLargeFilled = Template.bind({});
MobileLargeFilled.args = { ...Filled.args };
MobileLargeFilled.parameters = mobileLargeViewportParams;

export const TabletFilled = Template.bind({});
TabletFilled.args = { ...Filled.args };
TabletFilled.parameters = tabletViewportParams;

export const AccessWithoutUser = Template.bind({});
AccessWithoutUser.args = { ...protectedResBlocked };

export const AccessNotSameOrganization = Template.bind({});
AccessNotSameOrganization.args = { ...protResNotSameOga };

export const AccessWithSameOrganization = Template.bind({});
AccessWithSameOrganization.args = { ...protResWithSameOga };

export const AccessWithUser = Template.bind({});
AccessWithUser.args = { ...protResWithUserName };

export const AccessNotSameOrganizationButUserAccess = Template.bind({});
AccessNotSameOrganizationButUserAccess.args = { ...protResNotSameOgaButUser };


export const ResourceCardCollection = () => ({
    components: { ResourceCard },
    template: `
    <v-row >

      <v-col cols="3" class="pa-2"
              v-for="(res, index) in metadataCards[2].resources"
              :key="'cols-3_' + index" >

              <resource-card v-bind="res"
                              :doiIcon="doiIcon"
                              :dateCreatedIcon="dateCreatedIcon"
                              :lastModifiedIcon="lastModifiedIcon"
                              :fileExtensionIcon="iconFiles"
                               />
      </v-col>

      <v-col cols="4" class="pa-2"
              v-for="(res, index) in metadataCards[2].resources"
              :key="'cols-4_' + index" >

        <resource-card v-bind="res"
                        :doiIcon="doiIcon"
                        :dateCreatedIcon="dateCreatedIcon"
                        :lastModifiedIcon="lastModifiedIcon"
                        :fileExtensionIcon="iconFiles"
                        :isProtected="true"
                         />
      </v-col>

      <v-col cols="6" class="pa-2"
            v-for="(res, index) in metadataCards[2].resources"
            :key="'cols-6_' + index" >

        <resource-card v-bind="res"
                        :doiIcon="doiIcon"
                        :dateCreatedIcon="dateCreatedIcon"
                        :lastModifiedIcon="lastModifiedIcon"
                        :fileExtensionIcon="iconFiles"
                         />
      </v-col>

      <v-col cols="12" class="pa-2" >
        Resource Cards with Download disabled
      </v-col>

      <v-col cols="6" class="pa-2"
            v-for="(res, index) in metadataCards[0].resources"
            :key="'cols-6_' + index" >

        <resource-card v-bind="res"
                        :doiIcon="doiIcon"
                        :dateCreatedIcon="dateCreatedIcon"
                        :lastModifiedIcon="lastModifiedIcon"
                        :fileExtensionIcon="iconFiles"
                        :downloadActive="false"
                         />
      </v-col>

    </v-row>
    `,
    data: () => ({
      metadataCards,
      doiIcon,
      fileSizeIcon,
      dateCreatedIcon,
      lastModifiedIcon,
      iconFiles,
    }),
  });

export const ResourceCardWithPreview = () => ({
    components: { ResourceCard },
    template: `
    <v-row >

      <v-col cols="3" class="pa-2"
              v-for="(res, index) in metadataCards[2].resources"
              :key="'cols-3_' + index" >

              <resource-card v-bind="res"
                              description="Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, "
                              :doiIcon="doiIcon"
                              :dateCreatedIcon="dateCreatedIcon"
                              :lastModifiedIcon="lastModifiedIcon"
                              :fileExtensionIcon="iconFiles"
                              :showGenericOpenButton="true"
                              :genericOpenButtonBottom="true"
                              openButtonTooltip="Open File in Preview"
                               />
      </v-col>

    </v-row>
    `,
    data: () => ({
      metadataCards,
      doiIcon,
      fileSizeIcon,
      dateCreatedIcon,
      lastModifiedIcon,
      iconFiles,
    }),
  });

export const ResourceCardPlaceholders = () => ({
    components: { ResourceCardPlaceholder },
    template: `
    <v-row >

      <v-col cols="3" class="pa-2"
              v-for="index in 3"
              :key="index" >
        <resource-card-placeholder />
      </v-col>

      <v-col cols="4" class="pa-2"
              v-for="index in 3"
              :key="index" >
        <resource-card-placeholder twoColumnLayout />
      </v-col>

      <v-col cols="6" class="pa-2"
              v-for="index in 3"
              :key="index" >
        <resource-card-placeholder twoColumnLayout />
      </v-col>

    </v-row>
    `,
    data: () => ({}),
  });
