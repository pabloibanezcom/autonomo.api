import { Invoice } from '@autonomo/common';
import InvoiceDB from '../models/invoice';

export const getInvoices = async (): Promise<Invoice[]> => {
  const invoices = InvoiceDB.find({}).populate('to');
  return invoices;
};

export const addInvoice = async (invoice: Invoice): Promise<Invoice> => {
  const newInvoice = new InvoiceDB(invoice);
  await newInvoice.save();
  return newInvoice;
};
