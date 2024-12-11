import { convertToBackendJSONWithRules, convertToFrontendJSONWithRules } from '@/factories/mappingFactory';

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
  constructor(datasetDTO, mappingRules) {
    this.mappingRules = mappingRules;

    if (new.target === AbstractBaseViewModel) {
      throw new Error('Cannot instantiate an abstract Class');
    }

    // enforceAbstractProps(this, ['mappingRules']);

    const frontendJson = convertToFrontendJSONWithRules(this.mappingRules, datasetDTO);
    Object.assign(this, frontendJson);
  }

  get mappingRules() {
    return this.privateMappingRules;
  }

  set mappingRules(mappingRules) {
    this.privateMappingRules = mappingRules;
  }

  get backendJSON() {
    return convertToBackendJSONWithRules(this.mappingRules, this);
  }

  get frontendProperties() {
    return this.mappingRules.map((rule) => rule[0]);
  }

  get backendProperties() {
    return this.mappingRules.map((rule) => rule[1]);
  }

}
