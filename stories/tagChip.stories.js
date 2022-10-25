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
import MetadataStateChip from '@/components/Chips/MetadataStateChip.vue';

import MetadataOrganizationChip from '@/components/Chips/MetadataOrganizationChip.vue';
import { CHIPS } from './storybookFolder';

const menuEntry = `${CHIPS} / single chips`; // / Keyword Tag`;

export default {
    title: menuEntry,
    decorators: [],
    parameters: {},
};

export const TagChips = () => ({
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
  });

export const MetadataStateChips = () => ({
    components: { MetadataStateChip },
    template: `
    <v-row >

      <v-col>
        empty (fallback)
        <MetadataStateChip />
      </v-col>

      <v-col>
        <MetadataStateChip state="draft" />
      </v-col>

      <v-col>
        showOnHover
        <MetadataStateChip state="draft"
                           showOnHover />
      </v-col>

      <v-col>
        <MetadataStateChip state="unpublished" />
      </v-col>

      <v-col>
        showOnHover
        <MetadataStateChip state="unpublished"
                           showOnHover />
      </v-col>

      <v-col>
        <MetadataStateChip state="published" />
      </v-col>

      <v-col>
        showOnHover
        <MetadataStateChip state="published"
                           showOnHover />
      </v-col>

    </v-row>`,
});

export const MetadataOrganizationChips = () => ({
    components: { MetadataOrganizationChip },
    template: `
    <v-row >

      <v-col>
        empty (fallback)
        <MetadataOrganizationChip />
      </v-col>

      <v-col>
        <MetadataOrganizationChip
            organization="ground-based-remote-sensing"
            tooltip="Ground-based Remote Sensing"
        />
      </v-col>

      <v-col>
        showOnHover
        <MetadataOrganizationChip
            showOnHover
            organization="trusted"
            tooltip="Trusted Users Organization"
        />
      </v-col>

      <v-col>
        showOnHover
        <MetadataOrganizationChip
            showOnHover
            organization="swissforestlab-swissfl"
            tooltip="SwissFL"
        />
      </v-col>

    </v-row>`,
});
