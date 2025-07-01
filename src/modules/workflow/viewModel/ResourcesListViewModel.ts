import * as yup from 'yup';

import { Resource, User } from '@/types/modelTypes';
import { type DatasetDTO, ResourceDTO } from '@/types/dataTransferObjectsTypes';
import { ResourceViewModel } from '@/modules/workflow/viewModel/ResourceViewModel.ts';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel';
import { METADATA_NEW_RESOURCE_ID } from '@/factories/metadataConsts';
import {
  convertJSON,
  convertToBackendJSONWithRules,
} from '@/factories/mappingFactory';
import {
  enhanceElementsWithStrategyEvents,
  enhanceResourcesWithMetadataExtras,
  SELECT_EDITING_RESOURCE_PROPERTY,
} from '@/factories/strategyFactory';
import { EDITMETADATA_CLEAR_PREVIEW, eventBus } from '@/factories/eventBus';


export class ResourcesListViewModel extends AbstractEditViewModel {
  declare resources: Resource[];

  declare datasetId: string;

  declare signedInUser: User;
  declare signedInUserOrganizationIds: string[];

  declare validationErrors: {
    resources: string;
  };

  constructor(datasetViewModel: DatasetModel) {
    super(datasetViewModel, ResourcesListViewModel.mappingRules());

    this.validationErrors = {
      resources: null,
    };

    this.validationRules = yup.object().shape({
      resources: yup.array().required().min(1, 'Add at least one resource.'),
    });
  }

  static getFormattedResources(
    rawResources: ResourceDTO[],
    datasetName: string,
    organizationID: string,
    signedInUserName: string,
    signedInUserOrganizationIds: string[],
    numberOfDownload?: number,
  ): Resource[] {

    return rawResources?.map((rawResource: ResourceDTO) => {
        const res = ResourceViewModel.getFormattedResource(
          rawResource,
          datasetName,
          organizationID,
          signedInUserName,
          signedInUserOrganizationIds,
          numberOfDownload,
        );

        return res;
      },
    );
  }

  get backendJSON() {
    const rawResources = this.resources?.map((cleanResource) =>
      convertToBackendJSONWithRules(
        ResourceViewModel.mappingRules(),
        cleanResource,
      ),
    );

    return convertJSON({ resources: rawResources }, false);
  }

  /**
   * OVERRIDE the method to make use of the ResourceViewModel mappingRules
   * for individual resource
   * @param dataset
   */
  updateModel(dataset: DatasetDTO | undefined) {

    if (!dataset) {
      // make sure to initialize for validations to work
      Object.assign(this, { resources: []});
      return;
    }

    /*
        const resourceData = createResources(
          dataset,
          this.signedInUser,
          this.signedInUserOrganizationIds,
        );
    */

    const cleanResources = ResourcesListViewModel.getFormattedResources(
      dataset.resources,
      dataset.name,
      dataset.organization?.id,
      this.signedInUser?.name,
      this.signedInUserOrganizationIds,
    );

    enhanceElementsWithStrategyEvents(
      cleanResources,
      SELECT_EDITING_RESOURCE_PROPERTY,
      true,
    );

    enhanceResourcesWithMetadataExtras(
      dataset.extras,
      cleanResources,
    );

    Object.assign(this, { resources: cleanResources });
  }

  validate(newProps?: Partial<ResourcesListViewModel>): boolean {
    return super.validate(newProps);
  }

  async save(newData: any): Promise<boolean> {
    if (newData?.resources) {
      const newResource = newData.resources.filter(
        (res: Resource) => res.id === METADATA_NEW_RESOURCE_ID,
      )[0];

      if (newResource) {
        this.loading = true;

        const model = new ResourceViewModel();
        await model.save(newResource);

        // the resourceModel is updated with the latest content of the backend
        // (further deails of the resource)
        await this.datasetViewModel.createResourceOnExistingDataset(model);

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
