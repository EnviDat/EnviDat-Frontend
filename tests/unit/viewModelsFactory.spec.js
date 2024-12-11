import { it, describe, expect } from 'vitest';
import { createHeaderViewModel } from '@/factories/ViewModels/HeaderViewModel';
import { EDITMETADATA_MAIN_HEADER } from '@/factories/eventBus';
import { convertJSON } from '@/factories/mappingFactory';

import { watch } from 'vue';
import { METADATA_TITLE_PROPERTY } from '@/factories/metadataConsts';
import metadatas from '../../stories/js/metadata';

describe('viewModel Factory ', () => {

  const datasetBackend = metadatas[metadatas.length - 1];
  const backendJSON = convertJSON(datasetBackend, false);

  const headerVM = createHeaderViewModel(backendJSON);

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

  it(`${EDITMETADATA_MAIN_HEADER} frontendJSON`, () => {

    const props = headerVM.frontendProperties;

    Object.keys(headerVM).forEach((key) => {

      expect(props.includes(key), `${key} not in headerVM props`)
      expect(headerVM[key], `${key} has no value in headerVM`).toBeDefined();
    })

  });

  it(`${EDITMETADATA_MAIN_HEADER} reactivity of ${METADATA_TITLE_PROPERTY}`, () => {

    watch(() => headerVM[METADATA_TITLE_PROPERTY], (newValue, oldValue) => {
      expect(newValue).toBeDefined();
      expect(newValue).not.toBe(oldValue);
    })

    // console.log('testing reactivity before change', headerVM[METADATA_TITLE_PROPERTY]);

    headerVM[METADATA_TITLE_PROPERTY] = 'Some new title for testing';

    // console.log('testing reactivity after change', headerVM[METADATA_TITLE_PROPERTY]);

  });

});
