import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';
import { lightColorblind } from '../src/plugins/colorThemes';


addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'EnviDat Storybook',
    brandUrl: 'https://www.envidat.ch',
    brandTarget: '_self',
    colorPrimary: lightColorblind.primary,
    colorSecondary: lightColorblind.secondary,
  }),
});
