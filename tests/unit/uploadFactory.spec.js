import { it, describe, expect } from 'vitest';
import {
  addFile,
  getUppyInstance, subscribeOnUppyEvent,
} from '@/factories/uploadFactory';

const fs = require('fs');


describe('uploadFactory - renderMarkdown', () => {

  it('renderMarkdown - getUppyInstance() no apiKey', () => {

    const uppy = getUppyInstance();
    const uppy2 = getUppyInstance();

    expect(uppy).toBeDefined();
    expect(uppy2).toBeDefined();
    expect(uppy.id).toEqual(uppy2.id);
  });

  it('renderMarkdown - subscribe on events', () => {

    const filePath = `${__dirname}/../../src/assets/`;
    const pngFile = 'noisy_pattern.png';

    const dataString = fs.readFileSync(`${filePath}${pngFile}`);

    const uppy = getUppyInstance();

    subscribeOnUppyEvent('file-added', (file) => {
      console.log(`added file: ${file.name}`);
      expect(file).toBeDefined();
    })

    // addFile(pngFile, filePath, dataString);


  });

});

/*
describe('stringFactory - stripMarkdown', () => {

  it('stripMarkdown - empty', () => {

    const emptyOutput = stripMarkdown();
    expect(emptyOutput).toBe('');
  });


});
*/

