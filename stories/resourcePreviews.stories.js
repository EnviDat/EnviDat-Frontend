/* eslint-disable no-tabs */
/* eslint-disable no-use-before-define */
/**
 * @summary story of BaseIconLabelView for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-10-27 16:00:17
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import TextPreviewCard from '@/modules/metadata/components/ResourcePreviews/TextPreviewCard.vue';
import { mobileLargeViewportParams, mobileViewportParams, tabletViewportParams } from './js/envidatViewports';


// const readme1 = './testdata/bender2020_readme.txt';
// const readme2 = './testdata/10-16904-envidat-30_readme.txt';

export default {
  title: '1 Base / Cards /  Resource Previews',
};


const Template = (args, { argTypes }) => ({
  components: { TextPreviewCard },
  props: Object.keys(argTypes),
  template: '<TextPreviewCard v-bind="$props" />',
});

export const Empty = Template.bind({});

export const WithUrl = Template.bind({});
WithUrl.args = {
  url: 'https://os.zhdk.cloud.switch.ch/envicloud/wsl/ros_data/readme.txt',
}

export const WithInvalidUrl = Template.bind({});
WithInvalidUrl.args = {
  url: 'https://os.zhdk.cloud.switch.ch/envicloud/wsl/ros_data/fasdfasdfasdfas.txt',
}

export const WithMarkdownUrl = Template.bind({});
WithMarkdownUrl.args = {
  url: 'http://s3-zh.os.switch.ch/frontend-static/blog/EnviDat_WSLIntern_2020q1.md',
}

/*
export const WithRelativeUrl = Template.bind({});
WithRelativeUrl.args = {
  url: './testdata/largeText.txt',
}
*/

export const MobileWithMarkdownUrl = Template.bind({});
MobileWithMarkdownUrl.args = { ...WithMarkdownUrl.args };
MobileWithMarkdownUrl.parameters = mobileViewportParams;

export const MobileLargeWithMarkdownUrl = Template.bind({});
MobileLargeWithMarkdownUrl.args = { ...WithMarkdownUrl.args };
MobileLargeWithMarkdownUrl.parameters = mobileLargeViewportParams;

export const TabletWithMarkdownUrl = Template.bind({});
TabletWithMarkdownUrl.args = { ...WithMarkdownUrl.args };
TabletWithMarkdownUrl.parameters = tabletViewportParams;
