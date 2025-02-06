/// <reference types="vite/client" />
import type { ChartConfiguration } from "chart.js";

export interface DataProp {
  fields: string[] | undefined;
  data: object[] | undefined;
}

export interface ConfigProp {
  config: object | undefined;
}

export interface ChartProps {
  chartTitle: string | undefined;
  chartTitleVisible?: boolean;
  chartType: string | undefined;
  chartTypes: string[] | undefined;
  enableLineDrawing: boolean | undefined;
  enableGaps: boolean | undefined;
  xParam: string | undefined;
  yParam: string | undefined;
}

export interface ConfiguratorProps extends ChartProps {
  parameters: string[] | undefined;
}


export interface MetaRows {
  fields: string[] | undefined;
  [key: string]: string[] | string | undefined;
}

export interface MetaData {
  hasMetaRows: boolean;
  metaRows: MetaRows;
  originalData: string | undefined
  dataJSON: object[] | undefined;
}

export interface DataVizDTO {
  meta?: MetaData;
  data: object[] | undefined;
  editorProps?: ChartProps;
  chartConfig: ChartConfiguration;
}

export enum ChartAppMode {
  VIEW = 'view',
  EDIT = 'edit',
}

export interface ChartViewer {
  data: object[] | undefined;
  chartConfig: ChartConfiguration;
  xParam: string | undefined;
  yParam: string | undefined;
}

export interface ChartEditor {
  dto: DataVizDTO;
}

export interface ChartApp {
  mode?: ChartAppMode;
  dto: DataVizDTO;
}

export interface LoadingContent {
  isJSON: boolean;
  content?: unknown;
}
