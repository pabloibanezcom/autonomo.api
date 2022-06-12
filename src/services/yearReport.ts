import { GrantTypes, roundTwoDigits, YearReport } from '@autonomo/common';
import mongoose from 'mongoose';
import { calculateProgressiveTax, calculateVATBalance } from '../util/tax';
import { validateUser } from '../util/user';
import { getExpenses } from './expense';
import { getIncomes } from './income';
import { getNationalInsurancePayments } from './nationalInsurancePayment';
import { getTaxPayments } from './taxPayment';
import { getTaxYear } from './taxYear';

export const getYearReport = async (
  authorizationHeader: string,
  businessId: string,
  taxYearId: string
): Promise<YearReport> => {
  await validateUser(authorizationHeader, businessId, GrantTypes.View);

  const taxYear = await getTaxYear(taxYearId);

  const incomes = await getIncomes(businessId, {
    startIssuedDate: taxYear.startDate,
    endIssuedDate: taxYear.endDate
  });

  const expenses = await getExpenses(businessId, {
    startIssuedDate: taxYear.startDate,
    endIssuedDate: taxYear.endDate
  });

  const nationalInsurancePayments = await getNationalInsurancePayments(businessId, {
    startDate: taxYear.startDate,
    endDate: taxYear.endDate
  });

  const taxPayments = await getTaxPayments(businessId, {
    startDate: taxYear.startDate,
    endDate: taxYear.endDate
  });

  const incomesSum = roundTwoDigits(
    incomes.map(invoice => invoice.subtotal.amount).reduce((prev, next) => prev + next)
  );
  const expensesSum = roundTwoDigits(
    expenses.map(invoice => invoice.subtotal.amount).reduce((prev, next) => prev + next)
  );
  const nationalInsuranceSum = roundTwoDigits(
    nationalInsurancePayments.map(payment => payment.amount.amount).reduce((prev, next) => prev + next)
  );
  const incomeTaxPaidSum = roundTwoDigits(
    taxPayments
      .filter(taxPayment => taxPayment.type === 'incomeTax')
      .map(taxPayment => taxPayment.amount.amount)
      .reduce((prev, next) => prev + next)
  );
  const grossProfit = roundTwoDigits(incomesSum - (expensesSum + nationalInsuranceSum));
  const incomeTax = roundTwoDigits(calculateProgressiveTax(taxYear.incomeTax, grossProfit));

  return {
    business: new mongoose.Types.ObjectId(businessId),
    creationDate: new Date(),
    taxYear: taxYear._id,
    incomes: incomesSum,
    expenses: expensesSum,
    VATBalance: calculateVATBalance(incomes, expenses),
    nationalInsurance: nationalInsuranceSum,
    grossProfit: grossProfit,
    incomeTax: incomeTax,
    incomeTaxPaid: incomeTaxPaidSum,
    incomeTaxOwed: roundTwoDigits(incomeTax - incomeTaxPaidSum),
    netIncome: roundTwoDigits(grossProfit - incomeTax)
  };
};
