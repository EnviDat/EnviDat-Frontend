<template>
  <div>
    <v-col cols="12" class="d-flex justify-center">
      <span class="text-h6 text-center font-weight-bold"
        >Need information or support?</span
      >
    </v-col>
    <v-col class="d-flex justify-center">
      <div class="text-center">
        For help or questions, feel free to contact us at
        <span class="text-primary">envidat@wsl.ch</span>
        <br />
        Envidat is always working to improve usability for you. We would be
        happy to receive your feedback and suggestions.
      </div>
    </v-col>
    <v-col class="d-flex justify-center">
      <v-btn color="secondary" @click="sendEmail"> Contact Us </v-btn>
    </v-col>
  </div>
</template>

<script setup>
const sendEmail = () => {
  window.location.href = 'mailto:envidat@wsl.ch';
};
</script>

<style scoped></style>
