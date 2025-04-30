import papa from 'papaparse';
import {parseISO} from 'date-fns/parseISO';
import type {MetaData, MetaRows} from '@/types/dataVizTypes';

const normalDataConversion = (data: any, xAxis: string, yAxis: string, title: string) => ({
    labels: data?.map((row: any) => row[xAxis]),
    datasets: [
      {
        label: title,
        data: data?.map((row: any) => ({
            x: row[xAxis],
            y: row[yAxis],
          })),
      },
    ],
  })

const largeDataConversion = (data: any, xAxis: string, yAxis: string, title: string) => ({
    labels: [],
    datasets: [
      {
        label: title,
        data: data?.map((row: any) => ({
            x: parseISO(row[xAxis]).getTime(),
            // x: row[xAxis],
            y: Number.parseFloat(row[yAxis]),
          })),
      },
    ],
  })

export function getDataSeries (data: object[] | undefined,
                               xAxisParam: string | undefined,
                               yAxisParam: string | undefined,
                               title: string | undefined, largeDataset: boolean = false) {

  if (!data || data.length <= 0) {
    return { labels: undefined, datasets: [] };
  }

  const firstRow = data[0];
  const colKeys = Object.keys(firstRow);

  const xAxis = xAxisParam || colKeys[0];
  const yAxis = yAxisParam || colKeys[1];

  const dataSeriesTitle = title || yAxis;

  return largeDataset ? largeDataConversion(data, xAxis, yAxis, dataSeriesTitle) : normalDataConversion(data, xAxis, yAxis, dataSeriesTitle);
}


/**
 * Mapping from prefix to property
 */
const METADATA_MAPPING = [
  ['# doi =', 'doi'],
  ['# reference =', 'reference'],
  ['# station_id =', 'stationId'],
  ['# station_name =', 'stationName'],
  ['# srid =', 'srid'],
  ['# geometry =', 'geometry'],
  ['# nodata =', 'nodata'],
  ['# timestamp_meaning =', 'timestampMeaning'],
  ['# timezone =', 'timezone'],
  ['# field_delimiter =', 'fieldDelimiter'],
];

const FIELDS_METADATA_MAPPING = [
  ['# fields =', 'fields'],
  ['# add_value =', 'addValue'],
  ['# scale_factor =', 'scaleFactor'],
  ['# units =', 'units'],
  ['# display_description =', 'displayDescription'],
  ['# database_fields =', 'databaseFields'],
  ['# database_fields_data_types =', 'databaseFieldsDataTypes'],
];


function getLineViaPrefix (metaRows: string[], prefix: string) : string | undefined {
  const fieldIndex = metaRows.findIndex((line) => line.startsWith(prefix));
  let lineValue;

  if (fieldIndex >= 0) {
    lineValue = metaRows[fieldIndex];
    lineValue = lineValue.replace(prefix, '').trim();
  }

  return lineValue;
}


function unpackICSVMapping(metaRows: string[], mappingRules: string[][]) : MetaRows {
  const unpackedLines : MetaRows = { fields: []};

  for (let i = 0; i < mappingRules.length; i++) {
    const rule = mappingRules[i];
    const prefix = rule[0];
    const property : string = rule[1];

    // @ts-ignore
    unpackedLines[property] = getLineViaPrefix(metaRows, prefix);
  }

  return unpackedLines;
}


export function parseCSV(csv: string) {
  return papa.parse(csv, {
    header: true,
  });
}

export function isObjectArray(object: unknown): object is object[] {
  if (typeof object === 'undefined') {
    return false;
  }

  if (!(object instanceof Array)) {
    return false;
  }

  if (object.length >= 0) {
    return typeof object[0] === 'object';
  }

  return true;
}

function getMetaDataFromJSON(data: unknown) : MetaData {
  if (!isObjectArray(data)) {
    throw new Error('Expected data to be an array of objects');
  }

  const dataObjs = data;

  let fields : string[] = [];
  const firstEntry = dataObjs ? dataObjs[0] : null;

  if (firstEntry) {
    fields = Object.keys(firstEntry);
  }

  const hasMetaRows = fields.length > 0;
  const originalData = dataObjs ? JSON.stringify(dataObjs) : undefined;

  return {
    hasMetaRows,
    metaRows: {
      fields,
    },
    originalData,
    dataJSON: dataObjs,
  };
}

function getDelimiter(fileRow: string) : string {
  let delimiter = ',';
  let firstCols = fileRow.split(delimiter);

  if (firstCols.length <= 1) {
    delimiter = ';';
    firstCols = fileRow.split(delimiter);
  }

  if (firstCols.length <= 1) {
    delimiter = '\t';
    firstCols = fileRow.split(delimiter);
  }

  if (firstCols.length <= 1) {
    delimiter = ' ';
  }

  return delimiter;
}

function csvHasHeaderRow(firstRow: string) : boolean {
  const delimiter = getDelimiter(firstRow);
  const cols = firstRow.split(delimiter);

  for (let i = 0; i < cols.length; i++) {
    const cell = cols[i];
    const parsedCell = Number.parseInt(cell, 10);
    const isNumber = !Number.isNaN(parsedCell);

    if (isNumber) {
      return false;
    }
  }

  return true;
}

export function isString(something: unknown): something is string {
  return something !== undefined && typeof something === 'string';
}

function getMetaDataFromCSV(data: unknown) : MetaData {

  if (!isString(data)) {
    throw new Error(`Expected data to be string (data: ${data})`);
  }

  const csvDataString = data;

  let metaRows: MetaRows = { fields: [] } satisfies MetaRows;
  let metaFields: MetaRows = { fields: [] } satisfies MetaRows;
  const csvLines = csvDataString.split('\n');

  let delimiter = getDelimiter(csvLines[0]);

  const iCSVMetaRows = csvLines.filter((line) => line.startsWith('#'));
  let hasMetaRows = iCSVMetaRows?.length > 0;

  if (hasMetaRows) {
    metaRows = unpackICSVMapping(iCSVMetaRows, METADATA_MAPPING);
    if (metaRows.fieldDelimiter) {
      delimiter = metaRows.fieldDelimiter;
    }

    metaFields = unpackICSVMapping(iCSVMetaRows, FIELDS_METADATA_MAPPING);

    if (metaFields?.fields) {
      const fields: string = metaFields.fields instanceof Array ? metaFields.fields.join(delimiter) : metaFields.fields;
      csvLines.splice(0, iCSVMetaRows.length, fields)
    }
  } else {
    // store the secondDataRow for detecting if there are headers
    const firstDataRow = csvLines[0];
    const hasHeaderRow = csvHasHeaderRow(firstDataRow);

    if (!hasHeaderRow) {
      const cols = firstDataRow.split(delimiter);
      const paramHeaderLine = cols.map((element, index) => `Col ${index}`);
      metaFields.fields = paramHeaderLine;
      hasMetaRows = true;
      csvLines.splice(0, 1, paramHeaderLine.join(delimiter))
    } else {
      hasMetaRows = hasHeaderRow;
    }
  }

  const originalData = hasMetaRows ? csvLines?.join('\n') : csvDataString;
  const parseResult = parseCSV(originalData);

  metaFields.fields = parseResult.meta.fields;

  return {
    hasMetaRows,
    metaRows: {
      ...metaRows,
      ...metaFields,
    },
    originalData,
    dataJSON: parseResult.data as object[],
  };
}

export function getMetaData (data: unknown, isJSON: boolean) : MetaData {
  if (isJSON) {
    return getMetaDataFromJSON(data);
  } 
    return getMetaDataFromCSV(data);
  
}

