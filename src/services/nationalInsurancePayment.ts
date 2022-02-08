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
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.View);
  const totalItems = await NationalInsurancePaymentDB.count({
    ...transformSearchFilterToNationalInsuranceQuery(searchFilter),
    business: businessId
  });
  return {
    pagination: buildPagination(searchFilter.pagination, totalItems),
    sorting: searchFilter.sorting,
    items: await getNationalInsurancePayments(businessAndUser.business._id.toString(), searchFilter)
  };
};

export const getNationalInsurancePayment = async (
  authorizationHeader: string,
  businessId: string,
  paymentId: string
): Promise<NationalInsurancePayment> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.View);
  const existingPayment = await NationalInsurancePaymentDB.findOne({
    business: businessAndUser.business._id,
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
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  return await NationalInsurancePaymentDB.create({ ...payment, business: businessAndUser.business._id });
};

export const updateNationalInsurancePayment = async (
  authorizationHeader: string,
  businessId: string,
  paymentId: string,
  payment: NationalInsurancePayment
): Promise<NationalInsurancePayment> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  const existingPayment = await NationalInsurancePaymentDB.findOneAndUpdate(
    { business: businessAndUser.business._id, _id: paymentId },
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
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  const existingPayment = await NationalInsurancePaymentDB.findOneAndDelete({
    business: businessAndUser.business._id,
    _id: paymentId
  });
  if (!existingPayment) {
    throw new NotFoundError();
  }
  return existingPayment;
};
