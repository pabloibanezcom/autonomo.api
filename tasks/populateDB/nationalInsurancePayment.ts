/* eslint-disable @typescript-eslint/no-explicit-any */
import { Business } from '@autonomo/common';
import NationalInsurancePaymentDB from '../../src/models/nationalInsurancePayment';
import { log } from './log';

const generateNationalInsurancePayment = async (business: Business, paymentData: any): Promise<void> => {
  await NationalInsurancePaymentDB.create({
    business: business._id,
    person: business.soleTrader?._id,
    date: new Date(paymentData.date),
    amount: {
      amount: paymentData.amount,
      currency: business.defaultCurrency
    },
    description: paymentData.description
  });
  return;
};

const generateNationalInsurancePayments = async (xlsxData: any[]): Promise<void> => {
  await Promise.all(
    xlsxData.map(async businessData => {
      const newNationalInsurancePayments = await Promise.all(
        businessData.data.nationalInsurancePayments.map(async nationalInsurancePaymentData => {
          await generateNationalInsurancePayment(businessData.business, nationalInsurancePaymentData);
        })
      );

      log('NationalInsurancePayments generated', newNationalInsurancePayments.length, businessData.business.name);
    })
  );
};

export { generateNationalInsurancePayments };
