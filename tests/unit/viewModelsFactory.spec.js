import { it, describe, expect } from 'vitest';
import { createHeaderViewModel } from '@/factories/ViewModels/HeaderViewModel';
import { EDITMETADATA_MAIN_HEADER } from '@/factories/eventBus';
import { convertJSON } from '@/factories/mappingFactory';

import {
  METADATA_CONTACT_EMAIL,
  METADATA_CONTACT_FIRSTNAME,
  METADATA_CONTACT_LASTNAME,
  METADATA_TITLE_PROPERTY,
} from '@/factories/metadataConsts';

import { EditDatasetServiceLayer } from '@/factories/ViewModels/EditDatasetServiceLayer';

import metadatas from '../../stories/js/metadata';


describe('viewModel Factory ', () => {

  const datasetBackend = metadatas[metadatas.length - 1];
  const backendJSON = convertJSON(datasetBackend, false);

  const headerVM = createHeaderViewModel(backendJSON, false, 'black', 'url/to/an/img');

  it(`${EDITMETADATA_MAIN_HEADER} backendJSON`, () => {

    expect(headerVM).toBeDefined();

    const datasetProps = Object.keys(backendJSON);
    const backendHeader = headerVM.backendJSON;

    Object.keys(backendHeader)
      .forEach((key) => {
        expect(datasetProps.includes(key), `${key} not in datasetProps`)
          .toBeDefined();
      })
  });

/*
  it(`${EDITMETADATA_MAIN_HEADER} frontendJSON`, () => {

    const props = headerVM.frontendProperties;

    Object.keys(headerVM).forEach((key) => {

      expect(props.includes(key), `${key} not in headerVM props`)
      expect(headerVM[key], `${key} has no value in headerVM`).toBeDefined();
    })
  });
*/

  it(`${EDITMETADATA_MAIN_HEADER} reactivity of ${METADATA_TITLE_PROPERTY}`, () => {

    const callback = (newModel) => {
      expect(newModel).toBeDefined();
      expect(newModel[METADATA_TITLE_PROPERTY]).toBe('Some new title for testing');
    }

    const headerVM2 = createHeaderViewModel(backendJSON, false, 'black', 'url/to/an/img', callback);
    headerVM2[METADATA_TITLE_PROPERTY] = 'Some new title for testing';
  });

  it(`${EDITMETADATA_MAIN_HEADER} reactivity`, () => {

    const serviceLayer = new EditDatasetServiceLayer(datasetBackend)

    const instances = serviceLayer.viewModels;

    const vm = instances.get('EditHeaderViewModel');

    expect(vm).toBeDefined();

    vm[METADATA_CONTACT_EMAIL] = 'dominik.haas@wsl.ch';
    vm[METADATA_CONTACT_FIRSTNAME] = 'Dominik';
    vm[METADATA_CONTACT_LASTNAME] = 'Haas';

    // serviceLayer.datasetDTO.unsubscribeFromViewModels();
  });

});
