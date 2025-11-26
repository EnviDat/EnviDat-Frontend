/* eslint-disable import/no-extraneous-dependencies */
import SnackBar from '@/components/BaseElements/SnackBar.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useNotifyStore } from '@/store/snackBar';

export default {
  title: '1 Base / Snackbar',
  component: SnackBar,
};

export const SnackbarType = {
  render() {
    const pinia = createPinia();
    setActivePinia(pinia);

    const notify = useNotifyStore();

    return {
      components: { SnackBar },
      setup() {
        const showSuccess = () => {
          notify.success('Dataset created successfully', 2000);
        };

        const showError = () => {
          notify.error('Something went wrong while saving your dataset', 3000);
        };

        const showLoader = () => {
          notify.show('We are improving your search results, and your list will be updated shortly', 'info', -1, true);
        };

        const close = () => {
          notify.close();
        };

        return {
          showSuccess,
          showError,
          showLoader,
          close,
        };
      },
      template: `
        <div style="padding: 2rem; min-height: 200px">
          <v-btn color="success" class="mr-2" @click="showSuccess">
            Show success
          </v-btn>

          <v-btn color="error" class="mr-2" @click="showError">
            Show error
          </v-btn>

          <v-btn color="primary" class="mr-2" @click="showLoader">
            Show loader (infinite)
          </v-btn>

          <v-btn variant="outlined" @click="close">
            Close snackbar
          </v-btn>

          <!-- Global snackbar driven by Pinia -->
          <SnackBar />
        </div>
      `,
    };
  },
};

export const LoaderOnStart = {
  render() {
    const pinia = createPinia();
    setActivePinia(pinia);

    const notify = useNotifyStore();

    notify.show('We are improving your search results, and your list will be updated shortly', 'info', -1, true);

    return {
      components: { SnackBar },
      setup() {
        const close = () => {
          notify.close();
        };

        return { close };
      },
      template: `
          <p>This story shows the loader snackbar immediately.</p>
          <v-btn variant="outlined" @click="close">
            Close snackbar
          </v-btn>

          <SnackBar />
        </div>
      `,
    };
  },
};
