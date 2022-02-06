import {
  GrantTypes,
  NationalInsurancePayment,
  NationalInsurancePaymentFilter,
  transformSearchFilterToNationalInsuranceQuery
} from '@autonomo/common';
import { NotFoundError } from '../httpError/httpErrors';
import NationalInsurancePaymentDB from '../models/nationalInsurancePayment';
import { validateUser } from '../util/user';

export const searchNationalInsurancePayments = async (
  businessId: string,
  searchFilter: NationalInsurancePaymentFilter
): Promise<NationalInsurancePayment[]> => {
  return await NationalInsurancePaymentDB.find({
    ...transformSearchFilterToNationalInsuranceQuery(searchFilter),
    business: businessId
  });
};

export const getNationalInsurancePayments = async (
  authorizationHeader: string,
  businessId: string,
  searchFilter: NationalInsurancePaymentFilter
): Promise<NationalInsurancePayment[]> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.View);
  return await searchNationalInsurancePayments(businessAndUser.business._id.toString(), searchFilter);
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
