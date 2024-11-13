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

import ModeView from '@/components/Layouts/ModeView.vue';
import { EDNA_MODE, SWISSFL_MODE } from '@/store/metadataMutationsConsts';
import { mobileLargeViewportParams, mobileViewportParams, tabletViewportParams } from './js/envidatViewports';

export default {
  title: '5 Navigation / Mode View',
  component: ModeView,
  decorators: [],
  parameters: {},
};

export const Empty = { args: {} };
export const SwissForestLabMode = {
  args: {
    mode: SWISSFL_MODE,
    closeCallback: () => {},
  },
};

export const SwissForestLabModeCompact = {
  args: {
    ...SwissForestLabMode.args,
    compact: true,
  },
};

export const EDNAMode = {
  args: {
    mode: EDNA_MODE,
    closeCallback: () => {},
  },
};

export const EDNAModeCompact = {
  args: {
    ...EDNAMode.args,
    compact: true,
  },
};

export const MobileEDNAMode = {
  args: { ...EDNAModeCompact.args },
  parameters: mobileViewportParams,
};

export const MobileLargeEDNAMode = {
  args: { ...EDNAModeCompact.args },
  parameters: mobileLargeViewportParams,
};

export const TabletEDNAMode = {
  args: { ...EDNAModeCompact.args },
  parameters: tabletViewportParams,
};
