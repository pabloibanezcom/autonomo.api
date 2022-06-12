import {
  buildPagination,
  GrantTypes,
  TaxPayment,
  TaxPaymentFilter,
  TaxPaymentSearchResult,
  transformPaginationToQueryOptions,
  transformSearchFilterToTaxPaymentQuery
} from '@autonomo/common';
import { NotFoundError } from '../httpError/httpErrors';
import TaxPaymentDB from '../models/taxPayment';
import { validateUser } from '../util/user';

export const getTaxPayments = async (businessId: string, searchFilter: TaxPaymentFilter): Promise<TaxPayment[]> => {
  return await TaxPaymentDB.find(
    {
      ...transformSearchFilterToTaxPaymentQuery(searchFilter),
      business: businessId
    },
    null,
    transformPaginationToQueryOptions(searchFilter.pagination, searchFilter.sorting)
  );
};

export const searchTaxPayments = async (
  authorizationHeader: string,
  businessId: string,
  searchFilter: TaxPaymentFilter
): Promise<TaxPaymentSearchResult> => {
  await validateUser(authorizationHeader, businessId, GrantTypes.View);
  const totalItems = await TaxPaymentDB.count({
    ...transformSearchFilterToTaxPaymentQuery(searchFilter),
    business: businessId
  });
  return {
    pagination: buildPagination(searchFilter.pagination, totalItems),
    sorting: searchFilter.sorting,
    items: await getTaxPayments(businessId, searchFilter)
  };
};

export const getTaxPayment = async (
  authorizationHeader: string,
  businessId: string,
  paymentId: string
): Promise<TaxPayment> => {
  await validateUser(authorizationHeader, businessId, GrantTypes.View);
  const existingPayment = await TaxPaymentDB.findOne({
    business: businessId,
    _id: paymentId
  });
  if (!existingPayment) {
    throw new NotFoundError();
  }
  return existingPayment;
};

export const addTaxPayment = async (
  authorizationHeader: string,
  businessId: string,
  payment: TaxPayment
): Promise<TaxPayment> => {
  await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  return await TaxPaymentDB.create({ ...payment, business: businessId });
};

export const updateTaxPayment = async (
  authorizationHeader: string,
  businessId: string,
  paymentId: string,
  payment: TaxPayment
): Promise<TaxPayment> => {
  await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  const existingPayment = await TaxPaymentDB.findOneAndUpdate({ business: businessId, _id: paymentId }, payment, {
    new: true,
    runValidators: true
  });
  if (!existingPayment) {
    throw new NotFoundError();
  }
  return existingPayment;
};

export const deleteTaxPayment = async (
  authorizationHeader: string,
  businessId: string,
  paymentId: string
): Promise<TaxPayment> => {
  await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  const existingPayment = await TaxPaymentDB.findOneAndDelete({
    business: businessId,
    _id: paymentId
  });
  if (!existingPayment) {
    throw new NotFoundError();
  }
  return existingPayment;
};
