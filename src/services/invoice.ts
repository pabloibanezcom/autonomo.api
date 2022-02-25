import {
  buildSearchFilter,
  File,
  GrantTypes,
  Invoice,
  InvoiceFilter,
  InvoiceSearchResult,
  transformPaginationToQueryOptions,
  transformSearchFilterToInvoiceQuery
} from '@autonomo/common';
import { UploadedFile } from 'express-fileupload';
import { NotFoundError } from '../httpError/httpErrors';
import InvoiceDB from '../models/invoice';
import { deleteFile, getFileNameFromKey, uploadFile } from '../util/file';
import { validateUser } from '../util/user';

export const getInvoices = async (
  businessId: string,
  searchFilter: InvoiceFilter,
  populate = ''
): Promise<Invoice[]> => {
  return await InvoiceDB.find(
    {
      ...transformSearchFilterToInvoiceQuery(searchFilter),
      business: businessId
    },
    null,
    transformPaginationToQueryOptions(searchFilter.pagination, searchFilter.sorting)
  ).populate(populate);
};

export const searchInvoices = async (
  authorizationHeader: string,
  businessId: string,
  searchFilter: InvoiceFilter,
  populate = 'issuerOrClient categories'
): Promise<InvoiceSearchResult> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.View);
  const totalItems = await InvoiceDB.count({
    ...transformSearchFilterToInvoiceQuery(searchFilter),
    business: businessId
  });
  const verifiedSearchFilter = buildSearchFilter(searchFilter, totalItems, 'issuedDate');
  return {
    ...verifiedSearchFilter,
    items: await getInvoices(businessAndUser.business._id.toString(), verifiedSearchFilter, populate)
  };
};

export const getInvoice = async (
  authorizationHeader: string,
  businessId: string,
  invoiceId: string,
  populate = 'issuerOrClient categories'
): Promise<Invoice> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.View);
  const existingInvoice = await InvoiceDB.findOne({ business: businessAndUser.business._id, _id: invoiceId }).populate(
    populate
  );
  if (!existingInvoice) {
    throw new NotFoundError();
  }
  return existingInvoice;
};

export const addInvoice = async (
  authorizationHeader: string,
  businessId: string,
  invoice: Invoice
): Promise<Invoice> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  return await InvoiceDB.create({ ...invoice, business: businessAndUser.business._id });
};

export const updateInvoice = async (
  authorizationHeader: string,
  businessId: string,
  invoiceId: string,
  invoice: Invoice
): Promise<Invoice> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  const existingInvoice = await InvoiceDB.findOneAndUpdate(
    { business: businessAndUser.business._id, _id: invoiceId },
    invoice,
    { new: true, runValidators: true }
  );
  if (!existingInvoice) {
    throw new NotFoundError();
  }
  return existingInvoice;
};

export const deleteInvoice = async (
  authorizationHeader: string,
  businessId: string,
  invoiceId: string
): Promise<Invoice> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  const existingInvoice = await InvoiceDB.findOneAndDelete({ business: businessAndUser.business._id, _id: invoiceId });
  if (!existingInvoice) {
    throw new NotFoundError();
  }
  return existingInvoice;
};

export const addInvoiceFile = async (
  authorizationHeader: string,
  businessId: string,
  invoiceId: string,
  file: UploadedFile
): Promise<File> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  const existingInvoice = await InvoiceDB.findOne({ business: businessAndUser.business._id, _id: invoiceId });
  if (!existingInvoice) {
    throw new NotFoundError();
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

export const deleteInvoiceFile = async (
  authorizationHeader: string,
  businessId: string,
  invoiceId: string
): Promise<Invoice> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  const existingInvoice = await InvoiceDB.findOne({ business: businessAndUser.business._id, _id: invoiceId });
  if (!existingInvoice) {
    throw new NotFoundError();
  }

  await deleteFile(existingInvoice.file.key);

  existingInvoice.file = undefined;

  await existingInvoice.save();

  return existingInvoice;
};
