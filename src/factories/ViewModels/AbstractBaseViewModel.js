import { convertJSON, convertToBackendJSONWithRules, convertToFrontendJSONWithRules } from '@/factories/mappingFactory';
// import { HeaderViewModel } from '@/factories/ViewModels/HeaderViewModel.js';

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

  saveSuccessfull = false;

  error;

  constructor(datasetDTO, mappingRules) {
    this.mappingRules = mappingRules;

    if (new.target === AbstractBaseViewModel) {
      throw new Error('Cannot instantiate an abstract Class');
    }

    // enforceAbstractProps(this, ['mappingRules']);

    if (datasetDTO) {
      this.updateModel(datasetDTO, mappingRules);
    }
  }

  get mappingRules() {
    return this.privateMappingRules;
  }

  set mappingRules(mappingRules) {
    this.privateMappingRules = mappingRules;
  }

  updateModel (datasetDTO) {
    const frontendJson = convertToFrontendJSONWithRules(this.mappingRules, datasetDTO);
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
