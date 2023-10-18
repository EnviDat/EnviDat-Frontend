/**
 * @summary story of BaseIcon for sandbox testing
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseIcon from '@/components/BaseElements/BaseIcon.vue';
import globalMethods from '@/factories/globalMethods';
import tagIcon from '@/assets/icons/tag.png';
import tagsIcon from '@/assets/icons/tags.png';


export default {
  title: '1 Base Elements / Icon Font & Custom',
  component: BaseIcon,
};


export const EditFontIcon = {
  args: {
    materialIcon: 'edit',
  },
}

export const EditBlackFontIcon = {
  args: {
    ...EditFontIcon.args,
    iconColor: 'black',
  },
}

export const ErrorFontIcon = {
  args: {
    materialIcon: 'person',
    iconColor: 'error',
  },
}

export const CustomPinIcon = {
  args: {
    iconColor: 'green',
    customIcon: tagIcon,
  },
}

export const CustomMultiPinIcon = {
  args: {
    iconColor: 'secondary',
    customIcon: tagsIcon,
  },
}
