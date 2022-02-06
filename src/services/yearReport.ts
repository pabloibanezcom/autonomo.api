import { GrantTypes, roundTwoDigits, YearReport } from '@autonomo/common';
import { calculateProgressiveTax, calculateVATBalance } from '../util/tax';
import { validateUser } from '../util/user';
import { searchInvoices } from './invoice';
import { searchNationalInsurancePayments } from './nationalInsurancePayment';
import { searchTaxPayments } from './taxPayment';
import { getTaxYear } from './taxYear';

export const getYearReport = async (
  authorizationHeader: string,
  businessId: string,
  taxYearId: string
): Promise<YearReport> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.View);

  const taxYear = await getTaxYear(taxYearId);

  const incomes = await searchInvoices(businessAndUser.business._id.toString(), {
    type: 'income',
    startIssuedDate: taxYear.startDate,
    endIssuedDate: taxYear.endDate
  });

  const expenses = await searchInvoices(businessAndUser.business._id.toString(), {
    type: 'expense',
    startIssuedDate: taxYear.startDate,
    endIssuedDate: taxYear.endDate
  });

  const nationalInsurancePayments = await searchNationalInsurancePayments(businessAndUser.business._id.toString(), {
    startDate: taxYear.startDate,
    endDate: taxYear.endDate
  });

  const taxPayments = await searchTaxPayments(businessAndUser.business._id.toString(), {
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
    business: businessAndUser.business._id,
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
