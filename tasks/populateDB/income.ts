/* eslint-disable @typescript-eslint/no-explicit-any */
import { Business, Currency, CurrencyAmount, InvoiceProductOrService } from '@autonomo/common';
import IncomeDB from '../../src/models/income';
import { getCategoriesByName } from './category';
import { getCompanyOrCreate } from './company';
import { log } from './log';

const generateIncome = async (business: Business, incomeData: any, incomeServices: any[]): Promise<void> => {
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
    return incomeData.baseCurrency !== business.defaultCurrency
      ? {
          amount: amount,
          currency: incomeData.baseCurrency
        }
      : undefined;
  };

  const generateProductsOrServices = (): InvoiceProductOrService[] => {
    const dailyRate = incomeServices.find(item => item.number === incomeData.number)?.dailyRate;
    if (!dailyRate) {
      return [];
    }

    const quantity = incomeData.subtotalBaseCurrency / dailyRate;

    return [
      {
        descriptionLine1: 'Web consultancy services / Servicios consultoria web',
        descriptionLine2: `£${dailyRate}/day`,
        quantity: quantity,
        unitPrice: generateCurrencyAmount(dailyRate, incomeData.baseCurrency),
        subtotal: generateCurrencyAmount(dailyRate * quantity, incomeData.baseCurrency),
        taxPct: incomeData.taxPct,
        tax: generateCurrencyAmount(dailyRate * quantity * incomeData.taxPct, incomeData.baseCurrency),
        total: generateCurrencyAmount(
          dailyRate * quantity + dailyRate * quantity * incomeData.taxPct,
          incomeData.baseCurrency
        )
      }
    ];
  };

  const client = await getCompanyOrCreate(incomeData.client, business._id.toString());

  await IncomeDB.create({
    business: business._id,
    number: incomeData.number,
    client: client._id,
    issuedDate: new Date(incomeData.issuedDate),
    paymentDate: incomeData.paymentDate ? new Date(incomeData.paymentDate) : undefined,
    productsOrServices: generateProductsOrServices(),
    categories: (await getCategoriesByName(incomeData.categories)).map(c => c._id),
    baseCurrency: incomeData.baseCurrency,
    exchangeRate: incomeData.exchangeRate,
    taxPct: incomeData.taxPct,
    subtotalBaseCurrency: baseAmount(incomeData.subtotalBaseCurrency),
    subtotal: generateCurrencyAmount(incomeData.subtotal),
    tax: generateCurrencyAmount(incomeData.subtotal * incomeData.taxPct),
    taxBaseCurrency: baseAmount(incomeData.subtotalBaseCurrency * incomeData.taxPct),
    total: generateCurrencyAmount(incomeData.subtotal + incomeData.subtotal * incomeData.taxPct),
    totalBaseCurrency: baseAmount(incomeData.subtotalBaseCurrency + incomeData.subtotalBaseCurrency * incomeData.taxPct)
  });
  return;
};

const generateIncomes = async (xlsxData: any[], incomeServices: any[]): Promise<void> => {
  const generateIncomesForBusiness = async (business: Business, incomes: any[]): Promise<number> => {
    let incomesCount = 0;
    for (const incomeData of incomes) {
      await generateIncome(business, incomeData, incomeServices);
      incomesCount++;
    }
    return incomesCount;
  };

  await Promise.all(
    xlsxData.map(async businessData => {
      const businessIncomesGenerated = await generateIncomesForBusiness(businessData.business, businessData.incomes);

      log('Incomes generated', businessIncomesGenerated, businessData.business.name);
    })
  );
};

export { generateIncomes };
