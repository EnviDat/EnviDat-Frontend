<template>
  <v-alert
    class="maintenance-alert"
    :color="color"
    :icon="icon"
    :closable="closable"
    :title="config?.maintenanceConfig?.title"
    :rounded="rounded"
    :text="config?.maintenanceConfig?.message"
  ></v-alert>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

defineProps({
  color: {
    type: String,
    default: 'warning',
  },
  closable: {
    type: Boolean,
    default: true,
  },
  rounded: {
    type: String,
    default: 'xl',
  },
  icon: {
    type: String,
    default: '$warning',
  },
});

const store = useStore();
const config = computed(() => store.state.config);
</script>

<style scoped lang="scss">
.maintenance-alert ::v-deep .v-alert__close .v-btn__content .v-icon__svg {
  fill: #000;
}

.maintenance-alert {
  position: absolute;
  height: auto;
  width: auto;
  max-width: 600px;
  z-index: 2000;
  right: 12px;
  top: 50px;

  @media screen and (max-width: 768px) {
    width: 100%;
    max-width: inherit;
    top: 60px;
    left: 0;
  }
}
</style>
