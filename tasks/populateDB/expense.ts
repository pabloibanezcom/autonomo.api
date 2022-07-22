/* eslint-disable @typescript-eslint/no-explicit-any */
import { Business, Currency, CurrencyAmount, InvoiceProductOrService } from '@autonomo/common';
import ExpenseDB from '../../src/models/expense';
import { getCategoriesByName } from './category';
import { getCompanyOrCreate } from './company';
import { log } from './log';

const generateExpense = async (business: Business, expenseData: any): Promise<void> => {
  if (!business._id) {
    return;
  }
  const generateCurrencyAmount = (
    amount: number,
    currency: Currency = business.defaultCurrency as Currency
  ): CurrencyAmount => {
    return {
      amount,
      currency
    };
  };

  const baseAmount = (amount: number): CurrencyAmount | undefined => {
    return expenseData.baseCurrency !== business.defaultCurrency
      ? {
          amount: amount,
          currency: expenseData.baseCurrency
        }
      : undefined;
  };

  const generateProductsOrServices = (): InvoiceProductOrService[] => {
    return [];
  };

  const issuer = await getCompanyOrCreate(expenseData.issuer, business._id.toString());

  await ExpenseDB.create({
    business: business._id,
    number: expenseData.number,
    issuer: issuer._id,
    description: expenseData.description,
    issuedDate: new Date(expenseData.issuedDate),
    paymentDate: new Date(expenseData.issuedDate),
    productsOrServices: generateProductsOrServices(),
    categories: (await getCategoriesByName(expenseData.categories)).map(c => c._id),
    baseCurrency: expenseData.baseCurrency,
    exchangeRate: expenseData.exchangeRate,
    isDeductible: expenseData.isDeductible,
    deductibleTaxPct: expenseData.deductibleTaxPct,
    deductibleTax: generateCurrencyAmount(expenseData.deductibleTax),
    taxPct: expenseData.taxPct,
    subtotalBaseCurrency: baseAmount(expenseData.subtotalBaseCurrency),
    subtotal: generateCurrencyAmount(expenseData.subtotal),
    tax: generateCurrencyAmount(expenseData.subtotal * expenseData.taxPct),
    taxBaseCurrency: baseAmount(expenseData.subtotalBaseCurrency * expenseData.taxPct),
    total: generateCurrencyAmount(expenseData.subtotal + expenseData.subtotal * expenseData.taxPct),
    totalBaseCurrency: baseAmount(
      expenseData.subtotalBaseCurrency + expenseData.subtotalBaseCurrency * expenseData.taxPct
    )
  });
  return;
};

const generateExpenses = async (xlsxData: any[]): Promise<void> => {
  const generateExpensesForBusiness = async (business: Business, expenses: any[]): Promise<number> => {
    let expensesCount = 0;
    for (const expenseData of expenses) {
      await generateExpense(business, expenseData);
      expensesCount++;
    }
    return expensesCount;
  };

  await Promise.all(
    xlsxData.map(async businessData => {
      const businessExpensesGenerated = await generateExpensesForBusiness(businessData.business, businessData.expenses);

      log('Expenses generated', businessExpensesGenerated, businessData.business.name);
    })
  );
};

export { generateExpenses };
