<template>
  <v-card id="UserCard"
          raised
          :width="width"
          :height="height">

    <div class="cardGrid fill-height"
          :style="`grid-template-rows: ${headerHeight}px 70px auto`">

      <div :style="`height: ${headerHeight}px; overflow: hidden;`">
        <v-img :height="headerHeight"
                :width="width"
                style="border-top-left-radius: 4px; border-top-right-radius: 4px;"
                :src="`https://gravatar.com/avatar/${email}?s=${gravatarImageSize}&d=identicon&r=g`" />
      </div>

      <div class="title black--text mx-auto pt-8">
        {{ userName }}
      </div>

      <div class="subGrid pb-4" >
        <div class="body-2">Datasets</div>
        <div class="caption" >{{ datasetCount }}</div>

        <div class="body-2">Email</div>
        <div class="caption">{{ email }}</div>
      </div>

    </div>

    <div style="position: absolute; right: 39.5%; border-radius: 50%;"
          :style="`top: ${avatarTopPosition}px;`" >
      <UserAvatar :size="avatarHeight"
                  :emailHash="emailHash"
                  :nameInitials="nameInitials"
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
import UserAvatar from '@/components/Layouts/UserAvatar';

export default {
  name: 'UserCard',
  components: {
    UserAvatar,
  },
  props: {
    width: {
      type: Number,
      default: 250,
    },
    height: {
      type: Number,
      default: 350,
    },
    userName: String,
    email: String,
    emailHash: String,
    nameInitials: String,
    datasetCount: Number,
  },
  data: () => ({
    avatarHeight: 64,
  }),
  computed: {
    headerHeight() {
      return this.height >= 350 ? this.height * 0.6 : this.height * 0.4;
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
