/* eslint-disable @typescript-eslint/no-explicit-any */
import { Business } from '@autonomo/common';
import TaxPaymentDB from '../../src/models/taxPayment';
import { log } from './log';
import { getTaxYearByDateAndCountry } from './taxYear';

const generateTaxPayment = async (business: Business, taxPaymentData: any): Promise<void> => {
  const taxYear = await getTaxYearByDateAndCountry(new Date(taxPaymentData.date), business.country);
  await TaxPaymentDB.create({
    business: business._id,
    taxYear: taxYear._id,
    type: taxPaymentData.type,
    date: new Date(taxPaymentData.paymentDate),
    amount: {
      amount: taxPaymentData.amount,
      currency: business.defaultCurrency
    },
    description: taxPaymentData.description
  });
  return;
};

const generateTaxPayments = async (xlsxData: any[]): Promise<void> => {
  await Promise.all(
    xlsxData.map(async businessData => {
      const newTaxPayments = await Promise.all(
        businessData.data.taxPayments.map(async taxPaymentData => {
          await generateTaxPayment(businessData.business, taxPaymentData);
        })
      );

      log('TaxPayments generated', newTaxPayments.length, businessData.business.name);
    })
  );
};

export { generateTaxPayments };
