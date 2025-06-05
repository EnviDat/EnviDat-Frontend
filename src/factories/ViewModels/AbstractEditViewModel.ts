import * as yup from 'yup';
import {
  convertJSON,
  convertToBackendJSONWithRules,
  convertToFrontendJSONWithRules,
} from '@/factories/mappingFactory';

import type { DatasetDTO } from '@/types/dataTransferObjectsTypes';
import { DatasetViewModel } from '@/factories/ViewModels/DatasetViewModel.ts';
import { isFieldValid } from '@/factories/userEditingValidations';


export abstract class AbstractEditViewModel {
  private privateMappingRules: string[][];

  protected datasetViewModel: DatasetViewModel;

  abstract validationErrors: object;

  declare validationRules: yup.AnyObjectSchema;

  protected constructor(
    datasetViewModel: DatasetViewModel,
    mappingRules: string[][] = undefined,
  ) {
    this.mappingRules = mappingRules;
    this.datasetViewModel = datasetViewModel;

    if (new.target === AbstractEditViewModel) {
      throw new Error('Cannot instantiate an abstract Class');
    }

    // enforceAbstractProps(this, ['mappingRules']);

    const dataset = this.datasetViewModel?.dataset;
    if (dataset && this.mappingRules) {
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

  updateModel(dataset: DatasetDTO) {
    const frontendJson = convertToFrontendJSONWithRules(
      this.mappingRules,
      dataset,
    );
    Object.assign(this, frontendJson);
  }

  get backendJSON() {
    const backendFields = convertToBackendJSONWithRules(
      this.mappingRules,
      this,
    );
    return convertJSON(backendFields, true);
  }

  get frontendProperties() {
    return this.mappingRules.map((rule) => rule[0]);
  }

  get backendProperties() {
    return this.mappingRules.map((rule) => rule[1]);
  }

  validate(newProps?: any): boolean {
    if (!newProps) return true;

    let allValid = true;

    for (const [field, value] of Object.entries(newProps)) {
      const ok = isFieldValid(
        field,
        value,
        this.validationRules,
        this.validationErrors,
      );
      if (!ok) allValid = false;
    }

    return allValid;
  }

  async save(newData: any): Promise<boolean> {
    const isValid = this.validate(newData);

    if (!isValid) {
      //      console.log('EditHeaderViewModel NOT saved because validation failed!', this);
      return false;
    }

    if (this.datasetViewModel) {
      await this.datasetViewModel.patchViewModel(this);
    }

    Object.assign(this, newData);

    //    console.log('EditHeaderViewModel saved', this);
    return true;
  }
}
