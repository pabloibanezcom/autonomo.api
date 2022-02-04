import { Invoice, roundTwoDigits, TaxDefinition } from '@autonomo/common';

export const calculateProgressiveTax = (taxDefinition: TaxDefinition, grossProfit: number): number => {
  let result = 0;
  let remaining = grossProfit;
  taxDefinition.taxBands.forEach(band => {
    const taxableAmount = band.end ? Math.min(remaining, band.end - band.start) : remaining;
    result += taxableAmount * (band.rate / 100);
    remaining -= taxableAmount;
  });
  return result;
};

export const calculateVATBalance = (incomes: Invoice[], expenses: Invoice[]): number => {
  const calculateVATSum = (invoices: Invoice[]): number => {
    return invoices
      .map(invoice => invoice.deductibleTax?.amount || invoice.tax.amount)
      .reduce((prev, next) => prev + next);
  };
  return roundTwoDigits(calculateVATSum(incomes) - calculateVATSum(expenses));
};
