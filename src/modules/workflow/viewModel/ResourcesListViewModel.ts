import * as yup from 'yup';

import { Resource, User } from '@/types/modelTypes';
import { type DatasetDTO, ResourceDTO } from '@/types/dataTransferObjectsTypes';
import { ResourceViewModel } from '@/modules/workflow/viewModel/ResourceViewModel.ts';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel';
import { METADATA_NEW_RESOURCE_ID } from '@/factories/metadataConsts';

import { formatDateTimeToCKANFormat, stringifyResourceForBackend } from '@/factories/mappingFactory';

import { convertJSON, convertToBackendJSONWithRules } from '@/factories/convertJSON';

import {
  enhanceElementsWithStrategyEvents,
  enhanceResourcesWithMetadataExtras,
  SELECT_EDITING_RESOURCE_PROPERTY,
} from '@/factories/strategyFactory';

import { EDITMETADATA_CLEAR_PREVIEW, eventBus } from '@/factories/eventBus';
import { parseBytes } from '@/factories/resourceHelpers.ts';

export class ResourcesListViewModel extends AbstractEditViewModel {
  declare resources: Resource[];

  declare datasetId: string;

  declare signedInUser: User;
  declare signedInUserOrganizationIds: string[];

  validationErrors: {
    resources: string | null;
  } = {
    resources: null,
  };

  validationRules = yup.object().shape({
    resources: yup.array().nullable(),
  });

  constructor(datasetModel: DatasetModel) {
    super(datasetModel, ResourcesListViewModel.mappingRules());
  }

  // TODO Check with Dominik, this was added to fix an issue with validation at first load
  override getModelDataForInit() {
    return { resources: this.resources ?? [] };
  }

  getFormattedResources(
    rawResources: ResourceDTO[],
    datasetName: string,
    organizationID: string,
    signedInUserName: string,
    signedInUserOrganizationIds: string[],
    numberOfDownload?: number,
  ): Resource[] {
    return rawResources?.map((rawResource: ResourceDTO) => {
      const customFieldsVm = this.datasetModel.getViewModel('CustomFieldsViewModel');

      const res = ResourceViewModel.getFormattedResource(
        rawResource,
        datasetName,
        organizationID,
        signedInUserName,
        signedInUserOrganizationIds,
        numberOfDownload,
      );

      res.deprecated = customFieldsVm?.isResourceDeprecated(res.id);

      return res;
    });
  }

  private convertDatesToBackendFormat(resource: Resource) {
    resource.created = resource.created ? formatDateTimeToCKANFormat(resource.created) : '';
    resource.lastModified = resource.lastModified ? formatDateTimeToCKANFormat(resource.lastModified) : '';
    resource.metadataModified = resource.metadataModified ? formatDateTimeToCKANFormat(resource.metadataModified) : '';
  }

  get backendJSON() {
    const backendResources = this.resources?.map((frontendRes: Resource) => {
      this.convertDatesToBackendFormat(frontendRes);

      const formattedSize = `${frontendRes.size} ${frontendRes.sizeFormat}`;
      const sizeInBytes = parseBytes(formattedSize);

      const jsonBackendResource = convertToBackendJSONWithRules(ResourceViewModel.mappingRules(), {
        ...frontendRes,
        size: sizeInBytes,
      }) as ResourceDTO;

      // @ts-expect-error
      jsonBackendResource.resource_size = convertToBackendJSONWithRules(ResourceViewModel.sizeMappingRules(), {
        sizeValue: frontendRes.size,
        sizeUnits: frontendRes.sizeFormat,
      });

      // here the resourceSize gets convert into a string
      return stringifyResourceForBackend(jsonBackendResource);
    });

    return convertJSON({ resources: backendResources }, false);
  }

  /**
   * OVERRIDE the method to make use of the ResourceViewModel mappingRules
   * for individual resource
   * @param dataset
   */
  updateModel(dataset: DatasetDTO | undefined) {
    if (!dataset) {
      // make sure to initialize for validations to work
      Object.assign(this, {
        resources: [],
        datasetId: undefined,
      });
      return;
    }

    /*
        const resourceData = createResources(
          dataset,
          this.signedInUser,
          this.signedInUserOrganizationIds,
        );
    */

    const cleanResources = this.getFormattedResources(
      dataset.resources,
      dataset.name,
      dataset.organization?.id,
      this.signedInUser?.fullName,
      this.signedInUserOrganizationIds,
    );

    enhanceElementsWithStrategyEvents(cleanResources, SELECT_EDITING_RESOURCE_PROPERTY);

    enhanceResourcesWithMetadataExtras(dataset.extras, cleanResources);

    Object.assign(this, {
      resources: cleanResources,
      datasetId: dataset.id,
    });
  }

  validate(newProps?: Partial<ResourcesListViewModel>): boolean {
    return super.validate(newProps);
  }

  async save(newData: any): Promise<boolean> {
    if (newData?.resources) {
      const newResource = newData.resources.filter((res: Resource) => res.id === METADATA_NEW_RESOURCE_ID)[0];

      if (newResource) {
        this.loading = true;

        const model = new ResourceViewModel();
        await model.save(newResource);

        // the resourceModel is updated with the latest content of the backend
        // (further details of the resource)
        await this.datasetModel.createResourceOnExistingDataset(model);

        eventBus.emit(EDITMETADATA_CLEAR_PREVIEW);

        // when everything is updated, selected the latest resource for
        // editing details (e.g. the user should change the name)
        model.isSelected = true;

        this.loading = false;
        return true;
      }
    }

    return super.save(newData);
  }

  getData() {
    return {
      resources: this.resources,
    };
  }

  static mappingRules() {
    return [
      ['resources', 'resources'],
      ['datasetId', 'id'],
      ['resourceTypeGeneral', 'resource_type_general'], // only need to pass the default 'dataset' to the backend
    ];
  }
}
