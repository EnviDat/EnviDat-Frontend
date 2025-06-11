import * as yup from 'yup';

import { Resource } from '@/types/modelTypes';
import { ResourceDTO } from '@/types/dataTransferObjectsTypes';
import {  ResourceModel } from '@/modules/workflow/viewModel/ResourceModel.ts';
import { DatasetViewModel } from '@/modules/workflow/viewModel/DatasetViewModel';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel';


export class ResourcesListModel extends AbstractEditViewModel {

  declare resources: Resource[];

  declare validationErrors: {
    resources: string;
  };

  constructor(datasetViewModel: DatasetViewModel) {
    // don't provide dataset and mapping rules because resources
    // would get partially unpacked and then the unpacking of the full list
    // doesn't work anymore
    super(datasetViewModel);
    // super(datasetViewModel, EditAuthorListViewModel.mappingRules());
    // manually assign it
    this.privateMappingRules = ResourcesListModel.mappingRules();

    if (datasetViewModel?.dataset?.resources) {
      this.resources = ResourcesListModel.getFormattedResources(datasetViewModel.dataset.resources);
    } else {
      this.resources = [];
    }

    this.validationErrors = {
      resources: null,
    };

    this.validationRules = yup.object().shape({
      resources: yup.array().min(1, 'Add at least one resource.'),
    });
  }

  static getFormattedResources(rawResources: ResourceDTO[]): Resource[] {
    return rawResources.map((rawResource) => ResourceModel.getFormattedResource(rawResource));
  }

/*
  getEditResourceViewModels(validateViewModels: boolean): EditResourceViewModel[] | undefined {
    const rawResources = this.datasetViewModel.dataset.resources;

    const resources: Resource[] = EditResourcesListViewModel.getFormattedResources(rawResources);

    return resources?.map((resource) => {
      const vm = createAuthorViewModel(resource);
      if (validateViewModels) {
        vm.validate();
      }
      return vm;
    });
  }
*/

  validate(newProps?: Partial<ResourcesListModel>): boolean {
    return super.validate(newProps);
  }


  static mappingRules() {
    return [['resources', 'resources']];
  }
}

