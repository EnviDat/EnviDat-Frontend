<template>
  <v-dialog :model-value="modelValue" @update:model-value="(val) => emit('update:modelValue', val)" max-width="500">
    <v-card rounded="xl">
      <v-card-text class="font-weight-bold">
        {{ title }}
      </v-card-text>

      <v-card-text v-if="!readyToSave">
        <span v-if="errorMessage">
          {{ errorMessage }}
        </span>
      </v-card-text>

      <v-card-text v-else>
        Saving your data now will <b>store your dataset in our system</b>, but it will not be published yet. Before
        publication, you will need to complete the remaining steps. However, from this point,
        <b>you can request a DOI for your dataset.</b>
      </v-card-text>

      <v-card-text>
        For any questions or clarifications, please contact the team at
        <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
      </v-card-text>

      <v-card-actions class="pa-7">
        <BaseRectangleButton
          :buttonText="closeText"
          :color="readyToSave ? 'gray' : undefined"
          :disabled="loading"
          @clicked="onClose"
        />
        <BaseRectangleButton
          v-if="readyToSave"
          :buttonText="confirmText"
          :loading="loading"
          :disabled="loading"
          @clicked="onConfirm"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';

const props = defineProps<{
  modelValue: boolean;
  readyToSave: boolean;
  errorMessage?: string;
  title?: string;
  closeText?: string;
  confirmText?: string;
  contactEmail?: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
  (e: 'confirm'): void;
}>();

const title = computed(() => props.title ?? 'Before You Proceed');
const closeText = computed(() => props.closeText ?? 'Close');
const confirmText = computed(() => props.confirmText ?? 'Save and Proceed');
const contactEmail = computed(() => props.contactEmail ?? 'envidat@wsl.ch');
const loading = computed(() => !!props.loading);

const onClose = () => {
  emit('update:modelValue', false);
  emit('close');
};

const onConfirm = () => {
  emit('confirm');
};
</script>
