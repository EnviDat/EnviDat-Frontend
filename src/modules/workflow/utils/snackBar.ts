import { defineStore } from 'pinia';

type Level = 'success' | 'info' | 'warning' | 'error';

export const useNotifyStore = defineStore('notify', {
  state: () => ({
    open: false,
    message: '' as string,
    color: 'info' as Level,
    timeout: 1000 as number,
  }),
  actions: {
    show(msg: string, level: Level = 'info', timeout = 1000) {
      this.message = msg;
      this.color = level;
      this.timeout = timeout;
      this.open = true;
    },
    success(msg: string, timeout = 1000) {
      this.show(msg, 'success', timeout);
    },
    error(msg: string, timeout = 1000) {
      this.show(msg, 'error', timeout);
    },
    info(msg: string, timeout = 1000) {
      this.show(msg, 'info', timeout);
    },
    warning(msg: string, timeout = 1000) {
      this.show(msg, 'warning', timeout);
    },
    close() {
      this.open = false;
    },
  },
});
