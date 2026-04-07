import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';
import { convertJSON, convertToBackendJSONWithRules } from '@/factories/convertJSON';

export class AdminViewModel extends AbstractEditViewModel {
  declare customFields: string;
  // declare datasetProject: string;

  validationErrors: {
    customFields: string | null;
  } = {
    customFields: null,
  };

  validationRules = yup.object().shape({
    customFields: yup.array().of(
      yup.object({
        key: yup.string().required().min(3),
        value: yup.string(),
      }),
    ),
  });

  constructor(datasetModel: DatasetModel) {
    super(datasetModel, AdminViewModel.mappingRules());
  }

  static mappingRules() {
    return [['customFields', 'extras']];
  }

  get backendJSON() {
    const backendFields = convertToBackendJSONWithRules(this.mappingRules, this);
    // Do not stringify extras for CKAN package_patch (expects array of dicts)
    return convertJSON(backendFields, false);
  }

  validate(newProps?: Partial<AdminViewModel>): boolean {
    return super.validate(newProps);
  }
}
