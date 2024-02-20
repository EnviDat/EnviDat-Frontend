/* eslint-disable import/no-extraneous-dependencies */
import SloganCard from '@/modules/home/components/SloganCard.vue';

import { action } from '@storybook/addon-actions';
import holidaysWinter from '../src/assets/cards/slogan/holidays_winter.webp';


export default {
  title: '3 Cards / Slogan Card',
  component: SloganCard ,
};

export const Default = {
  args: {
    slogan: 'Random Slogan',
    buttonText: 'Fun button',
    buttonCallback: () => {
      action('button click');
    },
  },
}

export const WithSubSlogan = {
  args: {
    ...Default.args,
    subSlogan: 'Subslogan normally longer than the slogan',
  },
}

export const WithImage = {
  args: {
    ...WithSubSlogan.args,
    sloganImg: holidaysWinter,
  },
}

export const WithMoreButton = {
  args: {
    ...Default.args,
    moreButtonText: 'Fun button',
    moreButtonCallback: () => {
      action('more button clicked');
    },
  },
}

