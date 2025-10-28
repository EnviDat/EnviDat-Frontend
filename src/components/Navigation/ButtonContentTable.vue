<template>
  <v-card>
    <v-container class="pa-3" fluid>
      <v-row>
        <v-col class="text-h4" style="text-align: center">
          {{ title }}
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" class="text-h6">
          <div v-html="subtitle"></div>
        </v-col>
      </v-row>

      <v-row no-gutters class="pt-2">
        <v-col v-for="(buttonObj, index) in buttonList" :key="index" cols="12" class="py-1">
          <v-btn
            color="secondary"
            :size="$vuetify.display.mdAndUp ? 'small' : undefined"
            :disabled="!downloadActive"
            @click="$emit('buttonClick', buttonObj.buttonKey)"
          >
            {{ buttonObj.buttonText }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: 'ButtonContentTable',
  components: {},
  props: {
    title: String,
    subtitle: String,
    buttonList: Array,
    downloadActive: {
      type: Boolean,
      default: true,
    },
  },
  computed: {},
  data: () => ({}),
};
</script>

<style></style>
