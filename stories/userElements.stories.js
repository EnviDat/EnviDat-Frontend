/* eslint-disable object-curly-newline */
// noinspection JSUnusedGlobalSymbols

/**
 * @summary story of SigninPage sandbox testing
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */

import { ref } from 'vue';
import jazzicon from 'jazzicon-ts';
import seedrandom from 'seedrandom';
import { mdiRefresh } from '@mdi/js';
import { getNameInitials } from '@/factories/authorFactory';

import UserAvatar from '@/components/Layouts/UserAvatar.vue';
import UserCard from '@/components/Cards/UserCard.vue';
import UserMenu from '@/modules/user/components/UserMenu.vue';
import MetadataCube from '@/components/BaseElements/MetadataCube.vue';
import TitleCard from '@/components/Cards/TitleCard.vue';

import { useUserMenuItems } from '@/store/navigationState';
import authorCollection from './testdata/authorCollection.json';

export default {
  title: '7 User / User Elements',
  decorators: [],
  parameters: {},
};

export const TitleCardViews = () => ({
  components: { TitleCard },
  template: `
    <v-row>

      <v-col cols='12'>
        TitleCard empty
      </v-col>

      <v-col cols='12'>
        <TitleCard title='Title only TitleCard' />
      </v-col>

      <v-col cols='12'>
        TitleCard with refresh icon
      </v-col>

      <v-col>
        <TitleCard title='My Datasets'
                   :icon='mdiRefresh'
                   tooltipText='Click here to refresh'
                   :clickCallback='() => {}' />
      </v-col>

      <v-col cols='12'>
        TitleCard loading with refresh icon
      </v-col>

      <v-col>
        <TitleCard title='My Datasets'
                   :icon='mdiRefresh'
                   tooltipText='Click here to refresh'
                   :loading='true'
                   :clickCallback='() => {}' />
      </v-col>


    </v-row>
  `,
  data: () => ({
    mdiRefresh,
  }),
});

export const UserMenuViews = () => ({
  components: { UserMenu },
  template: `
    <v-row >

      <v-col cols="12">
        Click on the avatar
      </v-col>

      <v-col class="flex-grow-0">
        <UserMenu :navItems="userMenuItems" />
      </v-col>

      <v-col class="flex-grow-0">
        <UserMenu :navItems="userMenuItems"
                  :user-object="user" />
      </v-col>

      <v-col class="flex-grow-0">
        <UserMenu :navItems="userMenuItems"
                  :user-object="user2" />
      </v-col>

      <v-col class="flex-grow-0">
        <UserMenu :navItems="userMenuItems"
                  :user-object="user3" />
      </v-col>

    </v-row>
    `,
  data: () => ({
    user: {
      firstName: 'Dominik',
      lastName: 'Haas',
      emailHash: '7e6b6dca84df35a663ba4518360095a8',
    },
    user2: {
      firstName: 'Onio',
      lastName: 'Artho',
    },
    user3: {
      firstName: 'Guybrush',
      lastName: 'Threepwood',
    },
    userMenuItems: useUserMenuItems(),
  }),
});

export const JazzIconsViews = () => ({
  components: {},
  template: `
    <v-row >


      <v-col class="flex-grow-0"
             id="jazzIcon"
             ref="jazzIcon">
      </v-col>

      <v-col class="flex-grow-0"
             id="jazzIcon2"
             ref="jazzIcon2">
      </v-col>

      <v-col class="flex-grow-0"
             id="jazzIcon3"
             ref="jazzIcon3">
      </v-col>

    </v-row>
    `,
  setup() {
    const jazzIcon = ref(null);
    const jazzIcon2 = ref(null);
    const jazzIcon3 = ref(null);

    return {
      jazzIcon,
      jazzIcon2,
      jazzIcon3,
    };
  },
  mounted() {
    this.createIcon(this.jazzIcon);
    this.createIcon(this.jazzIcon2);
    this.createIcon(this.jazzIcon3);
  },
  methods: {
    createIcon(el) {
      if (el) {
        const rng = seedrandom(el.id);
        const randNr = rng.int32();
        const icon = jazzicon(48, randNr);
        el.$el.appendChild(icon);
      }
    },
  },
  data: () => ({
    userMenuItems: useUserMenuItems(),
  }),
});

export const UserAvatarViews = () => ({
  components: { UserAvatar },
  template: `
    <v-container fluid>
    <v-row>

    <v-col>
      <UserAvatar :size="32"/>
    </v-col>

    <v-col>
      <UserAvatar/>
    </v-col>

    <v-col>
      <UserAvatar :size="64"/>
    </v-col>

    <v-col>
      <UserAvatar :size="128"/>
    </v-col>
    </v-row>

    <v-row>
    <v-col>
      <UserAvatar :size="32" nameInitials="DH"/>
    </v-col>

    <v-col>
      <UserAvatar nameInitials="DH"/>
    </v-col>

    <v-col>
      <UserAvatar :size="64" nameInitials="DH"/>
    </v-col>

    <v-col>
      <UserAvatar :size="128" nameInitials="DH"/>
    </v-col>
    </v-row>

    <v-row>
    <v-col>
      <UserAvatar :size="32"
                  nameInitials="DH"
                  emailHash="7e6b6dca84df35a663ba4518360095a8"/>
    </v-col>

    <v-col>
      <UserAvatar
          nameInitials="DH"
          emailHash="7e6b6dca84df35a663ba4518360095a8"/>
    </v-col>

    <v-col>
      <UserAvatar :size="64"
                  nameInitials="DH"
                  emailHash="7e6b6dca84df35a663ba4518360095a8"/>
    </v-col>

    <v-col>
      <UserAvatar :size="128"
                  nameInitials="DH"
                  emailHash="7e6b6dca84df35a663ba4518360095a8"/>
    </v-col>
    </v-row>

    <v-row>
    <v-col>
      <UserAvatar :size="32"
                  defaultGravatar="robohash"
                  emailHash="7e6b6d1213f35a663ba4518360095a8"/>
    </v-col>

    <v-col>
      <UserAvatar defaultGravatar="robohash"
                  emailHash="7e6b6dca2344df35a663ba4518360095a8"/>
    </v-col>

    <v-col>
      <UserAvatar :size="64"
                  defaultGravatar="robohash"
                  emailHash="7e6b6dca84df351234518360095a8"/>
    </v-col>

    <v-col>
      <UserAvatar :size="128"
                  defaultGravatar="robohash"
                  emailHash="4c6104f35821eb25ef16742fc23eb13e"
                  nameInitials="KP"/>
    </v-col>
    </v-row>

    <v-row>
      <v-col>
        <UserAvatar :size="32"
                    nameInitials="DH"
                    emailHash="hashWithOutGravatar"/>
      </v-col>

      <v-col>
        <UserAvatar nameInitials="DH"
                    emailHash="hashWithOutGravatar"/>
      </v-col>

      <v-col>
        <UserAvatar :size="64"
                    nameInitials="DH"
                    emailHash="hashWithOutGravatar"/>
      </v-col>

      <v-col>
        <UserAvatar :size="128"
                    nameInitials="DH"
                    emailHash="hashWithOutGravatar"/>
      </v-col>
    </v-row>

      <v-row>
        <v-col>
          <UserAvatar :size="32"
                      defaultGravatar="robohash"
                      emailHash="7e6b6d1213f35a663ba4518360095a8"/>
        </v-col>

        <v-col>
          <UserAvatar defaultGravatar="robohash"
                      emailHash="7e6b6dca2344df35a663ba4518360095a8"/>
        </v-col>

        <v-col>
          <UserAvatar :size="64"
                      defaultGravatar="robohash"
                      emailHash="7e6b6dca84df351234518360095a8"/>
        </v-col>

        <v-col>
          <UserAvatar :size="128"
                      defaultGravatar="robohash"
                      emailHash="4c6104f35821eb25ef16742fc23eb13e"
                      nameInitials="KP"/>
        </v-col>
      </v-row>

      <v-row class="pt-4">
    <v-col>
      <UserAvatar :size="32"
                  nameInitials="II"
                  emailHash="b4fbef7455319e3124fbb0a1622902f3"/>
    </v-col>

    <v-col>
      <UserAvatar nameInitials="II"
                  emailHash="b4fbef7455319e3124fbb0a1622902f3"/>
    </v-col>

    <v-col>
      <UserAvatar :size="64"
                  nameInitials="II"
                  emailHash="b4fbef7455319e3124fbb0a1622902f3"/>
    </v-col>

    <v-col>
      <UserAvatar :size="128"
                  nameInitials="II"
                  emailHash="b4fbef7455319e3124fbb0a1622902f3"/>
    </v-col>

    </v-row>
    </v-container>
  `,
});

export const UserCardViews = () => ({
  components: { UserCard },
  template: `
    <v-row >

      <v-col v-for="(author, index) in authors()"
              :key="index" >
        <UserCard :userName="author.fullName"
                  :email="index > 0 ? author.email : null"
                  :name-initials="index > 0 ? getNameInitials(author) : null"
                  :emailHash="index === 2 ? '7e6b6dca84df35a663ba4518360095a8' : null"
                  :datasetCount="author.datasetCount"
                  :loading="index === authors().length - 1"
                  />
      </v-col>

      <v-col>
        Info: Emailhash -> the gravatar resolving is hardcoded just for testing
      </v-col>
    </v-row>
    `,
  methods: {
    authors() {
      const items = Object.values(this.authorCollection);
      return items.splice(2, 4);
    },
    getNameInitials,
  },
  data: () => ({
    authorCollection,
  }),
});

export const MetadataCubeViews = () => ({
  components: { MetadataCube },
  template: `
    <v-row>
      <v-col cols="12">
        <MetadataCube  />
      </v-col>

      <v-col cols="12">
        <v-row no-gutters>
          <v-col cols="12">
            <MetadataCube :positionOffset="20" color="green" />
          </v-col>
          <v-col cols="12">
            <MetadataCube :positionOffset="20" color="yellow" />
          </v-col>
          <v-col cols="12">
            <MetadataCube :positionOffset="20" color="red" />
          </v-col>
          <v-col cols="12">
            <MetadataCube :positionOffset="20" color="blue" />
          </v-col>
        </v-row>
      </v-col>

    </v-row>
  `,
  methods: {},
  data: () => ({}),
});
