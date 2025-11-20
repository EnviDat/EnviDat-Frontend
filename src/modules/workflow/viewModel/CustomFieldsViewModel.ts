import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { METADATA_DEPRECATED_RESOURCES_PROPERTY } from '@/factories/metadataConsts';
import { Resource } from '@/types/modelTypes';
import { convertJSON, convertToBackendJSONWithRules, convertToFrontendJSONWithRules } from '@/factories/convertJSON';
import type { DatasetDTO } from '@/types/dataTransferObjectsTypes';
import { ViewModelSaveEvent } from '@/types/workflow';

export type CustomFieldEntry = {
  fieldName: string;
  content: string;
};

export class CustomFieldsViewModel extends AbstractEditViewModel {
  declare customFields: CustomFieldEntry[];

  validationErrors: {
    customFields: {
      fieldName: string | null;
      content: string | null;
    }[];
  } = {
    customFields: [
      {
        fieldName: null,
        content: null,
      },
    ],
  };

  validationRules = yup.object().shape({
    customFields: yup.array().of(
      yup.object({
        fieldName: yup.string().required().min(3),
        content: yup.string(),
      }),
    ),
  });

  constructor(dataset: DatasetDTO | undefined, saveEventHook: ViewModelSaveEvent | undefined) {
    super(dataset, saveEventHook, CustomFieldsViewModel.mappingRules());
  }

  static mappingRules() {
    return [['customFields', 'extras']];
  }

  static entryMappingRules = [
    ['fieldName', 'key'],
    ['content', 'value'],
  ];

  validate(newProps?: Partial<CustomFieldsViewModel>): boolean {
    return super.validate(newProps);
  }

  updateModel(dataset: DatasetDTO) {
    const frontendJson = convertToFrontendJSONWithRules(this.mappingRules, dataset);

    const convertedEntries = frontendJson?.customFields.map((entry) =>
      convertToFrontendJSONWithRules(CustomFieldsViewModel.entryMappingRules, entry),
    );
    Object.assign(this, {
      customFields: convertedEntries,
    });
  }

  get backendJSON() {
    const convertedEntries = this.customFields?.map((entry) =>
      convertToBackendJSONWithRules(CustomFieldsViewModel.entryMappingRules, entry),
    );

    const backendFields = convertToBackendJSONWithRules(this.mappingRules, {
      customFields: convertedEntries,
    });

    return convertJSON(backendFields, false);
  }

  get deprecatedResourcesEntry(): CustomFieldEntry {
    return this.customFields?.filter((entry) => entry?.fieldName === METADATA_DEPRECATED_RESOURCES_PROPERTY)[0];
  }

  storeDeprecatedResources(resourcesForDeprecation: Resource[]) {
    const ids = resourcesForDeprecation.map((res) => res.id);

    // find deprecated entry or create one
    let deprecatedResourcesEntry = this.deprecatedResourcesEntry;

    if (!deprecatedResourcesEntry) {
      deprecatedResourcesEntry = {
        fieldName: METADATA_DEPRECATED_RESOURCES_PROPERTY,
        content: JSON.stringify(ids),
      };

      this.customFields.push(deprecatedResourcesEntry);
    } else {
      deprecatedResourcesEntry.content = JSON.stringify(ids);
    }
  }

  isResourceDeprecated(resourceId: string) {
    const deprecatedResourcesEntry = this.deprecatedResourcesEntry;

    if (!deprecatedResourcesEntry) {
      return false;
    }

    return deprecatedResourcesEntry.content.includes(resourceId);
  }
}
