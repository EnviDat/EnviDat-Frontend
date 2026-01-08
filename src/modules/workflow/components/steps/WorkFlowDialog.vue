<template>
  <v-dialog
    :model-value="modelValue"
    persistent
    max-width="500"
    @update:model-value="(val) => emit('update:modelValue', val)"
  >
    <v-card rounded="xl">
      <v-card-text class="font-weight-bold">
        {{ title }}
      </v-card-text>
      <v-card-text>
        {{ message }}
      </v-card-text>
      <v-card-actions class="pa-7">
        <BaseRectangleButton
          v-if="cancelText != 'null'"
          :buttonText="cancelText"
          :color="'secondary'"
          @clicked="onClose"
        />
        <BaseRectangleButton :buttonText="confirmText" @clicked="onConfirm" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';

const props = defineProps<{
  modelValue: boolean;
  title?: string;
  message?: string;
  cancelText?: string;
  confirmText?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
  (e: 'confirm'): void;
}>();

const title = computed(() => props.title ?? 'Please Sign In');
const message = computed(() => props.message ?? 'For dataset editing you need to be signed in.');
const cancelText = computed(() => props.cancelText ?? 'Go to Home');
const confirmText = computed(() => props.confirmText ?? 'Sign In');

const onClose = () => {
  emit('update:modelValue', false);
  emit('close');
};

const onConfirm = () => {
  emit('update:modelValue', false);
  emit('confirm');
};
</script>
