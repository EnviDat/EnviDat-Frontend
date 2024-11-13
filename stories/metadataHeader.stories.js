import MetadataHeader from '@/modules/metadata/components/Metadata/MetadataHeader.vue';
import { createHeader, enhanceMetadatasTitleImage } from '@/factories/metaDataFactory';
import metadata from './js/metadata';

enhanceMetadatasTitleImage(metadata);

const smallHeader = createHeader(metadata[0], true);
const largeHeader = createHeader(metadata[3], false);
const longAuthorsListHeader = createHeader(metadata[3], false);

export default {
  title: '3 Dataset / 1 Views / Metadata Header',
  component: MetadataHeader,
};

export const EmptyMetadataHeader = {
  args: {},
};

export const PlaceHolderMetadataHeader = {
  args: {
    showPlaceholder: true,
  },
};

export const ShortTitleMextadataHeader = {
  args: {
    ...smallHeader,
  },
  argTypes: {
    checkSize: { action: 'checkSize' },
    clickedTag: { action: 'clickedTag' },
    clickedAuthor: { action: 'clickedAuthor' },
    clickedBack: { action: 'clickedBack' },
    clickedEdit: { action: 'clickedEdit' },
  },
};

export const LongTitleMetadataHeaderHidden = {
  args: {
    ...largeHeader,
    showEditButton: true,
    metadataState: 'hidden',
    publicationYear: '2023',
  },
  argTypes: {
    checkSize: { action: 'checkSize' },
    clickedTag: { action: 'clickedTag' },
    clickedAuthor: { action: 'clickedAuthor' },
    clickedBack: { action: 'clickedBack' },
    clickedEdit: { action: 'clickedEdit' },
  },
};

export const LongTitleMetadataHeader = {
  args: {
    ...largeHeader,
    showEditButton: true,
    publicationStatus: 'published',
    publicationYear: '2023',
  },
  argTypes: {
    checkSize: { action: 'checkSize' },
    clickedTag: { action: 'clickedTag' },
    clickedAuthor: { action: 'clickedAuthor' },
    clickedBack: { action: 'clickedBack' },
    clickedEdit: { action: 'clickedEdit' },
  },
};

export const LongTitleNoIconsMetadataHeader = {
  args: {
    ...largeHeader,
  },
  argTypes: {
    checkSize: { action: 'checkSize' },
    clickedTag: { action: 'clickedTag' },
    clickedAuthor: { action: 'clickedAuthor' },
    clickedBack: { action: 'clickedBack' },
    clickedEdit: { action: 'clickedEdit' },
  },
};

export const CropAuthorsListMetadataHeader = {
  args: {
    ...longAuthorsListHeader,
  },
  argTypes: {
    checkSize: { action: 'checkSize' },
    clickedTag: { action: 'clickedTag' },
    clickedAuthor: { action: 'clickedAuthor' },
    clickedBack: { action: 'clickedBack' },
    clickedEdit: { action: 'clickedEdit' },
  },
};

export const PageViewsMetadataHeader = {
  args: {
    ...longAuthorsListHeader,
    pageViews: [{ nb_events: 10 }],
    publicationYear: 2024,
  },
  argTypes: {
    checkSize: { action: 'checkSize' },
    clickedTag: { action: 'clickedTag' },
    clickedAuthor: { action: 'clickedAuthor' },
    clickedBack: { action: 'clickedBack' },
    clickedEdit: { action: 'clickedEdit' },
  },
};
