import {
  buildPagination,
  Company,
  CompanyFilter,
  CompanySearchResult,
  CurrencyAmount,
  Expense,
  generateRandomColor,
  GrantType,
  Income,
  Invoice,
  InvoicesStats,
  roundTwoDigits,
  transformPaginationToQueryOptions,
  transformSearchFilterToCompanyQuery
} from '@autonomo/common';
import mongoose from 'mongoose';
import { BadRequestError } from '../httpError/httpErrors';
import { CompanyDB, ExpenseDB, IncomeDB } from '../models';
import { validateUser } from '../util/user';

const generateInvoicesStats = (invoices: Income[] | Expense[] = []): InvoicesStats => {
  return {
    quantity: invoices.length,
    last: invoices[0]?.issuedDate,
    total: (invoices as Invoice[]).reduce<CurrencyAmount>((currentValue, inv) => {
      return { currency: inv.total.currency, amount: roundTwoDigits((currentValue?.amount || 0) + inv.total.amount) };
    }, undefined)
  };
};

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
  if (!searchFilter || !Object.keys(searchFilter).length) {
    throw new BadRequestError('searchFilter can not be empty');
  }
  await validateUser(authorizationHeader, businessId, GrantType.View);
  const totalItems = await CompanyDB.count({
    ...transformSearchFilterToCompanyQuery(searchFilter),
    business: businessId
  });
  return {
    ...{ ...searchFilter, pagination: buildPagination(searchFilter.pagination, totalItems) },
    ...{ items: await getCompanies(businessId, searchFilter) }
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

export const addCompanyWithoutAuth = async (businessId: string, company: Company): Promise<Company> => {
  return await CompanyDB.create({
    ...company,
    business: new mongoose.Types.ObjectId(businessId),
    color: company.color || generateRandomColor(),
    invoicesIssuedStats: generateInvoicesStats(),
    invoicesReceivedStats: generateInvoicesStats()
  });
};

export const addCompany = async (
  authorizationHeader: string,
  businessId: string,
  company: Company
): Promise<Company> => {
  await validateUser(authorizationHeader, businessId, GrantType.Write);
  return await addCompanyWithoutAuth(businessId, company);
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

export const refreshCompanyStats = async (companyId: string): Promise<Company> => {
  const companyExpenses = await ExpenseDB.find({ issuer: companyId }).sort({ issuedDate: 'desc' });
  const companyIncomes = await IncomeDB.find({ client: companyId }).sort({ issuedDate: 'desc' });

  return await CompanyDB.findByIdAndUpdate(
    companyId,
    {
      invoicesIssuedStats: generateInvoicesStats(companyExpenses),
      invoicesReceivedStats: generateInvoicesStats(companyIncomes)
    },
    { new: true }
  );
};
