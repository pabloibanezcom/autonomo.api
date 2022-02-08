import {
  buildPagination,
  GrantTypes,
  TaxPayment,
  TaxPaymentFilter,
  TaxPaymentSearchResult,
  transformSearchFilterToTaxPaymentQuery
} from '@autonomo/common';
import { NotFoundError } from '../httpError/httpErrors';
import TaxPaymentDB from '../models/taxPayment';
import { validateUser } from '../util/user';

export const getTaxPayments = async (businessId: string, searchFilter: TaxPaymentFilter): Promise<TaxPayment[]> => {
  return await TaxPaymentDB.find({
    ...transformSearchFilterToTaxPaymentQuery(searchFilter),
    business: businessId
  });
};

export const searchTaxPayments = async (
  authorizationHeader: string,
  businessId: string,
  searchFilter: TaxPaymentFilter
): Promise<TaxPaymentSearchResult> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.View);
  const totalItems = await TaxPaymentDB.count({
    ...transformSearchFilterToTaxPaymentQuery(searchFilter),
    business: businessId
  });
  return {
    pagination: buildPagination(searchFilter.pagination, totalItems),
    items: await getTaxPayments(businessAndUser.business._id.toString(), searchFilter)
  };
};

export const getTaxPayment = async (
  authorizationHeader: string,
  businessId: string,
  paymentId: string
): Promise<TaxPayment> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.View);
  const existingPayment = await TaxPaymentDB.findOne({
    business: businessAndUser.business._id,
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
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  return await TaxPaymentDB.create({ ...payment, business: businessAndUser.business._id });
};

export const updateTaxPayment = async (
  authorizationHeader: string,
  businessId: string,
  paymentId: string,
  payment: TaxPayment
): Promise<TaxPayment> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  const existingPayment = await TaxPaymentDB.findOneAndUpdate(
    { business: businessAndUser.business._id, _id: paymentId },
    payment,
    { new: true, runValidators: true }
  );
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
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  const existingPayment = await TaxPaymentDB.findOneAndDelete({
    business: businessAndUser.business._id,
    _id: paymentId
  });
  if (!existingPayment) {
    throw new NotFoundError();
  }
  return existingPayment;
};
