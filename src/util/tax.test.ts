import { Expense, Income, TaxDefinition } from '@autonomo/common';
import { mockExpense, mockIncome } from '../../tests/util/mockData';
import { calculateProgressiveTax, calculateVATBalance } from './tax';

describe('tax', () => {
  describe('calculateProgressiveTax', () => {
    const taxDefinitionA: TaxDefinition = {
      name: 'Mock Tax A',
      taxBands: [
        {
          start: 0,
          end: 12450,
          rate: 18
        },
        {
          start: 12450,
          end: 20000,
          rate: 22
        }
      ]
    };

    const taxDefinitionB: TaxDefinition = {
      name: 'Mock Tax B',
      taxBands: [
        {
          start: 0,
          end: 10000,
          rate: 16
        },
        {
          start: 10000,
          end: 20000,
          rate: 23
        },
        {
          start: 20000,
          rate: 28
        }
      ]
    };

    test('calculates tax for a gross proft given a tax definition', () => {
      expect(calculateProgressiveTax(taxDefinitionA, 5000)).toBe(900);
      expect(calculateProgressiveTax(taxDefinitionA, 12000)).toBe(2160);
      expect(calculateProgressiveTax(taxDefinitionA, 18000)).toBe(3462);
      expect(calculateProgressiveTax(taxDefinitionA, 68000)).toBe(3902);

      expect(calculateProgressiveTax(taxDefinitionB, 5000)).toBe(800);
      expect(calculateProgressiveTax(taxDefinitionB, 12000)).toBe(2060);
      expect(calculateProgressiveTax(taxDefinitionB, 18000)).toBe(3440);
      expect(calculateProgressiveTax(taxDefinitionB, 68000)).toBe(17340);
    });
  });

  describe('calculateVATBalance', () => {
    const incomes: Income[] = [mockIncome({ subtotal: 10000, taxPct: 20 }), mockIncome({ subtotal: 600, taxPct: 10 })];
    const expenses: Expense[] = [
      mockExpense({ subtotal: 60, taxPct: 20 }),
      mockExpense({ subtotal: 890, taxPct: 20 }),
      mockExpense({ subtotal: 450, taxPct: 0 })
    ];

    test('calculates VAT balance from incomes and expenses', () => {
      const result: number = calculateVATBalance(incomes, expenses);
      expect(result).toBe(1780);
    });
  });
});
