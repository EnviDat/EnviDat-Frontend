import { convertJSON, convertToBackendJSONWithRules, convertToFrontendJSONWithRules } from '@/factories/convertJSON';
import type { DatasetDTO } from '@/types/dataTransferObjectsTypes';

/*
function enforceAbstractProps(instance, requiredProps) {
  for (const prop in requiredProps) {
    if (!(prop in instance)) {
      throw new Error(`Property ${requiredProps[prop]} needs to be defined!`);
    }
  }
}
*/

export abstract class AbstractViewModel {
  private privateMappingRules: string[][];

  constructor(dataset: DatasetDTO, mappingRules: string[][] = undefined) {
    this.mappingRules = mappingRules;

    if (new.target === AbstractViewModel) {
      throw new Error('Cannot instantiate an abstract Class');
    }

    // enforceAbstractProps(this, ['mappingRules']);

    if (dataset) {
      this.updateModel(dataset);
    }
    // console.log('Parent constructor:', this);
  }

  loading = false;

  error = undefined;

  get mappingRules() {
    return this.privateMappingRules;
  }

  set mappingRules(mappingRules) {
    this.privateMappingRules = mappingRules;
  }

  updateModel(dataset: DatasetDTO) {
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
