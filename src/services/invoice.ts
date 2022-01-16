import { Invoice } from '@autonomo/common';
import { UnauthorizedError } from '../httpError/httpErrors';
import InvoiceDB from '../models/invoice';
import { getUserFromAuthorizationHeader } from '../util/user';

export const getInvoices = async (
  authorizationHeader: string,
  userId: string,
  invoiceType = 'incomes | expenses'
): Promise<Invoice[]> => {
  const user = await getUserFromAuthorizationHeader(authorizationHeader);
  if (!user._id.equals(userId)) {
    throw new UnauthorizedError();
  }
  return await InvoiceDB.find({ [invoiceType === 'incomes' ? 'issuer' : 'client']: userId }).populate('issuer client');
};

export const addInvoice = async (authorizationHeader: string, invoice: Invoice): Promise<Invoice> => {
  const user = await getUserFromAuthorizationHeader(authorizationHeader);
  if (!user._id.equals(invoice.issuer) && !user._id.equals(invoice.client)) {
    throw new UnauthorizedError();
  }
  return await InvoiceDB.create(invoice);
};

export const updateInvoice = async (
  authorizationHeader: string,
  invoiceId: string,
  invoice: Invoice
): Promise<Invoice> => {
  const user = await getUserFromAuthorizationHeader(authorizationHeader);
  if (!user._id.equals(invoice.issuer) && !user._id.equals(invoice.client)) {
    throw new UnauthorizedError();
  }

  const existingInvoice = await InvoiceDB.findById(invoiceId);
  if (!user._id.equals(existingInvoice.issuer) && !user._id.equals(existingInvoice.client)) {
    throw new UnauthorizedError();
  }

  return await InvoiceDB.findByIdAndUpdate(invoiceId, invoice, { new: true, runValidators: true });
};

export const deleteInvoice = async (authorizationHeader: string, invoiceId: string): Promise<Invoice> => {
  const user = await getUserFromAuthorizationHeader(authorizationHeader);
  const existingInvoice = await InvoiceDB.findById(invoiceId);
  if (!user._id.equals(existingInvoice.issuer) && !user._id.equals(existingInvoice.client)) {
    throw new UnauthorizedError();
  }

  return await InvoiceDB.findByIdAndDelete(invoiceId);
};
