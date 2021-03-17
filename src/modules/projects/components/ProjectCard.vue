<template>
  <div @mouseover="hovered = true"
       @mouseleave="hovered = false"
       style="cursor: pointer;">

    <!-- Top of Card -->
    <v-card ripple
            :height="headerCardHeight"
            :class="`elevation-${hovered ? 5 : 3}`"
            style="z-index: 1;"
            @click.native="cardClick">

      <v-row style="max-width: 100%; background-color: white; border-radius: 2px;"
             no-gutters
             class="ma-0 fill-height pa-0 no-gutters">
        <v-col class="pa-0" cols="6">
          <v-img class="imagezoom"
                  style="border-radius: 2px 0px 0px 2px;"
                 :contain="headerImg ? headerImg.width > headerImg.height : false"
                 :cover="headerImg ? headerImg.width < headerImg.height : false"
                 :height="headerCardHeight"
                 :src="headerImg ? headerImg.src : ''"
                 :lazy-src="defaultImg"
          />
        </v-col>

        <v-col class="ma-auto px-4" cols="6">
          <div class="title"
               style="word-break: break-word; line-height: 1!important; letter-spacing: .02em !important;"
               :class="dark ? 'white--text' : 'black--text'"
          >
            {{ truncatedTitle }}
          </div>
        </v-col>

      </v-row>
    </v-card>

    <!-- Bottom of Card -->
    <v-card ripple
            height="100%"
            style="z-index: 0; top: -2px;"
            :class="`elevation-${hovered ? 5 : 2}`"
            class="mx-2"
            @click.native="cardClick">

      <v-card-text class="text">
        {{ truncatedDescription }}
      </v-card-text>

      <v-card-text v-if="subProjects" class="py-0 text">
        <strong>Subprojects</strong>
      </v-card-text>

      <v-card-text v-if="subProjects"
                    class="heightScrollProjectCard" >

        <v-row v-for="sub in subProjects"
                :key="sub.id"
                align="center"
                class="pr-2" 
                no-gutters>

          <v-col cols="11" class="py-0 text">{{ sub.title }}</v-col>

          <v-col class="py-0" cols="1">
            <base-icon-button materialIconName="find_in_page"
                              color="transparent"
                              iconColor="secondary"
                              :tooltipText="`Open Subproject ${sub.title}`"
                              tooltipBottom
                              :isSmall="true"
                              @clicked="subprojectClick(sub.id)"/>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>


<script>
/**
 * ProjectCard.vue creates a card with a header image, title, keywords and preview description.
 * When clicked its emits the 'clickedEvent' event, also the clickedTag can be emitted.
 *
 * @summary card with img, title, keywords and preview description
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00
 * Last modified  : 2021-01-05 15:32:35
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { stripMarkdown } from '@/factories/stringFactory';

import BaseIconButton from '@/components/BaseElements/BaseIconButton';

  // checkout skeleton
  // https://github.com/ToxicJojo/SkeletonPlaceholder

export default {
  name: 'ProjectCard',
  components: {
    BaseIconButton,
  },
  props: {
    id: String,
    defaultImg: String,
    img: String,
    title: String,
    subtitle: String,
    description: String,
    subProjects: Array,
    dark: Boolean,
  },
  computed: {
    headerImg() {
      const img = new Image();
      let imgSrc = this.defaultImg;

      if (this.img) {
        imgSrc = this.img;
      }

      img.src = imgSrc;
      img.onload = () => {
        // forced to make the check with for the contain property again
        this.$forceUpdate();
      };

      return img;
    },
    maxTitleLengthReached() {
      return this.title.length > this.maxTitleLength;
    },
    truncatedTitle() {
      const maxLength = this.maxTitleLength;

      if (this.title !== undefined && this.title.length > 0) {
        let modifiedTitle = this.title.trim();
        const splits = this.title.split('(');
        if (splits.length > 0) {
          modifiedTitle = splits[0].trim();
        }
        if (this.maxTitleLengthReached) {
          return `${modifiedTitle.substring(0, maxLength)}...`;
        }
        return modifiedTitle;
      }
      return '';
    },
    truncatedDescription() {
      if (this.description !== undefined && this.description.length > 0) {

        const cleanSubtitle = stripMarkdown(this.description);

        if (cleanSubtitle) {
          return `${cleanSubtitle.substring(0, this.maxDescriptionLength)}...`;
        }
      }

      return `No description found for ${this.truncatedTitle}`;
    },
  },
  methods: {
    cardClick() {
      this.$emit('cardClick', this.id);
    },
    subprojectClick(subprojectId) {
      this.$emit('subprojectClick', subprojectId);
    },
  },
  data: () => ({
    maxDescriptionLength: 290,
    maxTitleLength: 100,
    hovered: false,
    headerCardHeight: 150,
  }),
};
</script>

<style scoped>
  .text {
    line-height: 1.5;
    font-family: Raleway, sans-serif !important;
    letter-spacing: .02em !important;
    font-size: 12px;
    color: rgba(0,0,0,.87) !important;
  }

  .heightScrollProjectCard {
    max-height: 125px;
    overflow-y: auto !important;
    scrollbar-width: thin;
  }  
</style>
