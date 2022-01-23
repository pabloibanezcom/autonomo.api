import { TaxYear } from '@autonomo/common';
import { NotFoundError } from '../httpError/httpErrors';
import TaxYearDB from '../models/taxYear';

export const getTaxYears = async (): Promise<TaxYear[]> => {
  return await TaxYearDB.find({});
};

export const getTaxYear = async (taxYearId: string): Promise<TaxYear> => {
  const taxYear = await TaxYearDB.findById(taxYearId);
  if (!taxYear) {
    throw new NotFoundError();
  }
  return taxYear;
};

export const addTaxYear = async (taxYear: TaxYear): Promise<TaxYear> => {
  return await TaxYearDB.create(taxYear);
};

export const updateTaxYear = async (taxYearId: string, taxYear: TaxYear): Promise<TaxYear> => {
  const currentTaxYear = await TaxYearDB.findByIdAndUpdate(taxYearId, taxYear, { new: true, runValidators: true });
  if (!currentTaxYear) {
    throw new NotFoundError();
  }
  return currentTaxYear;
};

export const deleteTaxYear = async (taxYearId: string): Promise<TaxYear> => {
  const currentTaxYear = await TaxYearDB.findByIdAndDelete(taxYearId);
  if (!currentTaxYear) {
    throw new NotFoundError();
  }
  return currentTaxYear;
};
