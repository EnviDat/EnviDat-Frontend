import * as yup from 'yup';
import {
  convertJSON,
  convertToBackendJSONWithRules,
  convertToFrontendJSONWithRules,
} from '@/factories/mappingFactory';

import type { DatasetDTO } from '@/types/dataTransferObjectsTypes';
import { DatasetViewModel } from '@/modules/workflow/viewModel/DatasetViewModel.ts';
import { isFieldValid } from '@/factories/userEditingValidations';

export abstract class AbstractEditViewModel {
  protected privateMappingRules: string[][];

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

  /**
   * Returns a shallow copy of the properties just from this class, nothing inherited
   */
  protected getModelData<T>(): Omit<
    T,
    | 'privateMappingRules'
    | 'datasetViewModel'
    | 'validationRules'
    | 'validationErrors'
    | 'savedSuccessful'
    | 'error'
    | 'loading'
  > {
    // deconstruct this to remove the model view specific props
    const {
      privateMappingRules,
      datasetViewModel,
      validationRules,
      validationErrors,
      savedSuccessful,
      error,
      loading,
      ...dataOnly
    } = this;

    return dataOnly as T;
  }

  get frontendProperties() {
    return this.mappingRules.map((rule) => rule[0]);
  }

  get backendProperties() {
    return this.mappingRules.map((rule) => rule[1]);
  }

  private getPropsToValidate(newProps) {
    if (!newProps) {
      return {};
    }

    const schemaKeys = Object.keys(this.validationRules.fields);
    // I need to check only the fields related to my current vm, that's why I use schemaKeys and reduce
    return schemaKeys.reduce((accumulator, property) => {
      if (property in newProps) {
        accumulator[property] = newProps[property];
      }
      return accumulator;
    }, {});
  }

  validate(newProps: any | undefined): boolean {
    if (!newProps) {
      newProps = this;
    }

    const propsToValidate = this.getPropsToValidate(newProps);
    let allValid = true;

    // reset validationErrors ?
    // this.validationErrors = {};

    for (const [field, value] of Object.entries(propsToValidate)) {
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

  async save(newData: any | undefined): Promise<boolean> {
    if (!newData) {
      // in case there are no props provided as parameters, use this viewModels
      // properties to validate itself
      newData = this;
    }

    this.loading = true;
    this.error = undefined;

    try {
      if (!this.validate(newData)) {
        return false;
      }

      // take over all the data to store it in this viewModel
      Object.assign(this, newData);

      if (this.datasetViewModel) {
        await this.datasetViewModel.patchViewModel(this);
      }

      return true;
    } catch (e) {
      this.error = e;
      return false;
    } finally {
      this.loading = false;
    }
  }
}
