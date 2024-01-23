// noinspection ES6PreferShortImport

import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';
import { lightColorblind } from '../src/plugins/colorThemes';

addons.setConfig({
  // panelPosition: 'right',
  theme: create({
    base: 'light',
    brandTitle: 'EnviDat Storybook',
    brandUrl: 'https://www.envidat.ch',
    brandTarget: '_self',
    colorPrimary: lightColorblind.primary,
    colorSecondary: lightColorblind.secondary,
  }),
});
