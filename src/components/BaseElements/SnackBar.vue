<template>
  <v-snackbar
    v-model="notify.open"
    :timeout="notify.timeout"
    :color="notify.color"
    location="bottom center"
    rounded="lg"
    variant="flat"
  >
    <div class="d-flex align-center justify-center">
      <v-progress-circular v-if="notify.loader" indeterminate class="mr-4"></v-progress-circular>
      <p class="text-body-1" style="text-align: center">
        {{ notify.message }}
      </p>
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useNotifyStore } from '@/store/snackBar';

const notify = useNotifyStore();
</script>
