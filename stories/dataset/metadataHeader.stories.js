import MetadataHeader from '@/modules/metadata/components/Metadata/MetadataHeader.vue';
import { createHeader, enhanceMetadatasTitleImage } from '@/factories/metaDataFactory';
import { createHeaderViewModel } from '@/factories/ViewModels/HeaderViewModel';
import { convertJSON } from '@/factories/convertJSON';

import metadata from '@/../stories/js/metadata';

enhanceMetadatasTitleImage(metadata);

const parsedDataset1 = convertJSON(metadata[0], false);
const headerViewModel = createHeaderViewModel(parsedDataset1, true, 'primary', metadata[0].titleImg);

const parsedDataset2 = convertJSON(metadata[3], false);
const largeHeader = createHeaderViewModel(parsedDataset2, true, 'primary', metadata[3].titleImg);
// const largeHeader = createHeader(metadata[3], false);
const longAuthorsListHeader = createHeader(metadata[3], false);

export default {
  title: '3 Datasets / 1 Views / Header',
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
  args: { ...headerViewModel },
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
