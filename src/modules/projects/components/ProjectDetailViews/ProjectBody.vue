<template>
  <expandable-text-layout title="Description"
                            :text="description"
                            :maxTextLength="maxTextLength"
                            :emptyText="emptyText"
                            :showPlaceholder="showPlaceholder" />

</template>

<script>
/**
 * ProjectBody.vue renders markdown showing the description of the project.
 *
 * @summary shows the description of a project entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2019-11-28 14:10:13
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import ExpandableTextLayout from '@/components/Layouts/ExpandableTextLayout';

export default {
  name: 'ProjectBody',
  components: {
    ExpandableTextLayout,
  },
  props: {
    description: String,
    showPlaceholder: Boolean,
    maxTextLength: {
      type: Number,
      default: 1500,
    },
  },
  computed: {
  },
  methods: {
  },
  data: () => ({
    emptyText: 'No description found for this project.',
  }),
};
</script>
