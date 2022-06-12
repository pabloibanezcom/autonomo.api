import {
  buildPagination,
  GrantTypes,
  NationalInsurancePayment,
  NationalInsurancePaymentFilter,
  NationalInsurancePaymentSearchResult,
  transformPaginationToQueryOptions,
  transformSearchFilterToNationalInsuranceQuery
} from '@autonomo/common';
import { NotFoundError } from '../httpError/httpErrors';
import NationalInsurancePaymentDB from '../models/nationalInsurancePayment';
import { validateUser } from '../util/user';

export const getNationalInsurancePayments = async (
  businessId: string,
  searchFilter: NationalInsurancePaymentFilter
): Promise<NationalInsurancePayment[]> => {
  return await NationalInsurancePaymentDB.find(
    {
      ...transformSearchFilterToNationalInsuranceQuery(searchFilter),
      business: businessId
    },
    null,
    transformPaginationToQueryOptions(searchFilter.pagination, searchFilter.sorting)
  );
};

export const searchNationalInsurancePayments = async (
  authorizationHeader: string,
  businessId: string,
  searchFilter: NationalInsurancePaymentFilter
): Promise<NationalInsurancePaymentSearchResult> => {
  await validateUser(authorizationHeader, businessId, GrantTypes.View);
  const totalItems = await NationalInsurancePaymentDB.count({
    ...transformSearchFilterToNationalInsuranceQuery(searchFilter),
    business: businessId
  });
  return {
    pagination: buildPagination(searchFilter.pagination, totalItems),
    sorting: searchFilter.sorting,
    items: await getNationalInsurancePayments(businessId, searchFilter)
  };
};

export const getNationalInsurancePayment = async (
  authorizationHeader: string,
  businessId: string,
  paymentId: string
): Promise<NationalInsurancePayment> => {
  await validateUser(authorizationHeader, businessId, GrantTypes.View);
  const existingPayment = await NationalInsurancePaymentDB.findOne({
    business: businessId,
    _id: paymentId
  });
  if (!existingPayment) {
    throw new NotFoundError();
  }
  return existingPayment;
};

export const addNationalInsurancePayment = async (
  authorizationHeader: string,
  businessId: string,
  payment: NationalInsurancePayment
): Promise<NationalInsurancePayment> => {
  await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  return await NationalInsurancePaymentDB.create({ ...payment, business: businessId });
};

export const updateNationalInsurancePayment = async (
  authorizationHeader: string,
  businessId: string,
  paymentId: string,
  payment: NationalInsurancePayment
): Promise<NationalInsurancePayment> => {
  await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  const existingPayment = await NationalInsurancePaymentDB.findOneAndUpdate(
    { business: businessId, _id: paymentId },
    payment,
    { new: true, runValidators: true }
  );
  if (!existingPayment) {
    throw new NotFoundError();
  }
  return existingPayment;
};

export const deleteNationalInsurancePayment = async (
  authorizationHeader: string,
  businessId: string,
  paymentId: string
): Promise<NationalInsurancePayment> => {
  await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  const existingPayment = await NationalInsurancePaymentDB.findOneAndDelete({
    business: businessId,
    _id: paymentId
  });
  if (!existingPayment) {
    throw new NotFoundError();
  }
  return existingPayment;
};
