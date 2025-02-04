// noinspection JSUnusedGlobalSymbols
/* eslint-disable */
/* eslint-disable import/no-extraneous-dependencies */

/**
 * @summary story of all the MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-10-29 20:26:06
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import MetadataGeo from '@/modules/metadata/components/Geoservices/MetadataGeo.vue';
import metadata from './js/metadata';
import { createLocation } from '@/factories/geoFactory';


export default {
  title: '3 Dataset / 1 Views / Metadata Location',
  component: MetadataGeo,
};

const location1 = createLocation(metadata[2]);

const gcnetRawSpatial = "{\"type\":\"Polygon\",\"coordinates\":[[[-69.2578125,58.92884056311852],[-69.2578125,83.22122652790935],[-10.1953125,83.22122652790935],[-10.1953125,58.92884056311852],[-69.2578125,58.92884056311852]]]}"

const gcnetLocation = createLocation({
  id: "testingWithGcNetData",
  name: "testingWithGcNetData",
  title: "testingWithGcNetData",
  spatial: gcnetRawSpatial,
})

export const Empty = {}

export const WithDataFromDataset = {
  args: {
    showPlaceholder: false,
    site: location1.geomCollection,
    mapHeight: 450,
  },
}

export const GcNetStyling = {
  args: {
    showPlaceholder: false,
    site: gcnetLocation.geomCollection,
    mapHeight: 450,
    isGcnet: true,
  },
}

