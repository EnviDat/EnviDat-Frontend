/**
 * @summary story of TagChip & TagChipPlaceholder for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-07-15 11:09:29
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */

import TagChip from '@/components/Chips/TagChip.vue';
import TagChipPlaceholder from '@/components/Chips/TagChipPlaceholder.vue';
import TagChipAuthor from '@/components/Chips/TagChipAuthor.vue';
import TagChipProject from '@/components/Chips/TagChipProject.vue';

export default {
  title: '10 Chips / keyword chips',
  decorators: [],
};

export const TagChips = () => ({
  components: { TagChip, TagChipPlaceholder, TagChipAuthor, TagChipProject },
  template: `
    <v-row >

      <v-col>
        <tag-chip-placeholder />
      </v-col>

      <v-col>
        <tag-chip name="SNOW" />
      </v-col>

      <v-col>
        <tag-chip name="some very long tag name" />
      </v-col>

      <v-col>
        <tag-chip name="CLOSEABLE" closeable />
      </v-col>

      <v-col>
        <tag-chip name="closeable & selectable" closeable selectable />
      </v-col>

      <v-col>
        <tag-chip name="highlighted" closeable selectable highlighted />
      </v-col>

      <v-col>
        <tag-chip name="count='5'" selectable :count="5" />
      </v-col>

      <v-col>
        <tag-chip-author name="Dominik Haas-Artho"  />
      </v-col>

      <v-col>
        <tag-chip-author name="Autor tag closeable"
                         :is-closeable="true"/>
      </v-col>

      <v-col>
        <tag-chip-author name="draggable"
                         :draggable="true"/>
      </v-col>

      <v-col>
        <tag-chip-project :fontSize="'14px'"
              :iconSize="'14px'"
              :iconName="'category'" name="Project 1"  />
      </v-col>

      <v-col>
        <tag-chip-project :fontSize="'14px'"
              :iconSize="'14px'"
              :closeable="true"
              :iconName="'category'" name="Project 1 closeable"
                         :is-closeable="true"/>
      </v-col>


    </v-row>`,
});
