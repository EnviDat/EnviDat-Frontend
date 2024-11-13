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

import MetadataOrganizationChip from '@/components/Chips/MetadataOrganizationChip.vue';

export default {
    title: '1 Base / Chips / MetadataOrganizationChip',
    decorators: [],
};

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
