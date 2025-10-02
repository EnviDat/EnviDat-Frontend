/**
 * Story of BaseCategoryCard for sandbox testing
 */
import BaseCategoryCard from '@/components/BaseElements/BaseCategoryCard.vue';
import categoryCards from '@/store/categoryCards';
import {
  mobileLargeViewportParams,
  mobileViewportParams,
  tabletViewportParams,
} from '@/../stories/js/envidatViewports';

const noModeCards = categoryCards.filter((card) => !card.isMode);
const modeCards = categoryCards.filter((card) => card.isMode);
const baseInfo = noModeCards[0];

export default {
  title: '1 Base / Cards / Category Cards',
  component: BaseCategoryCard,
};

export const Basic = {
  args: {
    title: baseInfo.title,
    icon: baseInfo.iconPath,
    img: null,
    color: baseInfo.color,
    contain: baseInfo.contain,
    isMode: baseInfo.isMode,
    disabled: baseInfo.disabled,
    elevation: baseInfo.isMode ? 5 : 0,
  },
};

const Template = (args, { argTypes }) => ({
  components: { BaseCategoryCard },
  props: Object.keys(argTypes),
  template: `
    <v-container fluid>
        <v-row justify="center">
        <v-col v-for="card in categoryCards" :key="card.title" cols="auto" class="pa-2">
            <BaseCategoryCard
            height="45"
            elevation="5"
            :title="card.title"
            :img="card.isMode ? card.imgPath : null"
            :icon="!card.isMode ? card.iconPath : null"
            :color="card.color"
            :isMode="card.isMode"
            :contain="card.contain"
            :disabled="card.disabled"
            />
        </v-col>
        </v-row>
    </v-container>
  `,
});

export const CategoryCardCollection = Template.bind({});
CategoryCardCollection.args = { categoryCards };

export const CategoryCardNoModeCollection = Template.bind({});
CategoryCardNoModeCollection.args = { categoryCards: noModeCards };
CategoryCardNoModeCollection.storyName = 'Category Cards (No Mode)';

export const CategoryCardModeCollection = Template.bind({});
CategoryCardModeCollection.args = { categoryCards: modeCards };
CategoryCardModeCollection.storyName = 'Category Cards (Mode Only)';

export const BothModes = () => ({
  components: { BaseCategoryCard },
  data() {
    return { noModeCards, modeCards };
  },
  template: `
    <v-container fluid>
      <v-row justify="center" no-gutters class="mb-6">
        <v-col v-for="card in noModeCards" :key="card.title" cols="auto" class="pa-2">
          <BaseCategoryCard
            height="45"
            elevation="5"
            :title="card.title"
            :icon="card.iconPath"
            :color="card.darkColor"
            :isMode="card.isMode"
            :contain="card.contain"
            :disabled="card.disabled"
          />
        </v-col>
      </v-row>
      <v-row justify="center" no-gutters>
        <v-col v-for="card in modeCards" :key="card.title" cols="auto" class="pa-2">
          <BaseCategoryCard
            height="45"
            elevation="5"
            :title="card.title"
            :img="card.imgPath"
            :icon="card.iconPath"
            :color="card.darkColor"
            :isMode="card.isMode"
            :contain="card.contain"
            :disabled="card.disabled"
          />
        </v-col>
      </v-row>
    </v-container>
  `,
});

export const MobileCategoryCardCollection = Template.bind({});
MobileCategoryCardCollection.args = { ...CategoryCardCollection.args };
MobileCategoryCardCollection.parameters = mobileViewportParams;

export const MobileLargeCategoryCardCollection = Template.bind({});
MobileLargeCategoryCardCollection.args = {
  ...MobileCategoryCardCollection.args,
};
MobileLargeCategoryCardCollection.parameters = mobileLargeViewportParams;

export const TabletCategoryCardCollection = Template.bind({});
TabletCategoryCardCollection.args = { ...MobileCategoryCardCollection.args };
TabletCategoryCardCollection.parameters = tabletViewportParams;
