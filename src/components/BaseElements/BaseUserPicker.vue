<template>
  <v-card id="BaseUserPicker"
            :class="showAsCard ? 'pa-4' : 'pa-0'"
            :flat="!showAsCard" >

    <v-row v-if="instructions"
           no-gutters>
      <v-col class="text-body-1 pa-0 pb-4" >
        {{ instructions }}
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <v-autocomplete v-model="pickedUsers"
                        :items="users"
                        outlined
                        append-icon="arrow_drop_down"
                        :label="pickerLabel"
                        :multiple="multiplePick"
                        :clearable="isClearable"
                        :search-input.sync="search"
                        :prepend-icon="prependIcon"
                        item-text="fullName"
                        color="primary"
                        clear-icon="close"
                        @change="catchPicks"
                        >

          <template v-slot:selection="{ item }">
            <TagChipAuthor v-if="item"
                           :name="item.fullName"
                           :isSmall="false"
                           :isCloseable="authorsCloseable"
                           @closeClicked="catchCloseClicked"/>
          </template>

          <template v-slot:item="{ item }">
            <TagChipAuthor v-if="item && item.fullName"
                           :name="item.fullName"
                           :isSmall="false" />
          </template>

          <template v-slot:no-data>
            <v-list-item>
              No results matching "<strong>{{ search }}</strong>".
            </v-list-item>
          </template>

        </v-autocomplete>

      </v-col>
    </v-row>

  </v-card>

</template>

<script>
/**
 * @summary UserPicker component
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-06-28 15:55:22
 * Last modified  : 2021-08-18 13:23:01
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import TagChipAuthor from '@/modules/metadata/components/TagChipAuthor';

export default {
  name: 'BaseUserPicker',
  props: {
    users: Array,
    preSelected: Array,
    multiplePick: Boolean,
    isClearable: {
      type: Boolean,
      default: false,
    },
    showAsCard: Boolean,
    instructions: String,
    prependIcon: {
      type: String,
      default: 'account_box',
    },
    authorsCloseable: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    if (this.preSelected?.length > 0) {

      if (this.multiplePick) {
        this.preSelected.forEach((author) => {
          // if (typeof author === 'object') {
            this.pickedUsers.push(author.fullName);
          // } else {
          //   this.pickedUsers.push(author);
          // }
        });
      } else {
        this.pickedUsers = this.preSelected[0].fullName;
      }
    } else {
      this.pickedUsers = this.multiplePick ? [] : null;
    }
  },
  computed: {
  },
  methods: {
    catchCloseClicked(authorName) {
      if (this.multiplePick) {

        const remains = this.pickedUsers.filter(value => value !== authorName);

        if (remains?.length > 0) {
          this.pickedUsers = remains;
        } else {
          this.pickedUsers = [];
        }
      } else {
        this.pickedUsers = null;
      }

      this.$emit('removedUsers', this.pickedUsers);
    },
    catchPicks(picks) {
      this.$emit('pickedUsers', picks);
    },
  },
  data: () => ({
    pickerLabel: 'Click here to pick a EnviDat User',
    pickedUsers: [],
    search: '',
  }),
  components: {
    TagChipAuthor,
  },
};
</script>

<style scoped>

</style>
