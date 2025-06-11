import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { DatasetViewModel } from '@/modules/workflow/viewModel/DatasetViewModel.ts';
import { Resource, Resource } from '@/types/modelTypes';
import { convertToFrontendJSONWithRules } from '@/factories/mappingFactory';


const convertEmptyStringToNull = (value: string, originalValue: string) =>
  originalValue === '' ? null : value;

const convertToZero = (value: unknown) => (Number.isNaN(value) ? 0 : value);


export class EditResourceViewModel extends AbstractEditViewModel implements Resource {

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
  declare position: number;

  declare resourceSize: string;
  declare resourceType: string;
  declare restricted: string;

  declare size: number;
  declare sizeFormat: string;
  declare state: string;

  declare url: string;
  declare urlType: string;

  declare deprecated: boolean;
  declare isSelected: boolean;


  declare validationErrors: {
    name: string,
    description: string,
    format: string,
    size: string,
    sizeFormat: string,
    url: string,
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
  }


  constructor(datasetViewModel: DatasetViewModel) {
    super(datasetViewModel, EditResourceViewModel.mappingRules());


    this.validationErrors = {
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
    }

    this.validationRules =
      yup.object().shape({
        // isLink: yup.boolean(),
        name: yup
          .string()
          .required('Resource name is required')
          .min(5, 'Resource name must be at least 5 characters')
          .notOneOf(
            [yup.ref('url')],
            'Title cannot be the same as the resource url',
          ),
        description: yup
          .string()
          .nullable()
          .transform(convertEmptyStringToNull)
          .min(20, 'Write at least a minimal description with 20 characters.'),
        format: yup
          .string()
          .nullable()
          .min(1, 'Format has to be at least 1 characters long.'),
        size: yup
          // .number('size must be a number')
          .number()
          .transform(convertToZero)
          .test(
            'empty-check',
            'File size must be a number greater than 0',
            size => size !== 0,
          )
          .moreThan(0, 'File size be more than 0'),
        sizeFormat: yup.string().required('Pick a file size'),
        url: yup.string().when('isLink', {
          is: true,
          then: yup
            .string()
            .url('Resource url must be valid')
            .required('Resource url is required'),
          otherwise: yup.string().notRequired(),
        }),
      });
  }

  static getFormattedResource(rawResource: any) : Resource {
    return convertToFrontendJSONWithRules(EditResourceViewModel.mappingRules(), rawResource) as Resource;
  }

  static mappingRules () {
    return [
      ['datasetId','package_id'],
      ['cacheLastUpdated','cache_last_updated'],
      ['cacheUrl','cache_url'],
      ['created','created'],
      ['description','description'],
      ['doi','doi'],
      ['format','format'],
      ['hash','hash'],
      ['id','id'],
      ['lastModified','last_modified'],
      ['mimetype','mimetype'],
      ['mimetypeInner','mimetype_inner'],
      ['metadataModified','metadata_modified'],
      ['multipartName','multipart_name'],
      ['name','name'],
      // ['packageId','package_id'], // keep it for compatiblity reasons?
      ['position','position'],
      ['restricted','restricted'],
      ['resourceSize','resource_size'],
      ['resourceType','resource_type'],
      ['size','size'],
      ['state','state'],
      ['url','url'],
      ['urlType','url_type'],
    ];
  }

  validate(newProps?: Partial<EditResourceViewModel>): boolean {
    return super.validate(newProps);
  }
}

