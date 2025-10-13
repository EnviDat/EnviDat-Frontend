import { it, describe, expect } from 'vitest';
import { createHeaderViewModel } from '@/factories/ViewModels/HeaderViewModel';
import { EDITMETADATA_MAIN_HEADER } from '@/factories/eventBus';
import { convertJSON } from '@/factories/mappingFactory';
import { BackendDatasetService } from '@/modules/workflow/BackendDatasetService.ts';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';

import {
  METADATA_TITLE_PROPERTY,
} from '@/factories/metadataConsts';

import metadatas from '@/../stories/js/metadata';


describe('viewModel Factory ', () => {

  const datasetBackend = metadatas[metadatas.length - 1];
  const backendJSON = convertJSON(datasetBackend, false);

  const headerVM = createHeaderViewModel(backendJSON, false, 'black', 'url/to/an/img');

  const serviceLayer = new BackendDatasetService(datasetBackend)
  const datasetVM = new DatasetModel(serviceLayer);

  it('HeaderViewModel backendJSON', () => {

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

  it('EditHeaderViewModel reactivity', () => {

    const instances = datasetVM.viewModels;
    const vm = instances.get('EditHeaderViewModel');

    expect(vm).toBeDefined();

    vm.metadataTitle = 'Some Title';
    vm.metadataUrl = 'some-title';
    vm.contactEmail = 'dominik.haas@wsl.ch';
    vm.contactFirstName = 'Dominik';
    vm.contactLastName = 'Haas';

    const valid = vm.validate();

    expect(valid).toBeTruthy();

    // serviceLayer.datasetDTO.unsubscribeFromViewModels();
  });

  it('EditKeywordsViewModel reactivity', () => {

    const instances = datasetVM.viewModels;
    const vm = instances.get('EditKeywordsViewModel');

    expect(vm).toBeDefined();
    expect(vm.keywords).toBeDefined();
    expect(vm.metadataTitle).toBeDefined();
    expect(vm.metadataDescription).toBeDefined();

    expect(vm.validate()).toBeTruthy();

    // serviceLayer.datasetDTO.unsubscribeFromViewModels();
  });
  

});
