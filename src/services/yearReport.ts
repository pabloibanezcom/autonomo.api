import { roundTwoDigits, YearReport } from '@autonomo/common';
import { calculateProgressiveTax, calculateVATBalance } from '../util/tax';
import { getInvoices } from './invoice';
import { getNationalInsurancePayments } from './nationalInsurancePayment';
import { getTaxPayments } from './taxPayment';
import { getTaxYear } from './taxYear';
import { getUserById } from './user';

export const getYearReport = async (
  authorizationHeader: string,
  userId: string,
  taxYearId: string
): Promise<YearReport> => {
  const user = await getUserById(userId);
  const taxYear = await getTaxYear(taxYearId);
  const incomes = await getInvoices(
    authorizationHeader,
    userId,
    {
      type: 'income',
      startIssuedDate: taxYear.startDate,
      endIssuedDate: taxYear.endDate
    },
    '',
    user
  );
  const expenses = await getInvoices(
    authorizationHeader,
    userId,
    {
      type: 'expense',
      startIssuedDate: taxYear.startDate,
      endIssuedDate: taxYear.endDate
    },
    '',
    user
  );
  const nationalInsurancePayments = await getNationalInsurancePayments(
    authorizationHeader,
    userId,
    {
      startDate: taxYear.startDate,
      endDate: taxYear.endDate
    },
    user
  );

  const taxPayments = await getTaxPayments(
    authorizationHeader,
    userId,
    {
      startDate: taxYear.startDate,
      endDate: taxYear.endDate
    },
    user
  );

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
