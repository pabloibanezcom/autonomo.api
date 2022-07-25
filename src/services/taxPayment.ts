import {
  buildPagination,
  GrantType,
  TaxPayment,
  TaxPaymentFilter,
  TaxPaymentSearchResult,
  transformPaginationToQueryOptions,
  transformSearchFilterToTaxPaymentQuery
} from '@autonomo/common';
import mongoose from 'mongoose';
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
  await validateUser(authorizationHeader, businessId, GrantType.View);
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
  await validateUser(authorizationHeader, businessId, GrantType.View);
  const existingPayment = await TaxPaymentDB.findOne({
    business: businessId,
    _id: paymentId
  });
  if (!existingPayment) {
    throw new NotFoundError();
  }
  return existingPayment;
};

export const addTaxPaymentWithoutAuth = async (businessId: string, payment: TaxPayment): Promise<TaxPayment> => {
  return await TaxPaymentDB.create({ ...payment, business: new mongoose.Types.ObjectId(businessId) });
};

export const addTaxPayment = async (
  authorizationHeader: string,
  businessId: string,
  payment: TaxPayment
): Promise<TaxPayment> => {
  await validateUser(authorizationHeader, businessId, GrantType.Write);
  return await addTaxPaymentWithoutAuth(businessId, payment);
};

export const updateTaxPayment = async (
  authorizationHeader: string,
  businessId: string,
  paymentId: string,
  payment: TaxPayment
): Promise<TaxPayment> => {
  await validateUser(authorizationHeader, businessId, GrantType.Write);
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
  await validateUser(authorizationHeader, businessId, GrantType.Write);
  const existingPayment = await TaxPaymentDB.findOneAndDelete({
    business: businessId,
    _id: paymentId
  });
  if (!existingPayment) {
    throw new NotFoundError();
  }
  return existingPayment;
};
