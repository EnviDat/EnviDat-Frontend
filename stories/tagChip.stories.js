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
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import TagChip from '@/components/Cards/TagChip.vue';
import TagChipPlaceholder from '@/components/Cards/TagChipPlaceholder.vue';

export const methods = {
  onClick: action('clicked'),
};

storiesOf('4 Filtering / Keyword Tag', module)
  .add('Tag states', () => ({
    components: { TagChip, TagChipPlaceholder },
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

    </v-row>`,
    methods,
  }));
