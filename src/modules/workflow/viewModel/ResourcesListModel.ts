import * as yup from 'yup';

import { Resource, User } from '@/types/modelTypes';
import { type DatasetDTO, ResourceDTO } from '@/types/dataTransferObjectsTypes';
import {  ResourceModel } from '@/modules/workflow/viewModel/ResourceModel.ts';
import { DatasetViewModel } from '@/modules/workflow/viewModel/DatasetViewModel';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel';
import { METADATA_NEW_RESOURCE_ID } from '@/factories/metadataConsts';
import { convertJSON, convertToBackendJSONWithRules } from '@/factories/mappingFactory';
import { enhanceElementsWithStrategyEvents } from '@/factories/strategyFactory';
import { createResources } from '@/factories/metaDataFactory.ts';


export class ResourcesListModel extends AbstractEditViewModel {

  declare resources: Resource[];

  declare datasetId: string;

/*
  declare signedInUser: User;
  declare signedInUserOrganizationIds: string[];
*/

  declare validationErrors: {
    resources: string;
  };

  constructor(datasetViewModel: DatasetViewModel) {
    super(datasetViewModel, ResourcesListModel.mappingRules());


    this.validationErrors = {
      resources: null,
    };

    this.validationRules = yup.object().shape({
      resources: yup.array().min(1, 'Add at least one resource.'),
    });
  }

  static getFormattedResources(rawResources: ResourceDTO[]): Resource[] {
    return rawResources.map((rawResource) =>
      ResourceModel.getFormattedResource(rawResource),
    );
  }


  get backendJSON() {
    const rawResources = this.resources?.map((cleanResource) =>
      convertToBackendJSONWithRules(
        ResourceModel.mappingRules(),
        cleanResource,
      ),
    );

    return convertJSON({ resources: rawResources }, false);
  }

  /**
   * OVERRIDE the method to make use of the ResourceModel mappingRules
   * for individual resource
   * @param dataset
   */
  updateModel(dataset: DatasetDTO) {

    const resourceData = createResources(
      dataset,
/*
      this.signedInUser,
      this.signedInUserOrganizationIds,
*/
    );

/*
    const cleanResources = ResourcesListModel.getFormattedResources(dataset.resources);
*/

    enhanceElementsWithStrategyEvents(
      resourceData.resources,
      undefined,
      true,
    );

    Object.assign(this, { resources: resourceData.resources });
  }


  validate(newProps?: Partial<ResourcesListModel>): boolean {
    return super.validate(newProps);
  }

  async save(newData: any): Promise<boolean> {

    if (newData?.resources) {

      const newResource = newData.resources.filter((res: Resource) => res.id === METADATA_NEW_RESOURCE_ID)[0];

      if (newResource) {
        this.loading = true;

        const model = new ResourceModel();
        await model.save(newResource);

        // the resourceModel is updated with the latest content of the backend
        // (further deails of the resource)
        await this.datasetViewModel.createResourceOnExistingDataset(model);

        // this will also update all viewModels with the content from the backend
        // including this one
        await this.datasetViewModel.reloadDataset();

        // when everything is updated, selected the latest resource for
        // editing details (e.g. the user should change the name)
        model.isSelected = true;

        this.loading = false;
        return true;
      }

      return super.save(newData);
    }

    return super.save(newData);
  }

  static mappingRules() {
    return [
      ['resources', 'resources'],
      ['datasetId', 'id'],
    ];
  }
}

