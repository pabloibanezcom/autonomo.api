import {
  buildPagination,
  Company,
  CompanyFilter,
  CompanySearchResult,
  generateRandomColor,
  GrantType,
  transformPaginationToQueryOptions,
  transformSearchFilterToCompanyQuery
} from '@autonomo/common';
import CompanyDB from '../models/company';
import { validateUser } from '../util/user';

export const getCompanies = async (
  businessId: string,
  searchFilter: CompanyFilter,
  populate = ''
): Promise<Company[]> => {
  return await CompanyDB.find(
    {
      ...transformSearchFilterToCompanyQuery(searchFilter),
      business: businessId
    },
    null,
    transformPaginationToQueryOptions(searchFilter.pagination, searchFilter.sorting || { sortBy: 'name' })
  ).populate(populate);
};

export const searchCompanies = async (
  authorizationHeader: string,
  businessId: string,
  searchFilter: CompanyFilter
): Promise<CompanySearchResult> => {
  await validateUser(authorizationHeader, businessId, GrantType.View);
  const totalItems = await CompanyDB.count({
    ...transformSearchFilterToCompanyQuery(searchFilter),
    business: businessId
  });
  return {
    pagination: buildPagination(searchFilter.pagination, totalItems),
    sorting: searchFilter.sorting,
    items: await getCompanies(businessId, searchFilter)
  };
};

export const getCompany = async (
  authorizationHeader: string,
  businessId: string,
  companyId: string
): Promise<Company> => {
  await validateUser(authorizationHeader, businessId, GrantType.View);
  return await CompanyDB.findOne({ business: businessId, _id: companyId }).populate('director');
};

export const addCompany = async (
  authorizationHeader: string,
  businessId: string,
  company: Company
): Promise<Company> => {
  await validateUser(authorizationHeader, businessId, GrantType.Write);
  return await CompanyDB.create({
    ...company,
    business: businessId,
    color: company.color || generateRandomColor()
  });
};

export const updateCompany = async (
  authorizationHeader: string,
  businessId: string,
  companyId: string,
  company: Company
): Promise<Company> => {
  await validateUser(authorizationHeader, businessId, GrantType.Write);
  return await CompanyDB.findOneAndUpdate({ business: businessId, _id: companyId }, company, {
    new: true,
    runValidators: true
  });
};

export const deleteCompany = async (
  authorizationHeader: string,
  businessId: string,
  companyId: string
): Promise<Company> => {
  await validateUser(authorizationHeader, businessId, GrantType.Write);
  return await CompanyDB.findOneAndDelete({ business: businessId, _id: companyId });
};
