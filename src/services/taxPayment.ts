import { Person, TaxPayment, TaxPaymentFilter, transformSearchFilterToTaxPaymentQuery } from '@autonomo/common';
import { NotFoundError, UnauthorizedError } from '../httpError/httpErrors';
import TaxPaymentDB from '../models/taxPayment';
import { getUserFromAuthorizationHeader, getValidatedUser } from '../util/user';

export const getTaxPayments = async (
  authorizationHeader: string,
  userId: string,
  searchFilter: TaxPaymentFilter,
  user: Person = null
): Promise<TaxPayment[]> => {
  const requestUser = user || (await getValidatedUser(authorizationHeader, [userId]));
  return await TaxPaymentDB.find({
    ...transformSearchFilterToTaxPaymentQuery(searchFilter),
    payer: requestUser._id
  });
};

export const getTaxPayment = async (authorizationHeader: string, taxPaymentId: string): Promise<TaxPayment> => {
  const user = await getUserFromAuthorizationHeader(authorizationHeader);
  const existingTaxPayment = await TaxPaymentDB.findById(taxPaymentId);
  if (!existingTaxPayment) {
    throw new NotFoundError();
  }
  if (!user._id.equals(existingTaxPayment.payer)) {
    throw new UnauthorizedError();
  }

  return existingTaxPayment;
};

export const addTaxPayment = async (authorizationHeader: string, taxPayment: TaxPayment): Promise<TaxPayment> => {
  const user = await getUserFromAuthorizationHeader(authorizationHeader);
  if (!user._id.equals(taxPayment.payer)) {
    throw new UnauthorizedError();
  }
  return await TaxPaymentDB.create(taxPayment);
};

export const updateTaxPayment = async (
  authorizationHeader: string,
  taxPaymentId: string,
  taxPayment: TaxPayment
): Promise<TaxPayment> => {
  const user = await getUserFromAuthorizationHeader(authorizationHeader);
  if (!user._id.equals(taxPayment.payer)) {
    throw new UnauthorizedError();
  }

  const existingTaxPayment = await TaxPaymentDB.findById(taxPaymentId);
  if (!existingTaxPayment) {
    throw new NotFoundError();
  }
  if (!user._id.equals(existingTaxPayment.payer)) {
    throw new UnauthorizedError();
  }

  return await TaxPaymentDB.findByIdAndUpdate(taxPaymentId, taxPayment, { new: true, runValidators: true });
};

export const deleteTaxPayment = async (authorizationHeader: string, taxPaymentId: string): Promise<TaxPayment> => {
  const user = await getUserFromAuthorizationHeader(authorizationHeader);
  const existingTaxPayment = await TaxPaymentDB.findById(taxPaymentId);
  if (!existingTaxPayment) {
    throw new NotFoundError();
  }
  if (!user._id.equals(existingTaxPayment.payer)) {
    throw new UnauthorizedError();
  }

  return await TaxPaymentDB.findByIdAndDelete(taxPaymentId);
};
