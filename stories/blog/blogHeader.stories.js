/**
 * @summary story of MetadataCard & MetadataCardPlaceholder for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-11-04 11:39:07
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BlogHeader from '@/modules/blog/components/BlogHeader.vue';

export default {
  title: '16 Blog Page / Blog Elements',
  component: BlogHeader,
};

export const BlogPageHeader = {
  args: {
    title: 'EnviDat Blog',
    titleImage: 'https://envidat.ch/beta/static/blogHeader-D29B8RLt.webp',
    height: 150,
  },
};

export const NormalBlogPostHeader = {
  args: {
    title: 'Why Do You Need A DOI?',
    titleImage: 'https://s3-zh.os.switch.ch/frontend-static/blog/images/john-schnobrich-pointing.jpg',
    height: 100,
    showCloseButton: true,
  },
};

export const LargeBlogPostHeader = {
  args: {
    title: 'Why Do You Need A DOI?',
    titleImage: 'https://s3-zh.os.switch.ch/frontend-static/blog/images/john-schnobrich-pointing.jpg',
    height: 150,
    showCloseButton: true,
  },
};
