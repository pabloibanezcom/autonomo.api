/* eslint-disable @typescript-eslint/no-explicit-any */
import { roundTwoDigits } from '@autonomo/common';
import { getBusinessFilesFromDrive } from './googleDrive';

const SHEET_INCOMES = 'Ingresos';
const SHEET_EXPENSES = 'Gastos';
const SHEET_NATIONAL_INSURANCE_PAYMENTS = 'Cuota Autonomos';
const SHEET_TAX_PAYMENTS_INCOME_TAX = 'Pagos IRPF';

const convertSiNoToBoolean = (val: string): boolean => {
  return val === 'Si';
};

const readXlsxData = async (): Promise<any> => {
  const businessFiles = await getBusinessFilesFromDrive();

  const getDataRows = (files: any, sheetName: string, rowLength: number): any[] => {
    const getDataRowsFromBook = book => {
      return (
        book
          .find(sheet => sheet.name === sheetName)
          ?.data.filter(row => row.length === rowLength)
          .filter(row => typeof row[0].getMonth === 'function') || []
      );
    };

    return files.map(book => getDataRowsFromBook(book));
  };

  const parseIncomes = (files: any) => {
    return getDataRows(files, SHEET_INCOMES, 12)
      .flat()
      .map(row => {
        return {
          issuedDate: row[0],
          paymentDate: row[1],
          number: row[2],
          categories: [row[3]],
          client: row[4],
          baseCurrency: row[5],
          exchangeRate: row[6],
          subtotalBaseCurrency: row[7],
          subtotal: roundTwoDigits(row[8]),
          taxPct: row[9]
        };
      });
  };

  const parseExpenses = (files: any) => {
    return getDataRows(files, SHEET_EXPENSES, 15)
      .flat()
      .map(row => {
        return {
          issuedDate: row[0],
          description: row[1],
          categories: [row[2]],
          issuer: row[3],
          baseCurrency: row[4],
          exchangeRate: row[5],
          subtotalBaseCurrency: roundTwoDigits(row[6]),
          subtotal: roundTwoDigits(row[7]),
          isDeductible: convertSiNoToBoolean(row[8]),
          taxPct: row[10],
          tax: roundTwoDigits(row[11]),
          deductibleTaxPct: row[12],
          deductibleTax: roundTwoDigits(row[13]),
          total: roundTwoDigits(row[14])
        };
      });
  };

  const parseNationalInsurancePayments = (files: any) => {
    return getDataRows(files, SHEET_NATIONAL_INSURANCE_PAYMENTS, 3)
      .flat()
      .map(row => {
        return {
          date: row[0],
          description: row[1],
          amount: row[2]
        };
      });
  };

  const parseTaxPayments = (files: any) => {
    return getDataRows(files, SHEET_TAX_PAYMENTS_INCOME_TAX, 4)
      .flat()
      .map(row => {
        return {
          date: row[0],
          paymentDate: row[1],
          description: row[2],
          amount: row[3],
          type: 'incomeTax'
        };
      });
  };

  return businessFiles.map(b => {
    return {
      business: b.business,
      incomes: parseIncomes(b.files),
      expenses: parseExpenses(b.files),
      nationalInsurancePayments: parseNationalInsurancePayments(b.files),
      taxPayments: [...parseTaxPayments(b.files)]
    };
  });
};

export default readXlsxData;
