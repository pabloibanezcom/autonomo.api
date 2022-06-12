import {
  buildPagination,
  GrantType,
  TaxYear,
  TaxYearFilter,
  TaxYearSearchResult,
  transformPaginationToQueryOptions,
  transformSearchFilterToTaxYearQuery
} from '@autonomo/common';
import { NotFoundError } from '../httpError/httpErrors';
import BusinessDB from '../models/business';
import TaxYearDB from '../models/taxYear';
import { fullTaxYear } from '../mongoose/populate';
import { validateUser } from '../util/user';

export const getTaxYears = async (searchFilter: TaxYearFilter, populate = ''): Promise<TaxYear[]> => {
  return await TaxYearDB.find(
    {
      ...transformSearchFilterToTaxYearQuery(searchFilter)
    },
    null,
    transformPaginationToQueryOptions(searchFilter.pagination, searchFilter.sorting)
  ).populate(populate);
};

export const searchTaxYears = async (searchFilter: TaxYearFilter): Promise<TaxYearSearchResult> => {
  const totalItems = await TaxYearDB.count({
    ...transformSearchFilterToTaxYearQuery(searchFilter)
  });
  return {
    pagination: buildPagination(searchFilter.pagination, totalItems),
    sorting: searchFilter.sorting,
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

export const getBusinessTaxYear = async (businessId: string, select: string = fullTaxYear): Promise<TaxYear> => {
  const today = new Date().toISOString().split('T')[0];
  const business = await BusinessDB.findById(businessId);
  const taxYear = await TaxYearDB.findOne({
    country: business.country,
    startDate: { $lte: today },
    endDate: { $gte: today }
  }).select(select);
  if (!taxYear) {
    throw new NotFoundError();
  }
  return taxYear;
};

export const addTaxYear = async (authorizationHeader: string, taxYear: TaxYear): Promise<TaxYear> => {
  await validateUser(authorizationHeader, null, GrantType.Admin);
  return await TaxYearDB.create(taxYear);
};

export const updateTaxYear = async (
  authorizationHeader: string,
  taxYearId: string,
  taxYear: TaxYear
): Promise<TaxYear> => {
  await validateUser(authorizationHeader, null, GrantType.Admin);
  const currentTaxYear = await TaxYearDB.findByIdAndUpdate(taxYearId, taxYear, { new: true, runValidators: true });
  if (!currentTaxYear) {
    throw new NotFoundError();
  }
  return currentTaxYear;
};

export const deleteTaxYear = async (authorizationHeader: string, taxYearId: string): Promise<TaxYear> => {
  await validateUser(authorizationHeader, null, GrantType.Admin);
  const currentTaxYear = await TaxYearDB.findByIdAndDelete(taxYearId);
  if (!currentTaxYear) {
    throw new NotFoundError();
  }
  return currentTaxYear;
};
