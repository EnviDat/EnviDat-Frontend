<template>
  <v-snackbar
    v-model="notify.open"
    :timeout="notify.timeout"
    :color="notify.color"
    location="bottom center"
    rounded="lg"
    variant="flat"
  >
    <p class="text-body-1" style="text-align: center">
      {{ notify.message }}
    </p>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useNotifyStore } from '@/modules/workflow/utils/snackBar';

const notify = useNotifyStore();
</script>
