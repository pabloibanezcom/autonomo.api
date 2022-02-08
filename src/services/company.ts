import {
  buildPagination,
  Company,
  CompanyFilter,
  CompanySearchResult,
  GrantTypes,
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
    transformPaginationToQueryOptions(searchFilter.pagination, searchFilter.sorting)
  ).populate(populate);
};

export const searchCompanies = async (
  authorizationHeader: string,
  businessId: string,
  searchFilter: CompanyFilter
): Promise<CompanySearchResult> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.View);
  const totalItems = await CompanyDB.count({
    ...transformSearchFilterToCompanyQuery(searchFilter),
    business: businessId
  });
  return {
    pagination: buildPagination(searchFilter.pagination, totalItems),
    sorting: searchFilter.sorting,
    items: await getCompanies(businessAndUser.business._id.toString(), searchFilter)
  };
};

export const getCompany = async (
  authorizationHeader: string,
  businessId: string,
  companyId: string
): Promise<Company> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.View);
  return await CompanyDB.findOne({ business: businessAndUser.business._id, _id: companyId }).populate('director');
};

export const addCompany = async (
  authorizationHeader: string,
  businessId: string,
  company: Company
): Promise<Company> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  return await CompanyDB.create({ ...company, business: businessAndUser.business._id });
};

export const updateCompany = async (
  authorizationHeader: string,
  businessId: string,
  companyId: string,
  company: Company
): Promise<Company> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  return await CompanyDB.findOneAndUpdate({ business: businessAndUser.business._id, _id: companyId }, company, {
    new: true,
    runValidators: true
  });
};

export const deleteCompany = async (
  authorizationHeader: string,
  businessId: string,
  companyId: string
): Promise<Company> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  return await CompanyDB.findOneAndDelete({ business: businessAndUser.business._id, _id: companyId });
};
