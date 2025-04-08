import { convertJSON, convertToBackendJSONWithRules, convertToFrontendJSONWithRules } from '@/factories/mappingFactory';
import type { DatasetDTO } from '@/types/modelTypes';
import { DatasetViewModel } from '@/factories/ViewModels/DatasetViewModel.ts';

/*
function enforceAbstractProps(instance, requiredProps) {
  for (const prop in requiredProps) {
    if (!(prop in instance)) {
      throw new Error(`Property ${requiredProps[prop]} needs to be defined!`);
    }
  }
}
*/

export abstract class AbstractEditViewModel {

  private privateMappingRules: string[][];

  private datasetViewModel: DatasetViewModel;

  abstract validate(newProps: any | undefined = undefined): boolean;


  constructor(datasetViewModel: DatasetViewModel, mappingRules: string[][] = undefined) {

    this.mappingRules = mappingRules;
    this.datasetViewModel = datasetViewModel;

    if (new.target === AbstractEditViewModel) {
      throw new Error('Cannot instantiate an abstract Class');
    }

    // enforceAbstractProps(this, ['mappingRules']);

    const dataset = datasetViewModel.dataset
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


  async save(newData: any): Promise<boolean> {
    const isValid = this.validate(newData);

    if (!isValid) {
//      console.log('EditHeaderViewModel NOT saved because validation failed!', this);
      return false;
    }

    await this.datasetViewModel.patchViewModel(this)

    Object.assign(this, newData);

//    console.log('EditHeaderViewModel saved', this);
    return true;
  }

}
