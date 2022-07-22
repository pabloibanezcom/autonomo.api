/* eslint-disable @typescript-eslint/no-explicit-any */
import { TaxYear } from '@autonomo/common';
import TaxYearDB from '../../src/models/taxYear';
import { log } from './log';

type MockTaxYearsData = {
  name: string;
  country: string;
  startDate: Date;
  endDate: Date;
};

const getTaxYearByDateAndCountry = async (date: Date, country: string): Promise<TaxYear> => {
  return (await TaxYearDB.findOne({ country: country, startDate: { $lte: date }, endDate: { $gte: date } })) as TaxYear;
};

const generateTaxYears = async (taxYears: MockTaxYearsData[]): Promise<void> => {
  const newTaxYears = await Promise.all(
    taxYears.map(async (taxYear): Promise<TaxYear> => {
      return await TaxYearDB.create({
        ...taxYear,
        startDate: new Date(taxYear.startDate),
        endDate: new Date(taxYear.endDate)
      });
    })
  );

  log('Tax years generated', newTaxYears.length);
};

export { generateTaxYears, getTaxYearByDateAndCountry };
