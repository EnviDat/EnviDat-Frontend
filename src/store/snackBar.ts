import { defineStore } from 'pinia';

type Level = 'success' | 'info' | 'warning' | 'error';

export const useNotifyStore = defineStore('notify', {
  state: () => ({
    open: false,
    message: '' as string,
    color: 'info' as Level,
    timeout: -1 as number,
    loader: false as boolean,
  }),
  actions: {
    show(msg: string, level: Level = 'info', timeout = -1, loader = false) {
      this.message = msg;
      this.color = level;
      this.timeout = timeout;
      this.open = true;
      this.loader = loader;
    },
    success(msg: string, timeout = 1000) {
      this.show(msg, 'success', timeout, false);
    },
    error(msg: string, timeout = 1000) {
      this.show(msg, 'error', timeout, false);
    },
    info(msg: string, timeout = 1000) {
      this.show(msg, 'info', timeout, false);
    },
    warning(msg: string, timeout = 1000) {
      this.show(msg, 'warning', timeout, false);
    },
    close() {
      this.open = false;
      this.loader = false;
    },
  },
});
