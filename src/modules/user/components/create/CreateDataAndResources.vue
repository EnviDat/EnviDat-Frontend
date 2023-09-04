<template>
  <v-card class="pa-4">
    <v-container fluid class="pa-0">
      <v-row>
        <v-col cols="12">
          <div class="text-h5">{{ title }}</div>
        </v-col>
      </v-row>

        <v-row>
            <v-col cols="12">
                <div class="text-h6">{{ subtitle }}</div>
            </v-col>
        </v-row>

      <v-row no-gutters align="center" class="pt-6">
        <v-col cols="1">
          <v-icon
            color="secondary"
            x-large
            >draw</v-icon
          >
        </v-col>

        <v-col class="text-body-1" v-html="instructions"> </v-col>
      </v-row>

    </v-container>
  </v-card>
</template>

<script>
export default {
  name: 'CreateDataAndResources',
  data: () => ({
    title: 'Research Data & Resources',
    subtitle: 'This dataset is still a "Draft"',
    instructions: 'Please finish all the steps to create your datasets on the server. Once it\'s saved you can upload your research data and other resources in the editing workflow.',
  }),
};
</script>

<style scoped></style>
