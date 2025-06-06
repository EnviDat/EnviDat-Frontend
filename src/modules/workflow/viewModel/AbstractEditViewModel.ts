import * as yup from 'yup';
import {
  convertJSON,
  convertToBackendJSONWithRules,
  convertToFrontendJSONWithRules,
} from '@/factories/mappingFactory';

import type { DatasetDTO } from '@/types/dataTransferObjectsTypes';
import { DatasetViewModel } from '@/modules/workflow/viewModel/DatasetViewModel.ts';
import {
  isFieldValid,
  isObjectValidCheckAllProps,
} from '@/factories/userEditingValidations';

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
    this.loading = true;
    this.error = undefined;

    try {
      if (!this.validate(newData)) {
        this.error = this.validationErrors;
        return false;
      }

      if (this.datasetViewModel) {
        await this.datasetViewModel.patchViewModel(this);
      }

      Object.assign(this, newData);
      return true;
    } catch (e) {
      this.error = e;
      return false;
    } finally {
      this.loading = false;
    }
  }

  // This method is used to save the object with the current properties, ONLY when we click on next
  async saveObject(newProps = {}) {
    this.loading = true;
    this.error = undefined;

    try {
      const schemaKeys = Object.keys(this.validationRules.fields);
      // I need to check only the fields related to my current vm, that's why I use schemaKeys and reduce
      const obj = schemaKeys.reduce((acc, key) => {
        acc[key] = newProps && key in newProps ? newProps[key] : this[key];
        return acc;
      }, {});

      const ok = isObjectValidCheckAllProps(
        obj,
        this.validationRules,
        this.validationErrors,
      );

      if (!ok) {
        this.error = this.validationErrors;
        console.log(this.error);
        return false;
      }

      Object.assign(this, newProps);

      if (this.datasetViewModel?.patchViewModel) {
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
