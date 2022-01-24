import { File, Invoice } from '@autonomo/common';
import { UploadedFile } from 'express-fileupload';
import { NotFoundError, UnauthorizedError } from '../httpError/httpErrors';
import InvoiceDB from '../models/invoice';
import { deleteFile, getFileNameFromKey, uploadFile } from '../util/file';
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

export const getInvoice = async (authorizationHeader: string, invoiceId: string): Promise<Invoice> => {
  const user = await getUserFromAuthorizationHeader(authorizationHeader);
  const existingInvoice = await InvoiceDB.findById(invoiceId);
  if (!existingInvoice) {
    throw new NotFoundError();
  }
  if (!user._id.equals(existingInvoice.issuer) && !user._id.equals(existingInvoice.client)) {
    throw new UnauthorizedError();
  }

  return existingInvoice;
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
  if (!existingInvoice) {
    throw new NotFoundError();
  }
  if (!user._id.equals(existingInvoice.issuer) && !user._id.equals(existingInvoice.client)) {
    throw new UnauthorizedError();
  }

  return await InvoiceDB.findByIdAndUpdate(invoiceId, invoice, { new: true, runValidators: true });
};

export const deleteInvoice = async (authorizationHeader: string, invoiceId: string): Promise<Invoice> => {
  const user = await getUserFromAuthorizationHeader(authorizationHeader);
  const existingInvoice = await InvoiceDB.findById(invoiceId);
  if (!existingInvoice) {
    throw new NotFoundError();
  }
  if (!user._id.equals(existingInvoice.issuer) && !user._id.equals(existingInvoice.client)) {
    throw new UnauthorizedError();
  }

  return await InvoiceDB.findByIdAndDelete(invoiceId);
};

export const addInvoiceFile = async (
  authorizationHeader: string,
  invoiceId: string,
  file: UploadedFile
): Promise<File> => {
  const user = await getUserFromAuthorizationHeader(authorizationHeader);

  const existingInvoice = await InvoiceDB.findById(invoiceId);
  if (!user._id.equals(existingInvoice.issuer) && !user._id.equals(existingInvoice.client)) {
    throw new UnauthorizedError();
  }
  if (!existingInvoice) {
    throw new NotFoundError();
  }
  if (!user._id.equals(existingInvoice.issuer) && !user._id.equals(existingInvoice.client)) {
    throw new UnauthorizedError();
  }

  const existingFileKey = existingInvoice.file?.key;

  const uploadedFile = await uploadFile(file, 'invoices');

  existingInvoice.file = {
    key: uploadedFile.Key,
    location: uploadedFile.Location
  };

  await existingInvoice.save();

  if (existingFileKey && getFileNameFromKey(existingFileKey) !== existingInvoice.file.key) {
    await deleteFile(existingFileKey);
  }

  return existingInvoice.file;
};

export const deleteInvoiceFile = async (authorizationHeader: string, invoiceId: string): Promise<Invoice> => {
  const user = await getUserFromAuthorizationHeader(authorizationHeader);

  const existingInvoice = await InvoiceDB.findById(invoiceId);
  if (!user._id.equals(existingInvoice.issuer) && !user._id.equals(existingInvoice.client)) {
    throw new UnauthorizedError();
  }
  if (!existingInvoice) {
    throw new NotFoundError();
  }
  if (!user._id.equals(existingInvoice.issuer) && !user._id.equals(existingInvoice.client)) {
    throw new UnauthorizedError();
  }

  if (!existingInvoice.file) {
    return existingInvoice;
  }

  await deleteFile(existingInvoice.file.key);

  existingInvoice.file = undefined;

  await existingInvoice.save();

  return existingInvoice;
};
