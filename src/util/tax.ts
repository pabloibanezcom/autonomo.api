import { Expense, Income, roundTwoDigits, TaxDefinition } from '@autonomo/common';

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

export const calculateVATBalance = (incomes: Income[], expenses: Expense[]): number => {
  const calculateIncomeVATSum = (): number => {
    return incomes.map(income => income.tax.amount).reduce((prev, next) => prev + next);
  };

  const calculateExpenseVATSum = (): number => {
    return expenses
      .map(expense => expense.deductibleTax?.amount || expense.tax.amount)
      .reduce((prev, next) => prev + next);
  };
  return roundTwoDigits(calculateIncomeVATSum() - calculateExpenseVATSum());
};
