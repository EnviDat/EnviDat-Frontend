import { it, describe, expect } from 'vitest';

import {
  getPreviewStrategy,
} from '@/factories/strategyFactory';


// import dataset from '@/../public/testdata/testResoures';

describe('PreviewStrategies - getPreviewStrategy()', () => {
  it('empty', () => {

    const strategy = getPreviewStrategy();

    expect(strategy).toBeNull();
  });

  it('text file extension .txt', () => {

    const strategy = getPreviewStrategy('txt');

    expect(strategy).toBeDefined();
    expect(strategy.fileExtensions).toBeDefined();
    expect(strategy.component).toBeDefined();
    expect(strategy.openEvent).toBeDefined();
    expect(strategy.injectEvent).toBeDefined();
  });

  it('markdown file extension .md', () => {

    const strategy = getPreviewStrategy('md');

    expect(strategy).toBeDefined();
    expect(strategy.fileExtensions).toBeDefined();
    expect(strategy.component).toBeDefined();
    expect(strategy.openEvent).toBeDefined();
    expect(strategy.injectEvent).toBeDefined();
  });

  it('unkown file extension .xyz', () => {

    const strategy = getPreviewStrategy(['xyz']);

    expect(strategy).toBeNull();
  });

});
