/**
 * @summary story of Resource DataViz sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-08-25 12:21:22
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import ResourceDataViz from '@/modules/charts/components/ResourceDataViz.vue';
import metadataFile from '@/../stories/js/metadata.js';

const metadatas = metadataFile;
const resource = metadatas[2].resources[2];

const resource2 = {
  cache_last_updated: null,
  cache_url: null,
  created: '2020-12-07T13:16:58.113889',
  description:
    "This csv file contains the data required to reproduce Figure 2 and Figure 4.\r\n\r\n* 'stand_type' states whether a row corresponds to NFI4 average summary statistics describing a generalised beech-dominated, spruce-dominated or an unspecified forest stand in Switzerland in its unimodal or bimodal form (e.g. 'beech.uni' refers to a generalised unimodal beech-dominated stand)\r\n* 'md' refers to the mean diameter\r\n* 'dq10' refers to the 10% quantile of the diameter\r\n* 'dq90' refers to the 90% quantile of the diameter\r\n* 'spr' refers to the spread between minimal and maximal diameter\r\n* 'nph' refers to the number of stems per hectare\r\n* 'o.qmd' refers to the overstorey quadratic mean diameter\r\n* 'rho.emp' refers to proportion parameter (rho) determined by breakpoint setting\r\n* 'ba' refers to the basal area per hectare\r\n* 'drel' refers to the relative diameter ('drel' = (d - min(d)) / (max(d) - min(d)))\r\n* 'temp' refers to the mean winter temperature (1988-2017, Dec-Feb)\r\n* 'dev' refers to the development stage of the stand (e.g. 'Young growth')\r\n* 'ftyp' refers to the potential climax forest type (e.g. 'Beech' refers to a beech-dominated stand)\r\n* 'str' refers to the stand structure\r\n* 'tillering' indicates whether the observed tree species on the NFI plot correspond to 'ftyp' ('TRUE') or not ('FALSE')\r\n* 'prodreg' refers to the Swiss production region (ecoregion)\r\n* 'fowner' refers to the forest ownership ('Public' or ' Private')",
  doi: '',
  format: 'CSV',
  hash: '',
  id: '2e6a5bbe-6836-47b2-86bb-be16ba2fe81e',
  last_modified: '2020-12-07T13:16:57.974110',
  metadata_modified: '2020-12-08T17:43:50.108222',
  mimetype: 'text/csv',
  mimetype_inner: null,
  name: 'Data Figures 2 and 4',
  package_id: 'f8fe4971-0538-4d8e-b866-8d1cfd4b1584',
  position: 0,
  resource_size: '{"size_units": "kb", "size_value": ""}',
  resource_type: null,
  restricted: '{"allowed_users": "", "level": "public", "shared_secret": ""}',
  size: 744,
  state: 'active',
  url: 'https://www.envidat.ch/dataset/f8fe4971-0538-4d8e-b866-8d1cfd4b1584/resource/2e6a5bbe-6836-47b2-86bb-be16ba2fe81e/download/data_figures_2_4.csv',
  url_type: 'upload',
};

const resource3 = {
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
};

export default {
  title: '1 Base / Charts / Resource Chart',
  component: ResourceDataViz,
};

const barColors = [
  '#874540',
  '#954D59',
  '#9C5A74',
  '#9B6A90',
  '#907DA8',
  '#7D92BC',
  '#62A5C7',
  '#45B8C8',
  '#38C9C1',
  '#4DD8B1',
  '#75E59C',
  '#A3EF86',
  '#D5F673',
  //  "#3F1D1E","#512933","#5E374A","#644964","#635D7D","#597392","#4989A2","#369FA9","#31B4A9","#4AC8A0","#72DA92","#A1E981","#D5F673"
  //  "#F0807D","#F3859B","#ED90B8","#DC9ED3","#C2AFE7","#A0C0F3","#7ACFF4","#57DCEC","#49E6DA","#5CEEC1","#81F3A6","#ABF68B","#D6F675"
];
barColors.reverse();

export const Empty = {
  args: {},
};

export const BasicNoTimestamp = {
  args: {
    resource: resource2,
  },
};

export const BasicWithTimestamp = {
  args: {
    resource: resource3,
  },
};

export const HugeData = {
  args: {
    resource,
  },
};

export const NEAD_CSV = {
  args: {
    resource: {
      cache_last_updated: null,
      cache_url: null,
      created: '2020-09-08T11:11:20.007458',
      description: 'Testing Nead with shortend EGrip GC-Net data',
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
      url: './testdata/24-E-GRIP.csv',
      url_type: 'upload',
    },
  },
};
