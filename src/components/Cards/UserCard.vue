<template>
  <v-card id="UserCard"
          :width="width"
          :height="height"
          :loading="loadingColor">

    <div class="cardGrid fill-height"
          :style="`grid-template-rows: ${headerHeight}px 70px auto`">

      <div :style="`height: ${headerHeight}px; overflow: hidden;`">
        <v-img :height="headerHeight"
                :width="width"
                style="border-top-left-radius: 4px; border-top-right-radius: 4px;"
               :src="userCardBanner" />

<!--        :src="`https://gravatar.com/avatar/${email}?s=${gravatarImageSize}&d=identicon&r=g`"
        -->
      </div>

      <div class="text-h6 black--text mx-auto pt-10">
        {{ userName }}
      </div>

      <div class="pa-4" >
        <v-container fluid
                      class="pa-0">
          <v-row no-gutters
                 class="py-2"
                 justify="start">
            <v-col class="text-body-2">Datasets</v-col>
            <v-col class="text-caption">{{ datasetCount }}</v-col>
          </v-row>

          <v-row no-gutters
                 class="py-2"
                 justify="start">
            <v-col class="text-body-2">Email</v-col>
            <v-col class="text-caption"><a :href="`mailto:${email}`">{{ email }}</a></v-col>
          </v-row>
        </v-container>

      </div>

    </div>

    <div style="position: absolute; right: 39.5%; border-radius: 50%;"
          :style="`top: ${avatarTopPosition}px;`" >
      <UserAvatar :size="avatarHeight"
                  :nameInitials="nameInitials"
                  :emailHash="emailHash"
                  class="elevation-5" />
    </div>

  </v-card>
</template>

<script>
/**
 * UserCard.vue
 *
 * @summary users card
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2020-10-08 17:44:00
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import UserAvatar from '@/components/Layouts/UserAvatar.vue';


export default {
  name: 'UserCard',
  components: {
    UserAvatar,
  },
  props: {
    width: {
      type: Number,
      default: undefined,
    },
    height: {
      type: Number,
      default: 300,
    },
    userName: String,
    email: String,
    emailHash: String,
    nameInitials: String,
    datasetCount: Number,
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    avatarHeight: 64,
  }),
  computed: {
    loadingColor() {
      if (this.loading) {
        return 'accent';
      }

      return undefined;
    },
    userCardBanner() {
      if (this.$store) {
        const imgPath = 'projects/data_creator';
        return this.mixinMethods_getWebpImage(imgPath, this.$store.state);
      }

      return '';
    },
    headerHeight() {
      return this.height >= 350 ? this.height * 0.2 : this.height * 0.4;
    },
    avatarTopPosition() {
      return this.headerHeight - this.avatarHeight * 0.5;
    },
    gravatarImageSize() {
      return this.headerHeight > this.width ? this.headerHeight : this.width;
    },
  },
};
</script>

<style scoped>

  .cardGrid {
    display: grid;
    justify-content: center;
    grid-template-columns: 100%;
  }

  .subGrid {
    display: grid;
    grid-template-columns: 30% 70%;
    column-gap: 16px;
    padding-right: 16px;
    padding-left: 16px;
  }

  .subGrid div {
    word-break: break-all;
    align-content: end;
  }

</style>
