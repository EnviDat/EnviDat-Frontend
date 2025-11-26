import * as yup from 'yup';

import { Resource, User } from '@/types/modelTypes';
import { type DatasetDTO, ResourceDTO } from '@/types/dataTransferObjectsTypes';
import { ResourceViewModel } from '@/modules/workflow/viewModel/ResourceViewModel.ts';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel';

import { convertJSON } from '@/factories/convertJSON';

import { ViewModelSaveEvent } from '@/types/workflow';
import { IsDeprecatedResource } from '@/modules/workflow/viewModel/CustomFieldsViewModel.ts';
import { RESOURCE_FORMAT_LINK } from '@/factories/metadataConsts';

export class ResourcesListViewModel extends AbstractEditViewModel {
  // declare resources: Resource[];
  declare resources: ResourceViewModel[];

  declare datasetId: string;

  declare signedInUser: User;
  declare signedInUserOrganizationIds: string[];

  private isDeprecatedResource: IsDeprecatedResource;

  validationErrors: {
    resources: string | null;
  } = {
    resources: null,
  };

  validationRules = yup.object().shape({
    resources: yup.array().nullable(),
  });

  constructor(
    dataset: DatasetDTO | undefined,
    saveEventHook: ViewModelSaveEvent | undefined,
    isDeprecatedResource: IsDeprecatedResource,
  ) {
    // don't provide the mappingRules initially, because for the mapping
    // needs the isDeprecatedResource method
    super(dataset, saveEventHook, undefined);

    this.isDeprecatedResource = isDeprecatedResource;

    this.mappingRules = ResourcesListViewModel.mappingRules();
    if (this.mappingRules) {
      this.updateModel(dataset);
    }
  }

  // TODO Check with Dominik, this was added to fix an issue with validation at first load
  override getModelDataForInit() {
    return { resources: this.resources ?? [] };
  }

  static createNewBaseResource(datasetId: string) {
    return {
      description: '',
      doi: '',
      format: '',
      hast: '',
      id: '',
      lastModified: '',
      mimetype: null,
      mimetypeInner: null,
      name: '',
      packageId: datasetId,
      position: 0,
      resourceSize: {
        sizeUnits: 'kb',
        sizeValue: '',
      },
      resourceType: null,
      restricted: {
        allowedUsers: '',
        sharedSecret: '',
        level: 'public',
      },
      size: null,
      state: '',
      url: '',
      urlType: null,
    };
  }

  static createNewResourceForUrl(datasetId: string, url: string) {
    const cleanUrlForName = url.endsWith('/') ? url.substring(0, url.length - 1) : url;
    const splits = cleanUrlForName.split('/');
    const resourceName = splits.length > 0 ? splits[splits.length - 1] : url;

    const baseResourceProperties = ResourcesListViewModel.createNewBaseResource(datasetId);

    return {
      ...baseResourceProperties,
      url,
      format: RESOURCE_FORMAT_LINK,
      size: 1,
      sizeFormat: 'B',
      name: resourceName,
    };
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
      const res = ResourceViewModel.getFormattedResource(
        rawResource,
        datasetName,
        organizationID,
        signedInUserName,
        signedInUserOrganizationIds,
        numberOfDownload,
      );

      res.deprecated = this.isDeprecatedResource(res.id);

      return res;
    });
  }

  get backendJSON() {
    const backendResources = this.resources?.map((resVm) => {
      return resVm.backendJSON;
    });

    return convertJSON({ resources: backendResources }, false);

    /*
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
    */
  }

  /**
   * OVERRIDE the method to make use of the ResourceViewModel mappingRules
   * for individual resource
   * @param dataset
   */
  updateModel(dataset: DatasetDTO | undefined) {
    if (!dataset) {
      this.datasetId = undefined;
      this.resources = undefined;

      /*
      // make sure to initialize for validations to work
      Object.assign(this, {
        resources: [],
        datasetId: undefined,
      });
*/

      return;
    }

    this.datasetId = dataset.id;
    const newVms = [];

    for (const rawResource of dataset.resources) {
      // don't provide an saveEvent, saving is done within this viewModel (ResourceListViewModel)
      const resVM = new ResourceViewModel(rawResource, undefined);
      resVM.deprecated = this.isDeprecatedResource(rawResource.id);

      resVM.updateResourceModel(
        rawResource,
        dataset.name,
        dataset.extras,
        dataset.organization?.id,
        this.signedInUser?.fullName,
        this.signedInUserOrganizationIds,
      );
      newVms.push(resVM);
    }

    this.resources = newVms;

    /*
    const cleanResources = this.getFormattedResources(
      dataset.resources,
      dataset.name,
      dataset.organization?.id,
      this.signedInUser?.fullName,
      this.signedInUserOrganizationIds,
    );

    enhanceElementsWithStrategyEvents(cleanResources, SELECT_EDITING_RESOURCE_PROPERTY, true);

    enhanceResourcesWithMetadataExtras(dataset.extras, cleanResources);

    Object.assign(this, {
      resources: cleanResources,
      datasetId: dataset.id,
    });
*/
  }

  validate(newProps?: Partial<ResourcesListViewModel>): boolean {
    return super.validate(newProps);
  }

  static mappingRules() {
    return [
      ['resources', 'resources'],
      ['datasetId', 'id'],
      ['resourceTypeGeneral', 'resource_type_general'], // only need to pass the default 'dataset' to the backend
    ];
  }
}
