/**
 * @summary story of TagChip & TagChipPlaceholder for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-07-15 11:09:29
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */

import FilterMapView from '@/components/Filtering/FilterMapView.vue';

// import { mobileLargeViewportParams, mobileViewportParams, tabletViewportParams } from '@/../stories/js/envidatViewports';
// import { createLocation } from '@/factories/geoFactory';
import { enhanceMetadatas } from '@/factories/metaDataFactory';
import metadata from '@/../stories/js/metadata';

enhanceMetadatas(metadata);
// const location1 = createLocation(metadata[2]);

export default {
  title: '2 Search / filtering map',
  component: FilterMapView,
};

export const Empty = {};

export const WithEntries = {
  args:{
    content: metadata,
  },
};

