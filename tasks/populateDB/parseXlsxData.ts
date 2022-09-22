/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { roundTwoDigits } from '@autonomo/common';
import templates from './templates.json';

type TemplateName = 'es-autonomo' | 'es-sociedad' | 'gb-ltd';

type TemplateCollection = {
  sheetName: string;
  columns: number;
  fields: { [key: string]: { columnIndex?: number; transformFunc?: string; staticValue?: any } };
};

type Template = {
  name: TemplateName;
  incomes: TemplateCollection;
  expenses: TemplateCollection;
  nationalInsurancePayments: TemplateCollection;
  taxPayments: TemplateCollection;
};

const wrapInArray = (data: any): any[] => {
  return [data];
};

const convertSiNoToBoolean = (val: string): boolean => {
  return val === 'Si';
};

const transformFunctions = {
  wrapInArray,
  roundTwoDigits,
  convertSiNoToBoolean
};

const getDataRows = (templateCollection: TemplateCollection, data: any[]): any[] => {
  return (
    data
      .find(collection => collection.name === templateCollection.sheetName)
      ?.data.filter(row => row.length === templateCollection.columns)
      .filter(row => typeof row[0].getMonth === 'function') || []
  );
};

const transformCellData = (row: any, val: any) => {
  if (val.staticValue) {
    return val.staticValue;
  }
  return val.transformFunc ? transformFunctions[val.transformFunc](row[val.columnIndex]) : row[val.columnIndex];
};

const parseCollection = (template: TemplateCollection, data: any[]) => {
  return getDataRows(template, data).map(row => {
    return Object.fromEntries(Object.entries(template.fields).map(([key, val]) => [key, transformCellData(row, val)]));
  });
};

const parseXlsxData = async (templateName: TemplateName, data: any[]): Promise<any> => {
  const template = templates.find(t => t.name === templateName) as Template;
  return {
    incomes: parseCollection(template.incomes, data),
    expenses: parseCollection(template.expenses, data),
    nationalInsurancePayments: parseCollection(template.nationalInsurancePayments, data),
    taxPayments: parseCollection(template.taxPayments, data)
  };
};

export default parseXlsxData;
