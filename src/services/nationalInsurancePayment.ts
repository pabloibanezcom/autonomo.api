import { NationalInsurancePayment } from '@autonomo/common';
import { NotFoundError, UnauthorizedError } from '../httpError/httpErrors';
import NationalInsurancePaymentDB from '../models/nationalInsurancePayment';
import { getUserFromAuthorizationHeader } from '../util/user';

export const getNationalInsurancePayments = async (
  authorizationHeader: string,
  userId: string
): Promise<NationalInsurancePayment[]> => {
  const user = await getUserFromAuthorizationHeader(authorizationHeader);
  if (!user._id.equals(userId)) {
    throw new UnauthorizedError();
  }
  return await NationalInsurancePaymentDB.find({ person: userId });
};

export const getNationalInsurancePayment = async (
  authorizationHeader: string,
  taxPaymentId: string
): Promise<NationalInsurancePayment> => {
  const user = await getUserFromAuthorizationHeader(authorizationHeader);
  const existingNationalInsurancePayment = await NationalInsurancePaymentDB.findById(taxPaymentId);
  if (!existingNationalInsurancePayment) {
    throw new NotFoundError();
  }
  if (!user._id.equals(existingNationalInsurancePayment.person)) {
    throw new UnauthorizedError();
  }

  return existingNationalInsurancePayment;
};

export const addNationalInsurancePayment = async (
  authorizationHeader: string,
  taxPayment: NationalInsurancePayment
): Promise<NationalInsurancePayment> => {
  const user = await getUserFromAuthorizationHeader(authorizationHeader);
  if (!user._id.equals(taxPayment.person)) {
    throw new UnauthorizedError();
  }
  return await NationalInsurancePaymentDB.create(taxPayment);
};

export const updateNationalInsurancePayment = async (
  authorizationHeader: string,
  taxPaymentId: string,
  taxPayment: NationalInsurancePayment
): Promise<NationalInsurancePayment> => {
  const user = await getUserFromAuthorizationHeader(authorizationHeader);
  if (!user._id.equals(taxPayment.person)) {
    throw new UnauthorizedError();
  }

  const existingNationalInsurancePayment = await NationalInsurancePaymentDB.findById(taxPaymentId);
  if (!existingNationalInsurancePayment) {
    throw new NotFoundError();
  }
  if (!user._id.equals(existingNationalInsurancePayment.person)) {
    throw new UnauthorizedError();
  }

  return await NationalInsurancePaymentDB.findByIdAndUpdate(taxPaymentId, taxPayment, {
    new: true,
    runValidators: true
  });
};

export const deleteNationalInsurancePayment = async (
  authorizationHeader: string,
  taxPaymentId: string
): Promise<NationalInsurancePayment> => {
  const user = await getUserFromAuthorizationHeader(authorizationHeader);
  const existingNationalInsurancePayment = await NationalInsurancePaymentDB.findById(taxPaymentId);
  if (!existingNationalInsurancePayment) {
    throw new NotFoundError();
  }
  if (!user._id.equals(existingNationalInsurancePayment.person)) {
    throw new UnauthorizedError();
  }

  return await NationalInsurancePaymentDB.findByIdAndDelete(taxPaymentId);
};
