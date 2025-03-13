import { watch } from 'vue';
import { convertJSON } from '@/factories/mappingFactory';
import type { DatasetDTO } from '@/types/modelTypes';

export class Dataset implements DatasetDTO {

  /**
   * List of the watcher methods to be called to stop watching on a reactive model
   * @type {[]}
   */
  subscribers = [];

  serviceLayer;

  /**
   * Map to keep reference of models that are being updated from the backend
   * because the update to the backend itself is in a watcher, when a model is updated
   * this would case an endless loop.
   *
   * @type {Map<string, boolean>}
   */
  modelInSyncMap = new Map();

  constructor(datasetBackend, serviceLayer) {
    this.convertBackendDataset(datasetBackend);
    this.serviceLayer = serviceLayer;
  }

  convertBackendDataset(datasetBackend) {
    const frontendJson = convertJSON(datasetBackend, false);
    Object.assign(this, frontendJson);
  }

  subscribeToViewModels(viewModels) {

    // eslint-disable-next-line no-unused-vars
    for (const [key, vm] of viewModels) {

      this.modelInSyncMap.set(key, false);

      const watcherMethod = watch(() => vm, async (newModel) => {

        const isSyncing = this.modelInSyncMap.get(key);
        if (isSyncing) {
          // use a map to store if a Model is syncing to avoid an endless loop
          // when updating a model
          this.modelInSyncMap.set(key, false);
          return;
        }

        try {
          this.modelInSyncMap.set(key, true);

          const newBackendDataset = await this.serviceLayer.patchDatasetChanges(this.id, newModel);
          this.convertBackendDataset(newBackendDataset);
          this.updateViewModels();

          newModel.savedSuccessful = true;

        } catch (e) {
          newModel.savedSuccessful = false;
          newModel.error = e;
          this.updateViewModelWithError(e, newModel);
        }

      }, { deep: true });

      this.subscribers.push(watcherMethod);
    }

  }

  // eslint-disable-next-line class-methods-use-this
  updateViewModelWithError(err, vm) {
    vm.error = err;
  }

  unsubscribeFromViewModels() {
    for (let i = 0; i < this.subscribers.length; i++) {
      const watcherMethod = this.subscribers[i];
      watcherMethod(); // calling the watcher should stop it
    }
  }

  updateViewModels() {
    const vModels = this.serviceLayer.viewModels;
    vModels.forEach((model) => model.updateModel(this))
  }

}
