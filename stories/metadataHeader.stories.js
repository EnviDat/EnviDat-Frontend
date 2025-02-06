import MetadataHeader from '@/modules/metadata/components/Metadata/MetadataHeader.vue';
import { createHeader, enhanceMetadatasTitleImage } from '@/factories/metaDataFactory';
import { createHeaderViewModel } from '@/factories/ViewModels/HeaderViewModel';
import { convertJSON } from '@/factories/mappingFactory';

import metadata from './js/metadata';

enhanceMetadatasTitleImage(metadata);

const smallHeader = createHeader(metadata[0], true);
const largeHeader = createHeader(metadata[3], false);
const longAuthorsListHeader = createHeader(metadata[3], false);

const parsedContent = convertJSON(metadata[0], false);

const header1 = createHeaderViewModel(parsedContent, true);

export default {
  title: '3 Datasets / 1 Views / Metadata Header',
  component: MetadataHeader,
};

export const Empty = {
  args: {},
};

export const PlaceHolder = {
  args: {
    showPlaceholder: true,
  },
};

export const ShortTitle = {
  args: header1,
  argTypes: {
    checkSize: { action: 'checkSize' },
    clickedTag: { action: 'clickedTag' },
    clickedAuthor: { action: 'clickedAuthor' },
    clickedBack: { action: 'clickedBack' },
    clickedEdit: { action: 'clickedEdit' },
  },
};

export const LongTitleHidden = {
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

export const LongTitle = {
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

export const LongTitleNoIcons = {
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

export const CropAuthorsList = {
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

export const PageViews = {
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
