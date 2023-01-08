import { BusinessRole, Expense, GrantType, Income, Invoice, User, UserBusiness } from '@autonomo/common';
import mongoose from 'mongoose';

const mockInvoice = (mockData: { subtotal?: number; taxPct?: number }): Invoice => {
  const _taxPct = mockData.taxPct || 20;
  const _subototal = mockData.subtotal || 1000;
  const _tax = _subototal * (_taxPct / 100);

  return {
    business: new mongoose.Types.ObjectId('634694d2a64fc9ee4bfd5c46'),
    issuedDate: new Date(),
    baseCurrency: 'GBP',
    subtotal: {
      amount: _subototal,
      currency: 'GBP'
    },
    taxPct: _taxPct,
    tax: {
      amount: _tax,
      currency: 'GBP'
    },
    total: {
      amount: _subototal + _tax,
      currency: 'GBP'
    }
  };
};

export const mockIncome = (mockData: { subtotal?: number; taxPct?: number }): Income => {
  return { ...mockInvoice(mockData), client: new mongoose.Types.ObjectId('634694d2a64fc9ee4bfd5b76') };
};

export const mockExpense = (mockData: { subtotal?: number; taxPct?: number }): Expense => {
  return {
    ...mockInvoice(mockData),
    issuer: new mongoose.Types.ObjectId('634694d2a64fc9ee4bfd5b76'),
    isDeductible: true
  };
};

export const mockUser = (mockData: { email?: string; businesses?: UserBusiness[] }): User => {
  return {
    _id: new mongoose.Types.ObjectId('634694d2a64fc9ee11fd5b76'),
    email: mockData.email,
    password: '1234',
    person: {
      _id: new mongoose.Types.ObjectId('634694d2a64fc9ee11fd5b89'),
      email: 'anotherPerson@gmail.com'
    },
    businesses: mockData.businesses || []
  };
};

export const mockUserBusiness = (mockData: {
  business?: string;
  grantType?: GrantType;
  role: BusinessRole;
}): UserBusiness => {
  return {
    business: new mongoose.Types.ObjectId(mockData.business),
    grantType: mockData.grantType,
    role: mockData.role
  };
};
