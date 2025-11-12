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

import BlogPostCard from '@/modules/blog/components/BlogPostCard.vue';
import { getImage } from '@/factories/imageFactory';

export default {
  title: '16 Blog Page / Blog Elements',
  component: BlogPostCard,
};

export const PostCardLoadingImage = {
  args: {
    postTitle: 'Why Do I Need a DOI?',
    postDate: '11.12.2023',
    loadingImg: getImage('contact'),
    height: '200',
  },
};

export const PostCard = {
  args: {
    postTitle: 'Why Do I Need a DOI?',
    postDate: '11.12.2023',
    titleImg: 'https://s3-zh.os.switch.ch/frontend-static/blog/images/john-schnobrich-pointing.jpg',
    loadingImg: getImage('contact'),
    height: '200',
  },
};
