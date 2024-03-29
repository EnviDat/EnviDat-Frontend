// import defaults from '@storybook/addon-viewport/dist/modern/defaults';
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';

const smallMobile = 'mobile1';
let sWidth = MINIMAL_VIEWPORTS[smallMobile].styles.width;
sWidth = Number.parseInt(sWidth.substring(0, sWidth.length - 2), 10);

const largeMobile = 'mobile2';
let lWidth = MINIMAL_VIEWPORTS[largeMobile].styles.width;
lWidth = Number.parseInt(lWidth.substring(0, lWidth.length - 2), 10);

const tablet = 'tablet';
let tWidth = MINIMAL_VIEWPORTS[tablet].styles.width;
tWidth = Number.parseInt(tWidth.substring(0, tWidth.length - 2), 10);

export const mobileViewportParams = {
  viewport: { defaultViewport: smallMobile },
  chromatic: { viewports: [ sWidth ] },
};
export const mobileLargeViewportParams = {
  viewport: { defaultViewport: largeMobile },
  chromatic: { viewports: [ lWidth ] },
};
export const tabletViewportParams = {
  viewport: { defaultViewport: tablet },
  chromatic: { viewports: [ tWidth ] },
};

export const envidatViewportParameters = {
  viewport: {
    viewports: MINIMAL_VIEWPORTS,
  },
};
