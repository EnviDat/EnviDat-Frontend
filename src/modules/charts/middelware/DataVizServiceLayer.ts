import type {ChartConfiguration} from 'chart.js';

import {convertToChartProps} from '@/modules/charts/middelware/ConfigConversion.ts';
import {getMetaData} from '@/modules/charts/middelware/DataConversion.ts';

import type {ChartAppMode, ChartProps, LoadingContent, MetaData} from '@/types/dataVizTypes';

export const loadContentFromUrl = async (url: string) : Promise<LoadingContent> => {
  if (!url) {
    return {
      isJSON: false,
      content: undefined,
    };
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} with the url: ${response.url}`);
  }

/*
  const contentHeader = response.headers.get("content-type");
  let isJSON = contentHeader ? contentHeader.includes('json') : false;
*/

  const responseBody = await response.text();

  try {
    return {
      isJSON: true,
      content: JSON.parse(responseBody),
    }
  } catch (error: unknown) { /* empty */ }


  return {
    isJSON: false,
    content: responseBody,
  }
}

export const getConfigAndEditorProps = async (configUrl: string, mode: ChartAppMode) => {
  let editorProps: ChartProps | undefined;
  let chartConfig: ChartConfiguration | undefined;
  let configContent;

  try {
    configContent = await loadContentFromUrl(configUrl);
  } catch (e) {
    throw new Error(`Error while reading config file (url: ${configUrl}). Error: ${e}`);
  }

//  if (configContent.isJSON && isChartConfiguration(configContent.content)) {
  if (configContent.isJSON) {
    chartConfig = configContent.content;
    editorProps = convertToChartProps(configContent.content);
  } else {
    throw new Error(`Expected config file to be JSON formated! Url: ${configUrl}`);
  }

  return {
    chartConfig,
    editorProps,
  }
}

export const getDataWithMetaData = async (dataUrl: string) => {
  let meta: MetaData | undefined;
  let dataContent: LoadingContent;

  try {
    dataContent = await loadContentFromUrl(dataUrl);
  } catch (e) {
    throw new Error(`Error while reading data file (url: ${dataUrl}). Error: ${e}`);
  }

  try {
    meta = getMetaData(dataContent.content, dataContent.isJSON);
  } catch (e) {
    throw new Error(`Error while extracting meta data from file (url: ${dataUrl}). Error: ${e}`);
  }

  const data: object[] | undefined = meta.dataJSON;

  return {
    meta,
    data,
  };
}

export const getErrorMessage = (e: unknown) : string => {
  if (e instanceof Error) {
    return e.message;
  }

  if (e && typeof e === 'object' && 'message' in e) {
    return String(e.message);
  }

  if (typeof e === 'string') {
    return e;
  }

  return `Unclear to deal with Error: ${e}`;
}
