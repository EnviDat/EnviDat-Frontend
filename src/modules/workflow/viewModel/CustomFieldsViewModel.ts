import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';
import { METADATA_DEPRECATED_RESOURCES_PROPERTY } from '@/factories/metadataConsts';
import { Resource } from '@/types/modelTypes';
import { convertJSON, convertToBackendJSONWithRules, convertToFrontendJSONWithRules } from '@/factories/convertJSON';
import type { DatasetDTO } from '@/types/dataTransferObjectsTypes';


export type CustomFieldEntry = {
  fieldName: string;
  content: string;
}

export class CustomFieldsViewModel extends AbstractEditViewModel{

  declare customFields: CustomFieldEntry[];

  validationErrors: {
    customFields: {
      fieldName: string | null;
      content: string | null;
    },
  } = {
    customFields: [
      {
        fieldName: null,
        content: null,
      },
    ],
  };


  validationRules =
    yup.object().shape({
      customFields: yup.array().of(
        yup.object({
          fieldName: yup.string().required().min(3),
          content: yup.string(),
        }),
      ),
    })

  constructor(datasetModel: DatasetModel) {
    super(datasetModel, CustomFieldsViewModel.mappingRules());
  }

  static mappingRules () {
    return [
      ['customFields', 'extras'],
    ];
  }

  static entryMappingRules = [
    ['fieldName', 'key'],
    ['content', 'value'],
  ];


  validate(newProps?: Partial<CustomFieldsViewModel>): boolean {
    return super.validate(newProps);
  }

  updateModel(dataset: DatasetDTO) {
    const frontendJson = convertToFrontendJSONWithRules(
      this.mappingRules,
      dataset,
    );

    const convertedEntries = frontendJson?.customFields.map((entry) => convertToFrontendJSONWithRules(CustomFieldsViewModel.entryMappingRules, entry))
    Object.assign(this, {
      customFields: convertedEntries,
    });
  }

  get backendJSON() {

    const convertedEntries = this.customFields?.map((entry) => convertToBackendJSONWithRules(CustomFieldsViewModel.entryMappingRules, entry))

    const backendFields = convertToBackendJSONWithRules(
      this.mappingRules,
      {
        customFields: convertedEntries,
      },
    );

    return convertJSON(backendFields, false);
  }

/*
  private unpackDeprecatedResources(customFields: CustomFieldEntry[]) {

    let deprecatedResourceEntry = customFields?.filter((entry) => entry?.fieldName === METADATA_DEPRECATED_RESOURCES_PROPERTY)[0];
    // first check the customFields entries and sanitze them (to at least always start with an empty array)

    if (!deprecatedResourceEntry) {

      deprecatedResourceEntry = {
        fieldName: METADATA_DEPRECATED_RESOURCES_PROPERTY,
        content: JSON.stringify([]),
      }

      customFields.push(deprecatedResourceEntry);
    }

    return JSON.parse(deprecatedResourceEntry.content);
  }

  private markResourceDeprecatedInCustomFields(resourceId: string, deprecated: boolean, customFields: CustomFieldEntry[])  {

    let deprecatedResources = this.unpackDeprecatedResources(customFields);

    if (deprecated) {
      deprecatedResources.push(resourceId);
    } else {
      deprecatedResources = deprecatedResources.filter(i => i !== resourceId);
    }

    const deprecatedResourcesEntry = customFields.filter((entry) => entry?.fieldName === METADATA_DEPRECATED_RESOURCES_PROPERTY)[0];
    deprecatedResourcesEntry.content = JSON.stringify(deprecatedResources);

    return customFields;
  }

  private deprecatedResourceChanged(resourceId: string, deprecated: boolean, customFields: CustomFieldEntry[]){
    const deprecatedResources = this.unpackDeprecatedResources(customFields);

    const isDeprecatedOnServer = deprecatedResources?.includes(resourceId);
    const isDeprecatedLocally = isDeprecated === true;
    return isDeprecatedLocally !== isDeprecatedOnServer;
  }
*/

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
      }

      this.customFields.push(deprecatedResourcesEntry);
    } else {
      deprecatedResourcesEntry.content = JSON.stringify(ids);
    }

  }

  isResourceDeprecated(resourceId: string) {
    const deprecatedResourcesEntry = this.deprecatedResources;

    if (!deprecatedResourcesEntry) {
      return false;
    }

    return deprecatedResourcesEntry.content.includes(resourceId);
  }

}

