import { convertJSON, convertToBackendJSONWithRules, convertToFrontendJSONWithRules } from '@/factories/mappingFactory';
import type { DatasetDTO } from '@/types/modelTypes';
// import { HeaderViewModel } from '@/factories/ViewModels/HeaderViewModel.ts';

/*
function enforceAbstractProps(instance, requiredProps) {
  for (const prop in requiredProps) {
    if (!(prop in instance)) {
      throw new Error(`Property ${requiredProps[prop]} needs to be defined!`);
    }
  }
}
*/

export class AbstractBaseViewModel {
  private privateMappingRules: string[][];

  constructor(dataset: DatasetDTO = undefined, mappingRules: string[][] = undefined) {
    this.mappingRules = mappingRules;

    if (new.target === AbstractBaseViewModel) {
      throw new Error('Cannot instantiate an abstract Class');
    }

    // enforceAbstractProps(this, ['mappingRules']);

    if (dataset) {
      this.updateModel(dataset);
    }
    // console.log('Parent constructor:', this);
  }

  savedSuccessful = false;

  loading = false;

  error = undefined;

  get mappingRules() {
    return this.privateMappingRules;
  }

  set mappingRules(mappingRules) {
    this.privateMappingRules = mappingRules;
  }

  updateModel (dataset: DatasetDTO) {
    const frontendJson = convertToFrontendJSONWithRules(this.mappingRules, dataset);
    Object.assign(this, frontendJson);
  }

  get backendJSON() {
    const backendFields = convertToBackendJSONWithRules(this.mappingRules, this);
    return convertJSON(backendFields, true);
  }

  get frontendProperties() {
    return this.mappingRules.map((rule) => rule[0]);
  }

  get backendProperties() {
    return this.mappingRules.map((rule) => rule[1]);
  }

}
