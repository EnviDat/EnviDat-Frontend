/**
 * @summary story of ExpandableCard for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-11-17 15:40:53
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import ExpandableCard from '@/modules/about/components/ExpandableCard';
import teamSmall from '@/assets/about/team_small.jpg';
import mission from '@/assets/projects/mission.jpg';
import missionSmall from '@/assets/projects/mission_small.jpg';
import handsSmall from '@/assets/about/hands_small.jpg';
import orga from '@/assets/about/EnviDat_organigram.png';
import conceptSmall from '@/assets/about/concept_small.jpg';
import communitySmall from '@/assets/about/community_small.jpg';

export const computed = {
  missionImg() {
    return this.$vuetify.breakpoint.mdAndUp ? mission : missionSmall;
  },
  aboutCardInfo() {
    return [
      {
        title: 'Our Mission',
        text: 'EnviDat is the environmental data portal and repository developed by the Swiss Federal Research Institute WSL. We have the capability to integrate, host and publish data sets. We make environmental monitoring and research data accessible. <p><a href="https://www.wsl.ch/en/about-wsl/programmes-and-initiatives/envidat.html" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" >More about EnviDat as Program of WSL</a></p>',
        img: this.handsSmall,
        widthClass: 'xs12 sm6 md4',
      },
      {
        title: 'Concept',
        text: 'EnviDat supports the user-friendly registration, documentation, storage, publication, search and retrieval of data sets from the environmental domain. We provide various services to our users and we follow a set of principles as summarized in our concept image below. Additional detailed information can be found in our <a href="https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:18703" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" >concept paper on DORA</a>.',
        img: this.conceptSmall,
        widthClass: 'xs12 sm6 md4',
      },
      {
        title: 'Community',
        text: 'With EnviDat, WSL aims to disseminate its data sets as broadly as possible in order to foster international research cooperation in the field of environmental science and contribute to the ongoing cultural evolution in research towards openness, shared data and opportunities for collaboration. Consequently, we are registered in <a href="https://fairsharing.org/biodbcore-001178/" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" >FAIRsharing.org</a> and <a href="https://www.re3data.org/repository/r3d100012587" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" >re3data.org</a> and a contributor community to <a href="http://geoportal.org/community/envidat-community" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" >ESA Geoportal </a>, <a href="https://gcmd.nasa.gov/search/Titles.do?AutoDisplayTitles=true&subset=envidat#titles" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" >NASA GCMD</a> and <a href="http://b2find.eudat.eu/dataset?groups=envidat" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" >EOSC-Hub via B2FIND</a>. ',
        img: this.communitySmall,
        widthClass: 'xs12 sm6 md4',
      },
      {
        title: 'WSL',
        text: 'The Swiss Federal Institute for Forest, Snow and Landscape Research is concerned with the use, development and protection of natural and urban spaces. The focus of our research is on solving problems to do with the responsible use of landscapes and forests and a prudent approach to natural hazards, especially those common in mountainous countries. WSL occupies a leading position internationally in these research areas. We also provide groundwork for sustainable environmental policies in Switzerland. <p><a href="https://www.wsl.ch" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" >For more information have a look at the Website of WSL</a></p>',
        img: this.wslLogoSmall,
        widthClass: 'xs12 sm6 md4',
      },
      {
        title: 'Team',
        /* eslint-disable prefer-template */
        text: '<img src="' + this.orga + '" style="width: 100%; height: 100%;" />',
        img: this.teamSmall,
        widthClass: 'xs12 sm12 md8',
      },
    ];
  },
};

storiesOf('3 Cards / Expandable Cards', module)
  .add('Expandable card Collection', () => ({
    components: { ExpandableCard },
    template: `
    <v-row >
      <v-col>
        <v-row>

          <v-col cols="3"
                class="pa-2"
            v-for="(card, index) in aboutCardInfo"
            :key="index"
          >
            <expandable-card :title="card.title"
                              :text="card.text"
                              :img="card.img"
                              :min-height="100"
                              :max-height="150"
                              :contain="card.title === 'WSL'" />
          </v-col>

        </v-row>
      </v-col>
    </v-row>
    `,
    computed,
    data: () => ({
      teamSmall,
      mission,
      missionSmall,
      handsSmall,
      orga,
      conceptSmall,
      communitySmall,
    }),
  }));
