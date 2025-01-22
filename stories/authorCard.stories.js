import { mdiBookOpenVariantOutline, mdiLibraryOutline, mdiCodeTags, mdiWidgetsOutline, mdiAccountVoice, mdiAccountSupervisorOutline } from '@mdi/js';

import AuthorCard from '@/modules/metadata/components/AuthorCard.vue';

import {
  createAuthors,
  extractAuthorsMap,
  getFullAuthorsFromDataset,
} from '@/factories/authorFactory';
import { AUTHOR_ASCII_DEAD } from '@/store/mainMutationsConsts';
import {
  mobileLargeViewportParams,
  mobileViewportParams,
  tabletViewportParams,
} from './js/envidatViewports';

import unFormatedMetadataCards from './js/metadata';

const metadataCards = [];

unFormatedMetadataCards.forEach(el => {
  el.author = createAuthors(el);
  metadataCards.push(el);
});

const authorsMap = extractAuthorsMap(metadataCards);

const authorFromCollection = getFullAuthorsFromDataset(
  authorsMap,
  metadataCards[0],
)[1];


export default {
  title: '1 Base / Cards / Author Cards',
  component: AuthorCard,
};


export const Default = {
  args: { author: authorFromCollection },
};

const authorLoadsOfDatacredit = {
  firstName: 'Felix',
  lastName: 'Gugerli',
  fullName: 'Felix Gugerli',
  datasetCount: 7,
  affiliation: 'WSL',
  id: {
    identifier: '0000-0003-3878-1845',
  },
  email: 'felix.gugerli@wsl.ch',
  totalDataCredits: {
    collection: 10,
    validation: 3,
    curation: 12,
    software: 10,
    publication: 15,
    supervision: 1,
  },
};

const authorWhichIsDead = createAuthors(metadataCards[0])[0];

export const DeadAuthor = {
  args: {
    author: authorWhichIsDead,
  },
}

export const AuthorManyDataCredit = {
  args: { author: authorLoadsOfDatacredit },
}

export const AuthorCardInfosExpanded = {
  args: {
    ...AuthorManyDataCredit.args,
    overrideAuthorInfosExpanded: true,
  },
}

export const AuthorCardOverallHide = {
  args: {
    ...AuthorManyDataCredit.args,
    overrideAuthorInfosExpanded: true,
    hideDataCredit: true,
  },
}

export const MobileAuthorCard = {
  args: AuthorCardInfosExpanded.args,
  parameters: mobileViewportParams,
}

export const MobileLargeAuthorCard = {
  args: AuthorCardInfosExpanded.args,
  parameters: mobileLargeViewportParams,
}

export const TabletAuthorCard = {
  args: AuthorCardInfosExpanded.args,
  parameters: tabletViewportParams,
}


export const BackgroundTest = () => ({
  data: ()=>({
    mdiBookOpenVariantOutline, 
    mdiLibraryOutline, 
    mdiCodeTags, 
    mdiWidgetsOutline, 
    mdiAccountVoice, 
    mdiAccountSupervisorOutline,
  }),
  components: {
  },

  template: `
    <v-row>

      <v-col cols="12" md="4" pt-5 >
        <div>
          <v-icon :icon="mdiBookOpenVariantOutline" />
          <v-icon :icon="mdiLibraryOutline" />
          <v-icon :icon="mdiCodeTags" />
          <v-icon :icon="mdiWidgetsOutline" />
          <v-icon :icon="mdiAccountVoice" />
          <v-icon :icon="mdiAccountSupervisorOutline" />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; width: 300px; height: 300px; background-color: whitesmoke; overflow: hidden;">
          <div v-for="(index) in 10"
               :key="index">
            <v-icon :icon="mdiWidgetsOutline" />
          </div>
        </div>     
        
      </v-col>

    </v-row>
  `,
  computed: {},
  methods: {
    getStyle(index, maxWidth, maxHeight, start = 0) {
      const size = 30;
      let pos = index * size + start;
      if (pos > maxWidth) {
        pos -= maxWidth;
      }
      let tPos = index * size + start;
      if (tPos > maxHeight) {
        tPos -= maxHeight;
      }

      // return `position: relative; opacity: 0.25; top: ${tPos}px; left: ${pos}px; width: ${size}px; height: ${size}px;`;
      return `transform: translate(${pos}px, ${tPos}px); opacity: 0.25; width: ${size}px; height: ${size}px;`;
    },
  },
});
