import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { Resource } from '@/types/modelTypes';
import { convertToFrontendJSONWithRules } from '@/factories/convertJSON';
import { ResourceDTO } from '@/types/dataTransferObjectsTypes';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';
import { getResourceName, mergeResourceSizeForFrontend } from '@/factories/resourceHelpers';
import { formatDate } from '@/factories/dateFactory';
import { isFieldValid } from '@/factories/userEditingValidations';

const convertEmptyStringToNull = (value: string, originalValue: string) => (originalValue === '' ? null : value);

const convertToZero = (value: unknown) => (Number.isNaN(value) ? 0 : value);

export class ResourceViewModel extends AbstractEditViewModel implements Resource {
  declare datasetId: string;
  declare description: string;

  declare id: string;
  declare doi: string;
  declare format: string;

  declare created: string;
  declare lastModified: string;
  declare metadataModified: string;

  declare mimetype: string;
  declare mimetypeInner: string;

  declare multipartName: string;
  declare name: string;
  declare packageId: string;
  declare position: number;

  declare resourceSize: string;
  declare resourceType: string;
  declare restricted: string;
  declare restrictedUrl: string;

  declare size: number;
  declare sizeFormat: string;
  declare state: string;

  declare url: string;
  declare urlType: string;

  declare numberOfDownload: number;

  declare deprecated: boolean;
  declare isProtected: boolean;
  declare isSelected: boolean;
  declare previewUrl: string;

  declare chartData: any[];
  declare chartDataLoading: boolean;
  declare chartLabels: string[];

  declare clickEvent: string;
  declare openProperty: string;
  declare openButtonIcon: string;
  declare openButtonTooltip: string;

  validationErrors: {
    name: string | null;
    description: string | null;
    format: string | null;
    size: string | null;
    sizeFormat: string | null;
    url: string | null;
    /*
    cacheLastUpdated: string,
    cacheUrl: string,
    id: string,
    datasetId: string,
    doi: string,
    urlType: string,
    created: string,
    lastModified: string,
    mimetype: string,
    mimetypeInner: string,
    metadataModified: string,
    multipartName: string,
    position: string,
    restricted: string,
    resourceSize: string,
    resourceType: string,
    state: string,
*/
  } = {
    name: null,
    description: null,
    format: null,
    size: null,
    sizeFormat: null,
    url: null,
    /*
          datasetId: null,
          cacheLastUpdated: null,
          cacheUrl: null,
          id: null,
          doi: null,
          urlType: null,
          created: null,
          lastModified: null,
          mimetype: null,
          mimetypeInner: null,
          metadataModified: null,
          multipartName: null,
          position: null,
          restricted: null,
          resourceSize: null,
          resourceType: null,
          state: null,
    */
  };

  validationRules = yup.object().shape({
    // isLink: yup.boolean(),
    name: yup
      .string()
      .required('Resource name is required')
      .min(5, 'Resource name must be at least 5 characters')
      .notOneOf([yup.ref('url')], 'Title cannot be the same as the resource url'),
    description: yup
      .string()
      .nullable()
      .transform(convertEmptyStringToNull)
      .min(20, 'Write at least a minimal description with 20 characters.'),
    format: yup.string().nullable().min(1, 'Format has to be at least 1 characters long.'),
    size: yup
      // .number('size must be a number')
      .number()
      .transform(convertToZero)
      .test('empty-check', 'File size must be a number greater than 0', (size) => size !== 0)
      .moreThan(0, 'File size be more than 0'),
    sizeFormat: yup.string().required('Pick a file size'),
    url: yup.string().when('isLink', {
      is: true,
      then: yup.string().url('Resource url must be valid').required('Resource url is required'),
      otherwise: yup.string().notRequired(),
    }),
  });

  /**
   * @param datasetModel is optional, if not provided it can be used "isolated" just for other
   * UI-components to validate and store infos
   */
  constructor(datasetModel?: DatasetModel | undefined) {
    // intentionally not providing the datasetModel, because resource have to be unpacked
    // from the list of resources, done in the ResourceListModel
    super(datasetModel, ResourceViewModel.mappingRules());
  }

  static getFormattedResource(
    rawResource: ResourceDTO,
    datasetName: string,
    organizationID: string,
    signedInUserName: string,
    signedInUserOrganizationIds: string[],
    numberOfDownload?: number,
  ): Resource {
    const frontendResource = convertToFrontendJSONWithRules(ResourceViewModel.mappingRules(), rawResource) as Resource;

    /*
    const isProtected = isResourceProtectedForUser(
      rawResource,
      organizationID,
      signedInUserName,
      signedInUserOrganizationIds,
    );
*/

    const fileFormat = rawResource.format ? rawResource.format : '';
    const format = fileFormat.replace('.', '').toLowerCase();

    const created = formatDate(frontendResource.created);
    const lastModified = formatDate(frontendResource.lastModified);
    const metadataModified = formatDate(frontendResource.metadataModified);

    const backendDomain = process.env.VITE_API_ROOT;

    let mergedSize = {};
    try {
      mergedSize = mergeResourceSizeForFrontend(frontendResource);
    } catch (e) {
      console.error('mergeResourceSizeForFrontend failed:');
      console.error(e);
      // TODO Error tracking
    }

    return {
      ...frontendResource,
      name: getResourceName(rawResource),
      restrictedUrl: `${backendDomain}/dataset/${datasetName}/restricted_request_access/${rawResource.id}`,
      format,
      created,
      lastModified,
      metadataModified,
      ...mergedSize,
      deprecated: false,
      numberOfDownload: numberOfDownload || 0,
      isProtected: false,
      previewUrl: undefined,
      chartLabels: undefined,
      chartData: undefined,
      chartDataLoading: false,
    };
  }

  static mappingRules() {
    return [
      ['datasetId', 'package_id'],
      ['cacheLastUpdated', 'cache_last_updated'],
      ['cacheUrl', 'cache_url'],
      ['created', 'created'],
      ['description', 'description'],
      ['doi', 'doi'],
      ['format', 'format'],
      ['hash', 'hash'],
      ['id', 'id'],
      ['lastModified', 'last_modified'],
      ['mimetype', 'mimetype'],
      ['mimetypeInner', 'mimetype_inner'],
      ['metadataModified', 'metadata_modified'],
      ['multipartName', 'multipart_name'],
      ['name', 'name'],
      ['packageId', 'package_id'],
      ['position', 'position'],
      ['restricted', 'restricted'],
      ['resourceSize', 'resource_size'],
      ['resourceType', 'resource_type'],
      ['size', 'size'],
      ['state', 'state'],
      ['url', 'url'],
      ['urlType', 'url_type'],
    ];
  }

  /**
   * Overwrite the super.validate() because here we need to take over all
   * properties first no matter which get validated
   * */
  validate(newProps?: Partial<ResourceViewModel>): boolean {
    const source = newProps ?? this;

    // to take over all properties so no to lose props
    // which don't have any validation rules defined
    Object.assign(this, source);

    const propsToValidate = this.getPropsToValidate(source);
    let allValid = true;

    for (const [field, value] of Object.entries(propsToValidate)) {
      const ok = isFieldValid(field, value, this.validationRules, this.validationErrors);

      if (!ok) allValid = false;
    }

    return allValid;
  }
}
