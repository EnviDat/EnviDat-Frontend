<template>
  <v-card
    id="BaseUserPicker"
    :class="showAsCard ? 'pa-4' : 'pa-0'"
    :flat="!showAsCard"
  >
    <v-row v-if="instructions" no-gutters>
      <v-col class="text-body-1 pa-0 pb-4">
        {{ instructions }}
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col class="pt-2 tagAuthorFix">
        <v-autocomplete
          v-model="pickedUsersEmail"
          :items="users"
          item-title="fullName"
          item-value="email"
          :menu-icon="mdiArrowDownDropCircleOutline"
          :readonly="readonly"
          :hint="hint"
          :persistent-hint="!!hint"
          :prepend-icon="prependIcon"
          :label="pickerLabel"
          :multiple="multiplePick"
          :clearable="isClearable"
          :clear-on-select="true"
          :search="search"
          :error-messages="errorMessages"
          :menu-props="menuOptions"
          :clear-icon="mdiClose"
          v-bind="$props"
          @blur="$emit('blur', $event)"
        >

          <template v-slot:selection="{ item }">
            <TagChipAuthor
                v-if="item.title"
                :name="item.title"
                :class="userTagsCloseable && !readonly ? 'pl-0' : 'px-0'"
                :closable="userTagsCloseable && !readonly"
                @closeClicked="catchCloseClicked(item.value)"
            />
          </template>

          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props"
                         @click="catchPickClicked(item.value)" >
            </v-list-item>
          </template>

          <template v-slot:no-data>
            <v-list-item>
              <div v-html="autocompleteHint"></div>
            </v-list-item>
          </template>
        </v-autocomplete>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
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
import {mdiAccountBox, mdiArrowDownDropCircleOutline, mdiClose} from '@mdi/js';
// import { PropType } from 'vue';
import TagChipAuthor from '@/components/Chips/TagChipAuthor.vue';
import type { UserPickerObject } from '@/types/modelTypes';

export default {
  // name: 'BaseUserPicker',
  props: {
    users: {
      type: Array, // as PropType<UserPickerObject>[],
      default: undefined,
    },
    preSelected: {
      type: Array, // as PropType<string>[],
      default: undefined,
    },
    multiplePick: Boolean,
    placeholder: {type: String, default: undefined},
    pickerLabel: {
      type: String,
      default: 'Click here to pick an EnviDat author',
    },
    isClearable: {
      type: Boolean,
      default: false,
    },
    showAsCard: Boolean,
    instructions: String,
    prependIcon: {
      type: String,
      default: mdiAccountBox,
    },
    userTagsCloseable: {
      type: Boolean,
      default: true,
    },
    errorMessages: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    hint: {
      type: String,
      default: '',
    },
  },
  emits: ['pickedUsers', 'removedUsers'],
  mounted() {
    this.updatePreselection();
  },
  watch: {
    preSelectedEmails() {
      this.updatePreselection();
    },
  },
  computed: {
    autocompleteHint() {
      if(this.placeholder){
        return this.placeholder;
      }
      if (!this.search) {
        return 'Start typing for autocompletion.';
      }

      return `No name matching "<strong>${this.search}</strong>".`;
    },
    menuOptions() {
      return {
        transition: 'fade-transition',
      }
    },
  },
  methods: {
    updatePreselection() {
      if (this.preSelectedEmails?.length > 0) {
        const filteredEmails = this.users.filter((userObj : UserPickerObject) => this.preSelectedEmails.includes(userObj.email));
        this.pickedUsersEmail = this.multiplePick ? filteredEmails.map((userObj : UserPickerObject) => userObj.email) : filteredEmails[0].email;
      } else {
        this.pickedUsersEmail = this.multiplePick ? [] : undefined;
      }
    },
    catchCloseClicked(pickedEmail: string) {
      if (this.readonly) {
        return;
      }

      if (this.multiplePick) {
        const remains = this.pickedUsersEmail.filter((email : string) => email !== pickedEmail);

        if (remains?.length > 0) {
          this.pickedUsersEmail = remains;
        } else {
          this.pickedUsersEmail = [];
        }
      } else {
        this.pickedUsersEmail = undefined;
      }

      this.$emit('removedUsers', this.pickedUsersEmail as string | string[]);
    },
    catchPickClicked(pickedEmail: string) {
      if (this.multiplePick) {
        if (!this.pickedUsersEmail.includes(pickedEmail)) {
          this.pickedUsersEmail.push(pickedEmail);
        }
      } else {
        this.pickedUsersEmail = pickedEmail;
      }

      this.$emit('pickedUsers', this.pickedUsersEmail as string | string[]);
    },
  },
  data: () => ({
    pickedUsersEmail: undefined,
    search: '',
    mdiArrowDownDropCircleOutline,
    mdiClose,
  }),
  components: {
    TagChipAuthor,
  },
};
</script>

<style>
.tagAuthorFix .v-chip__content {
  /*
  a fix for now because there is a overlay coming in the way of the author icon
  but the chips are getting wider which isn't good
  */
  padding: 0 11px !important;
}

</style>
