import { convertJSON } from '@/factories/mappingFactory';
import { watch } from 'vue';

export class DatasetDTO {

  subscribers = [];

  serviceLayer;

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

      const sub = watch(() => vm, async (newModel) => {

        const isSyncing = this.modelInSyncMap.get(key);
        if (isSyncing) {
          this.modelInSyncMap.set(key, false);
          return;
        }

        try {
          this.modelInSyncMap.set(key, true);

          const newBackendDataset = await this.serviceLayer.patchDatasetChanges(this.id, newModel);
          this.convertBackendDataset(newBackendDataset);
          this.updateViewModels();

          newModel.saveSuccessfull = true;

        } catch (e) {
          newModel.saveSuccessfull = false;
          this.updateViewModelWithError(e, newModel);
        }

      }, { deep: true });

      this.subscribers.push(sub);
    }

  }

  // eslint-disable-next-line class-methods-use-this
  updateViewModelWithError(err, vm) {
    vm.error = err;
  }

  unsubscribeFromViewModels() {
    for (let i = 0; i < this.subscribers.length; i++) {
      const subWatches = this.subscribers[i];
      subWatches(); // calling the watcher should stop it
    }
  }

  updateViewModels() {
    const vModels = this.serviceLayer.viewModels;
    vModels.forEach((model) => model.updateModel(this))
  }

}
