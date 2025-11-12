/**
 * @summary story of the widgets for editing workflow views
 * @author Dominik Haas-Artho and Rebecca Kurup Buchholz
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable object-property-newline */
import EditAddPublication from '@/modules/user/components/EditAddPublication.vue';
import relatedPublicCitationTesting from '@/../stories/js/relatedPublicCitation';
import {
  mobileLargeViewportParams,
  mobileViewportParams,
  tabletViewportParams,
} from '@/../stories/js/envidatViewports';

export default {
  title: '3 Datasets / 2 Edit / Add Related Publication Widget',
};

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
};

export const FilledDoi = Template.bind({});
FilledDoi.args = {
  doi: '10.1002/eap.2133',
};

export const FilledPidWithPreview = Template.bind({});
FilledPidWithPreview.args = {
  ...citation1,
};

export const FilledDoiWithPreview = Template.bind({});
FilledDoiWithPreview.args = {
  ...citation2,
};

export const MobileFilledDoiWithPreview = Template.bind({});
MobileFilledDoiWithPreview.args = { ...FilledDoiWithPreview.args };
MobileFilledDoiWithPreview.parameters = mobileViewportParams;

export const MobileLargeFilledPidWithPreview = Template.bind({});
MobileLargeFilledPidWithPreview.args = { ...FilledPidWithPreview.args };
MobileLargeFilledPidWithPreview.parameters = mobileLargeViewportParams;

export const TabletFilledDoiWithPreview = Template.bind({});
TabletFilledDoiWithPreview.args = { ...FilledDoiWithPreview.args };
TabletFilledDoiWithPreview.parameters = tabletViewportParams;
