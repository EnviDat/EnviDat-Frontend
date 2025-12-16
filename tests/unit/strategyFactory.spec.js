import { it, describe, expect } from 'vitest';

import {
  getClickEventStrategy,
  getPreviewComponent,
  SELECT_EDITING_AUTHOR_PROPERTY,
  SELECT_EDITING_DATASET_PROPERTY,
  SELECT_EDITING_RESOURCE_PROPERTY,
  SHOW_DATA_PREVIEW_PROPERTY,
} from '@/factories/strategyFactory.ts';

// import dataset from '@/../public/testdata/testResoures';

const allPreviewComponentKeys = [
  'txt',
  'md',
  'jpg',
  'png',
  'jpeg',
  'gif',
  'webp',
  'mp4',
  'avi',
  'mpeg',
  SHOW_DATA_PREVIEW_PROPERTY,
  'csv',
];

const allClickStragetiesKeys = [
  'txt',
  'md',
  'jpg',
  'png',
  'jpeg',
  'gif',
  'webp',
  'mp4',
  'avi',
  'mpeg',
  SHOW_DATA_PREVIEW_PROPERTY,
  'csv',
  SELECT_EDITING_RESOURCE_PROPERTY,
  SELECT_EDITING_AUTHOR_PROPERTY,
  SELECT_EDITING_DATASET_PROPERTY,
];

describe('PreviewStrategies - getClickEventStrategy()', () => {
  it('empty', () => {
    const strategy = getClickEventStrategy();

    expect(strategy).toBeUndefined();
  });

  it('text file extension .txt', () => {
    const strategy = getClickEventStrategy('txt');

    expect(strategy).toBeDefined();
    expect(strategy.keys).toBeDefined();
    expect(strategy.component).toBeUndefined();
    expect(strategy.clickEvent).toBeDefined();
  });

  it('markdown file extension .md', () => {
    const strategy = getClickEventStrategy('md');

    expect(strategy).toBeDefined();
    expect(strategy.keys).toBeDefined();
    expect(strategy.component).toBeUndefined();
    expect(strategy.clickEvent).toBeDefined();
  });

  it('unknown file extension .xyz', () => {
    const strategy = getClickEventStrategy('xyz');

    expect(strategy).toBeUndefined();
  });

  it('check if all click strategies exist', () => {
    allClickStragetiesKeys.forEach((key) => {
      const component = getClickEventStrategy(key);
      expect(component).toBeDefined();
    });
  });
});

describe('PreviewStrategies - getPreviewComponent()', () => {
  it('empty', () => {
    const strategy = getPreviewComponent();
    expect(strategy).toBeUndefined();
  });

  it('txt component', () => {
    const component = getPreviewComponent('txt');
    expect(component).toBeDefined();
  });

  it('check if all preview component strategies exist', () => {
    allPreviewComponentKeys.forEach((key) => {
      const component = getPreviewComponent(key);
      expect(component).toBeDefined();
    });
  });
});
