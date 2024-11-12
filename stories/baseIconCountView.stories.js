/**
 * @summary story of BaseIconCountView for sandbox testing
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseIconCountView from '@/components/BaseElements/BaseIconCountView.vue';
import { mdiHome } from '@mdi/js';



export default {
  title: '1 Base Elements / Icon Count View',
  component: BaseIconCountView,
};

export const IconCount = {
  args: {
    icon: mdiHome,
    count: 55,
    tooltipText: 'This is the tooltip of the icon count view',
  },
};

