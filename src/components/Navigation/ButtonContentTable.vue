<template>
  <v-card >
  
    <v-container class="pa-3" fluid >
      <v-row  > 

        <v-col class="display-1"
                style="text-align: center;">
          {{ title }}
        </v-col>

      </v-row> 

      <v-row  > 
        <v-col cols="12"
                class="title">
          {{ subtitle }}
        </v-col>
      </v-row> 

      <v-row no-gutters >

        <v-col v-for="(buttonObj, index) in buttonList"
                :key="index" 
                cols="12"
                class="py-1">

          <v-btn color="secondary"
                :small="$vuetify.breakpoint.mdAndUp"
                @click="$emit('buttonClick', buttonObj.buttonKey);">
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
  components: {
  },
  props: {
    title: String,
    subtitle: String,
    buttonList: Array,
  },
  computed: {
  },
  data: () => ({
  }),
};
</script>

<style>

</style>
