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

import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';

import EditRelatedPublicationsList from '@/modules/user/components/EditRelatedPublicationsList.vue';
import metadata from './js/metadata';
import relatedPublicCitationTesting from './js/relatedPublicCitation';


export default {
  title: '9 Editing Metadata / Related Publication List',
  decorators: [],
  parameters: {
    viewport: {
      viewports: MINIMAL_VIEWPORTS,
    },
  },
};


const relatedPubText = metadata[2].related_publications;


const mobileViewportParams =  { viewport: { defaultViewport: 'mobile1' } };
const mobileLargeViewportParams = { viewport: {defaultViewport: 'mobile2' } };
const tabletViewportParams = { viewport: { defaultViewport: 'tablet' } };

const Template = (args, { argTypes }) => ({
  components: { EditRelatedPublicationsList },
  props: Object.keys(argTypes),
  template: '<EditRelatedPublicationsList v-bind="$props" />',
});

export const EmptyList = Template.bind({});

export const FilledList = Template.bind({});
FilledList.args = {
  relatedPublicationsText: relatedPubText,
};

export const MobileFilledList = Template.bind({});
MobileFilledList.args = { ...FilledList.args };
MobileFilledList.parameters = mobileViewportParams;

/*
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
*/
