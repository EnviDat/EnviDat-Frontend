import ResourceCard from '@/modules/metadata/components/ResourceCard.vue';
import { mdiFileEye } from '@mdi/js';

// generated with https://chat.openai.com/g/g-p5QoaO4UG-storybookvue2gpt
export default {
  title: '1 Base / Cards /  Resource Cards / 1 Generics',
  component: ResourceCard,
};

export const Empty = {};

export const Default = {
  args: { 
    id: 'default-id',
    doi: '10.1000/xyz123',
    name: 'Default Resource',
    description: 'A brief description of the default resource.',
    url: 'http://example.com',
    restrictedUrl: '',
    created: '2022-01-01',
    lastModified: '2022-01-05',
    size: 1500,
    format: 'PDF',
    twoColumnLayout: false,
    height: 'auto',
    dark: false,
    deprecated: false,
    isProtected: false,
    metadataContact: '',
    downloadActive: true,
    showGenericOpenButton: false,
    genericOpenButtonBottom: false,
    openButtonTooltip: '',
    openButtonIcon: mdiFileEye,
    cardColor: 'primary',
    isSelected: false,
    loading: false, 
  },
};

export const DefaultSelected = {
  args: { 
    ...Default.args, 
    description: 'A brief description of the default resource, selected by the user.',
    isSelected: true,
  },
  decorators: [() => ({ template: '<div style="margin: 1em;"><story /></div>' })],
};

export const DarkTheme = {
  args: {
    ...Default.args,
    description: 'Resource card in a dark theme',
    dark: true,
  },
};

export const DarkThemeSelected = {
  args: {
    ...Default.args,
    description: 'Resource card in a dark theme, selected by the user.',
    dark: true,
    isSelected: true,
  },
  decorators: [() => ({ template: '<div style="margin: 1em;"><story /></div>' })],
};

export const Deprecated = {
  args: {
    ...Default.args,
    description: 'Resource card in of deprecated resource.',
    deprecated: true,
  },
};

export const RestrictedResource = {
  args: {
    ...Default.args,
    isProtected: true,
    restrictedUrl: 'https://example.com/restricted',
  },
};

export const TwoColumnRestricted = {
  args: {
    ...Default.args,
    twoColumnLayout: true,
    isProtected: true,
    restrictedUrl: 'https://example.com/restricted',
  },
};

export const LargeWithCustomLayout = {
  args: {
    ...Default.args,
    size: 5000,
    height: '300px',
    twoColumnLayout: true,
    cardColor: 'secondary',
    description: 'A large resource card with a custom height and secondary color.',
  },
};

export const LoadingState = {
  args: {
    ...Default.args,
    loading: true,
    description: 'Resource card showcasing the loading state.',
  },
};


export const TwoColumnLayout = {
  args: {
    ...Default.args,
    twoColumnLayout: true,
  },
};

export const DownloadDisabled = {
  args: {
    ...Default.args,
    downloadActive: false,
  },
};

export const WithGenericOpenButton = {
  args: {
    ...Default.args,
    showGenericOpenButton: true,
  },
};

export const WithGenericOpenButtonBottom = {
  args: {
    ...Default.args,
    showGenericOpenButton: true,
    genericOpenButtonBottom: true,
  },
};

export const DownloadDisabledGenericOpen = {
  args: {
    ...Default.args,
    downloadActive: false,
    showGenericOpenButton: true,
    description: 'Resource card with download disabled and a generic open button visible.',
  },
};
