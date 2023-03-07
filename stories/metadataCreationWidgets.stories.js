/* eslint-disable object-property-newline */
import EditAddPublication from '@/modules/user/components/EditAddPublication.vue';
import relatedPublicCitationTesting from './js/relatedPublicCitation';

/**
 * @summary story of all the MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho and Rebecca Kurup Buchholz
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-09-06 15:11:15
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export default {
  title: '9 Editing Metadata / Add Related Publication Widget',
  decorators: [],
  parameters: {},
};

const mobileViewportParams =  { viewport: { defaultViewport: 'mobile1' } };
const mobileLargeViewportParams = { viewport: {defaultViewport: 'mobile2' } };
const tabletViewportParams = { viewport: { defaultViewport: 'tablet' } };

const keys = Object.keys(relatedPublicCitationTesting);

const pubCitation = relatedPublicCitationTesting[keys[1]];
const pubCitation0 = relatedPublicCitationTesting[keys[0]];

const citation1 = {
  citation: pubCitation0.citation.WSL,
  abstract: pubCitation0.abstract,
  pid: keys[0],
};

const citation2 = {
  citation: pubCitation.citation.WSL,
  abstract: pubCitation.abstract,
  doi: pubCitation.doi,
  doiUrl: `https://www.doi.org/${pubCitation.doi}`,
};

const Template = (args, { argTypes }) => ({
  components: { EditAddPublication },
  props: Object.keys(argTypes),
  template: '<EditAddPublication v-bind="$props" />',
});

export const Empty = Template.bind({});

export const FilledPid = Template.bind({});
FilledPid.args = {
  pid: 'wsl:21835',
}

export const FilledDoi = Template.bind({});
FilledDoi.args = {
  doi: '10.1002/eap.2133',
}

export const FilledDenseDoi = Template.bind({});
FilledDenseDoi.args = {
  ...FilledDoi.args,
  dense: true,
}

export const FilledPidWithPreview = Template.bind({});
FilledPidWithPreview.args = {
  dense: true,
  ...citation1,
}

export const FilledDoiWithPreview = Template.bind({});
FilledDoiWithPreview.args = {
  dense: true,
  ...citation2,
}

export const MobileFilledDoiWithPreview = Template.bind({});
MobileFilledDoiWithPreview.args = { ...FilledDoiWithPreview.args };
MobileFilledDoiWithPreview.parameters = mobileViewportParams;

export const MobileLargeFilledPidWithPreview = Template.bind({});
MobileLargeFilledPidWithPreview.args = { ...FilledPidWithPreview.args };
MobileLargeFilledPidWithPreview.parameters = mobileLargeViewportParams;

export const TabletFilledDoiWithPreview = Template.bind({});
TabletFilledDoiWithPreview.args = { ...FilledDoiWithPreview.args };
TabletFilledDoiWithPreview.parameters = tabletViewportParams;
