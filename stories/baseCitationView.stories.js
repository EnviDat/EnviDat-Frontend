/**
 * @summary story of BaseIconButton & BaseIconCountView for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2019-10-31 08:14:47
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseCitationView from '@/components/BaseElements/BaseCitationView.vue';
import { createCitation } from '@/factories/metaDataFactory';
import { envidatViewportParameters, mobileLargeViewportParams, mobileViewportParams, tabletViewportParams } from './js/envidatViewports';

import metadata from './js/metadata';
import relatedPublicCitationTesting from './js/relatedPublicCitation';


export default {
  title: '1 Base Elements / Citation View',
  decorators: [],
  parameters: {
    ...envidatViewportParameters,
  },
};


const citation1 = createCitation(metadata[0]);

const keys = Object.keys(relatedPublicCitationTesting);

const pubCitation = relatedPublicCitationTesting[keys[1]];

const citation2 = {
  citation: pubCitation.citation.WSL,
  abstract: pubCitation.abstract,
  doi: pubCitation.doi,
  doiUrl: `https://www.doi.org/${pubCitation.doi}`,
};


/*
const citation2 = createCitation(metadata[2]);
const citation4 = createCitation(citationTesting);
*/

const Template = (args, { argTypes }) => ({
  components: { BaseCitationView },
  props: Object.keys(argTypes),
  template: '<BaseCitationView v-bind="$props" />',
});

export const EmptyCitation = Template.bind({});

export const NormalCitation = Template.bind({});
NormalCitation.args = {
  ...citation2,
};

export const MobileNormalCitation = Template.bind({});
MobileNormalCitation.args = { ...NormalCitation.args };
MobileNormalCitation.parameters = mobileViewportParams;

export const MobileLargeNormalCitation = Template.bind({});
MobileLargeNormalCitation.args = { ...NormalCitation.args };
MobileLargeNormalCitation.parameters = mobileLargeViewportParams;

export const TabletNormalCitation = Template.bind({});
TabletNormalCitation.args = { ...NormalCitation.args };
TabletNormalCitation.parameters = tabletViewportParams;

export const CitationWithoutAbstract = Template.bind({});
CitationWithoutAbstract.args = {
  citation: citation1.citationText,
  doi: citation1.doi,
  doiUrl: citation1.doiUrl,
};
