import MetadataHeader from '@/modules/metadata/components/Metadata/MetadataHeader.vue';
import { createHeader } from '@/factories/metaDataFactory';
import metadata from './js/metadata';

const smallHeader = createHeader(metadata[0], true);
const largeHeader = createHeader(metadata[3], false);
const longAuthorsListHeader = createHeader(metadata[3], false);

export default {
  title: '15 Metadata Header / Header Views',
  component: MetadataHeader,
};

// export const Empty = { args: {} };

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

export const LongTitleMetadataHeader = {
  args: {
    ...largeHeader,
    showEditButton: true,
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
