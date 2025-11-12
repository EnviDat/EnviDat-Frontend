/**
 * @summary story of Resource DataViz List sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-08-25 12:21:22
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import ResourceDataVizList from '@/modules/charts/components/ResourceDataVizList.vue';

const resources = [
  {
    cache_last_updated: null,
    cache_url: null,
    created: '2020-08-04T14:41:05.038065',
    description:
      'This file contains the data required to reproduce Figure 3:  \r\n       \r\n- "FOREST_TYPE" states whether a row corresponds to managed forests or to \'latent reserves\' with a given number of years without human intervention (for example, \'LATENT_RESERVE40\' are the \'latent reserves\' with at least 40 years without human intervention)  \r\n- "ELEV_VEG_ZONE" refers to the elevation vegetation zone (colline and submontane, montane or subalpine)  \r\n- "VARIABLE" refers to the indicators described in the figure: Ellenberg indicators for light, temperature and moisture, as well as species richness.   \r\n- "mean" refers to the mean value of each indicator for each combination of forest type and elevation vegetation zone (corrected for the inclusion probability of each tree).  \r\n- "se" corresponds to the standard error.\r\n\r\nFor these calculations, site index was constrained to the range observed in \'latent reserves\' with at least 40 years without intervention. ',
    doi: '',
    format: '.csv',
    hash: '',
    id: '744ed206-605b-43a0-a560-bd0f27777735',
    last_modified: '2020-08-04T14:41:04.883893',
    metadata_modified: null,
    mimetype: 'text/csv',
    mimetype_inner: null,
    name: 'Data figure 3',
    package_id: '702645a2-8965-40df-ae9d-8b81df220bd1',
    position: 1,
    resource_size: '{"size_value": "", "size_units": "kb"}',
    resource_type: null,
    restricted: '{"level": "public", "allowed_users": "", "shared_secret": ""}',
    size: 5508,
    state: 'active',
    url: 'https://www.envidat.ch/dataset/702645a2-8965-40df-ae9d-8b81df220bd1/resource/744ed206-605b-43a0-a560-bd0f27777735/download/d_fig3.csv',
    url_type: 'upload',
  },
  {
    cache_last_updated: null,
    cache_url: null,
    created: '2020-09-08T11:11:20.007458',
    description: 'Illgraben debris-flow bulk volumes from 2000 to 2017.',
    doi: '',
    format: '.csv',
    hash: '',
    id: '55b715bc-742a-4a5d-8728-314e7da4793e',
    last_modified: '2020-09-08T11:11:19.697330',
    metadata_modified: null,
    mimetype: 'text/csv',
    mimetype_inner: null,
    name: '',
    package_id: '04b7e6bf-ef34-4c42-b7b2-ee17fab3bed6',
    position: 0,
    resource_size: '{"size_value": "", "size_units": "kb"}',
    resource_type: null,
    restricted: '{"shared_secret": "", "allowed_users": "", "level": "public"}',
    size: 1996,
    state: 'active',
    url: 'https://www.envidat.ch/dataset/04b7e6bf-ef34-4c42-b7b2-ee17fab3bed6/resource/55b715bc-742a-4a5d-8728-314e7da4793e/download/illgraben_debrisflows_2000-2017.csv',
    url_type: 'upload',
  },
  {
    cache_last_updated: null,
    cache_url: null,
    created: '2020-08-28T21:16:48.505380',
    description:
      'This is the mean bedrock slab erosion data (MSE in [m]) for all 5 surveying epochs, based on millions of individual surface point surveys.',
    doi: '',
    format: 'CSV',
    hash: '',
    id: '5ad00781-8f75-4457-ae4e-7ae2ddbbab28',
    last_modified: '2020-08-28T21:16:48.216038',
    metadata_modified: null,
    mimetype: 'text/csv',
    mimetype_inner: null,
    name: 'Mean bedrock slab erosion',
    package_id: '0894fa5c-5174-402c-99c4-23b10bb15024',
    position: 1,
    resource_size: '{"size_value": "", "size_units": "kb"}',
    resource_type: null,
    restricted: '{"shared_secret": "", "allowed_users": "", "level": "public"}',
    size: 85,
    state: 'active',
    url: 'https://www.envidat.ch/dataset/0894fa5c-5174-402c-99c4-23b10bb15024/resource/5ad00781-8f75-4457-ae4e-7ae2ddbbab28/download/envidat-mse.csv',
    url_type: 'upload',
  },
  {
    cache_last_updated: null,
    cache_url: null,
    created: '2020-09-08T11:11:20.007458',
    description: 'Illgraben debris-flow bulk volumes from 2000 to 2017.',
    doi: '',
    format: '.csv',
    hash: '',
    id: '55b715bc-742a-4a5d-8728-314e7da4793e',
    last_modified: '2020-09-08T11:11:19.697330',
    metadata_modified: null,
    mimetype: 'text/csv',
    mimetype_inner: null,
    name: '',
    package_id: '04b7e6bf-ef34-4c42-b7b2-ee17fab3bed6',
    position: 0,
    resource_size: '{"size_value": "", "size_units": "kb"}',
    resource_type: null,
    restricted: '{"shared_secret": "", "allowed_users": "", "level": "public"}',
    size: 1996,
    state: 'active',
    url: 'https://www.envidat.ch/dataset/04b7e6bf-ef34-4c42-b7b2-ee17fab3bed6/resource/55b715bc-742a-4a5d-8728-314e7da4793e/download/illgraben_debrisflows_2000-2017.csv',
    url_type: 'upload',
  },
  {
    cache_last_updated: null,
    cache_url: null,
    created: '2020-08-04T14:41:05.038065',
    description:
      'This file contains the data required to reproduce Figure 3:  \r\n       \r\n- "FOREST_TYPE" states whether a row corresponds to managed forests or to \'latent reserves\' with a given number of years without human intervention (for example, \'LATENT_RESERVE40\' are the \'latent reserves\' with at least 40 years without human intervention)  \r\n- "ELEV_VEG_ZONE" refers to the elevation vegetation zone (colline and submontane, montane or subalpine)  \r\n- "VARIABLE" refers to the indicators described in the figure: Ellenberg indicators for light, temperature and moisture, as well as species richness.   \r\n- "mean" refers to the mean value of each indicator for each combination of forest type and elevation vegetation zone (corrected for the inclusion probability of each tree).  \r\n- "se" corresponds to the standard error.\r\n\r\nFor these calculations, site index was constrained to the range observed in \'latent reserves\' with at least 40 years without intervention. ',
    doi: '',
    format: '.csv',
    hash: '',
    id: '744ed206-605b-43a0-a560-bd0f27777735',
    last_modified: '2020-08-04T14:41:04.883893',
    metadata_modified: null,
    mimetype: 'text/csv',
    mimetype_inner: null,
    name: 'Data figure 3',
    package_id: '702645a2-8965-40df-ae9d-8b81df220bd1',
    position: 1,
    resource_size: '{"size_value": "", "size_units": "kb"}',
    resource_type: null,
    restricted: '{"level": "public", "allowed_users": "", "shared_secret": ""}',
    size: 5508,
    state: 'active',
    url: 'https://www.envidat.ch/dataset/702645a2-8965-40df-ae9d-8b81df220bd1/resource/744ed206-605b-43a0-a560-bd0f27777735/download/d_fig3.csv',
    url_type: 'upload',
  },
  {
    cache_last_updated: null,
    cache_url: null,
    created: '2020-08-04T14:41:05.038065',
    description:
      'This file contains the data required to reproduce Figure 3:  \r\n       \r\n- "FOREST_TYPE" states whether a row corresponds to managed forests or to \'latent reserves\' with a given number of years without human intervention (for example, \'LATENT_RESERVE40\' are the \'latent reserves\' with at least 40 years without human intervention)  \r\n- "ELEV_VEG_ZONE" refers to the elevation vegetation zone (colline and submontane, montane or subalpine)  \r\n- "VARIABLE" refers to the indicators described in the figure: Ellenberg indicators for light, temperature and moisture, as well as species richness.   \r\n- "mean" refers to the mean value of each indicator for each combination of forest type and elevation vegetation zone (corrected for the inclusion probability of each tree).  \r\n- "se" corresponds to the standard error.\r\n\r\nFor these calculations, site index was constrained to the range observed in \'latent reserves\' with at least 40 years without intervention. ',
    doi: '',
    format: '.csv',
    hash: '',
    id: '744ed206-605b-43a0-a560-bd0f27777735',
    last_modified: '2020-08-04T14:41:04.883893',
    metadata_modified: null,
    mimetype: 'text/csv',
    mimetype_inner: null,
    name: 'A resource with a very long title, because researchers like to be very accurate and describe things until into the last detail',
    package_id: '702645a2-8965-40df-ae9d-8b81df220bd1',
    position: 1,
    resource_size: '{"size_value": "", "size_units": "kb"}',
    resource_type: null,
    restricted: '{"level": "public", "allowed_users": "", "shared_secret": ""}',
    size: 5508,
    state: 'active',
    url: 'https://www.envidat.ch/dataset/702645a2-8965-40df-ae9d-8b81df220bd1/resource/744ed206-605b-43a0-a560-bd0f27777735/download/d_fig3.csv',
    url_type: 'upload',
  },
];

export default {
  title: '1 Base / Charts / Resource Chart List',
  component: ResourceDataVizList,
};

export const Empty = {
  args: {},
};

export const Basic = {
  args: {
    resources,
  },
};

export const LargeList = {
  args: {
    resources: [...resources, ...resources, ...resources],
  },
};

export const LargeList500Height = {
  args: {
    resources: [...resources, ...resources, ...resources],
    maxHeight: 500,
  },
};
