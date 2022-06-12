export const basicPerson = 'firstName lastName email gender color picture';

export const basicCompany = [{ path: 'name' }, { path: 'director', select: basicPerson }];

export const basicTaxYear = 'name country startDate endDate';
export const fullTaxYear = 'name country startDate endDate incomeTax dividendsTax vatBands';
