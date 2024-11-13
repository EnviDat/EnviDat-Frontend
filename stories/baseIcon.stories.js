/**
 * @summary story of BaseIcon for sandbox testing
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseIcon from '@/components/BaseElements/BaseIcon.vue';
import { mdiAccount, mdiPencil } from '@mdi/js';

export default {
  title: '1 Base / Icons / Icon Font & Custom',
  component: BaseIcon,
};

export const EditFontIcon = {
  args: {
    icon: mdiPencil,
  },
}

export const EditBlackFontIcon = {
  args: {
    ...EditFontIcon.args,
    color: 'black',
  },
}

export const CustomColorFontIcon = {
  args: {
    ...EditFontIcon.args,
    color: '#FFAA00',
  },
}

export const ErrorFontIcon = {
  args: {
    icon: mdiAccount,
    color: 'error',
  },
}

export const CustomPinIcon = {
  args: {
    color: '#00AAFF',
    icon: 'tag',
  },
}

export const CustomMultiPinIcon = {
  args: {
    color: 'secondary',
    icon: 'tags',
  },
}
