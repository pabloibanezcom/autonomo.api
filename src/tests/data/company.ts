import { Company } from '@autonomo/common';
import CompanyDB from '../../models/company';
import companies from './mockData/companies.json';
import { generatePerson } from './person';

export const generateCompany = async (): Promise<Company> => {
  return await CompanyDB.create({ ...companies[0], director: await generatePerson() });
};
