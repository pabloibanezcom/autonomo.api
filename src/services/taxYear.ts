import {
  buildPagination,
  GrantTypes,
  TaxYear,
  TaxYearFilter,
  TaxYearSearchResult,
  transformPaginationToQueryOptions,
  transformSearchFilterToTaxYearQuery
} from '@autonomo/common';
import { NotFoundError } from '../httpError/httpErrors';
import TaxYearDB from '../models/taxYear';
import { validateUser } from '../util/user';

export const getTaxYears = async (searchFilter: TaxYearFilter, populate = ''): Promise<TaxYear[]> => {
  return await TaxYearDB.find(
    {
      ...transformSearchFilterToTaxYearQuery(searchFilter)
    },
    null,
    transformPaginationToQueryOptions(searchFilter.pagination)
  ).populate(populate);
};

export const searchTaxYears = async (searchFilter: TaxYearFilter): Promise<TaxYearSearchResult> => {
  const totalItems = await TaxYearDB.count({
    ...transformSearchFilterToTaxYearQuery(searchFilter)
  });
  return {
    pagination: buildPagination(searchFilter.pagination, totalItems),
    items: await getTaxYears(searchFilter)
  };
};

export const getTaxYear = async (taxYearId: string): Promise<TaxYear> => {
  const taxYear = await TaxYearDB.findById(taxYearId);
  if (!taxYear) {
    throw new NotFoundError();
  }
  return taxYear;
};

export const addTaxYear = async (authorizationHeader: string, taxYear: TaxYear): Promise<TaxYear> => {
  await validateUser(authorizationHeader, null, GrantTypes.Admin);
  return await TaxYearDB.create(taxYear);
};

export const updateTaxYear = async (
  authorizationHeader: string,
  taxYearId: string,
  taxYear: TaxYear
): Promise<TaxYear> => {
  await validateUser(authorizationHeader, null, GrantTypes.Admin);
  const currentTaxYear = await TaxYearDB.findByIdAndUpdate(taxYearId, taxYear, { new: true, runValidators: true });
  if (!currentTaxYear) {
    throw new NotFoundError();
  }
  return currentTaxYear;
};

export const deleteTaxYear = async (authorizationHeader: string, taxYearId: string): Promise<TaxYear> => {
  await validateUser(authorizationHeader, null, GrantTypes.Admin);
  const currentTaxYear = await TaxYearDB.findByIdAndDelete(taxYearId);
  if (!currentTaxYear) {
    throw new NotFoundError();
  }
  return currentTaxYear;
};
