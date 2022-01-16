import { Company } from '@autonomo/common';
import companies from '../../../mockData/companies.json';
import CompanyDB from '../../models/company';
import { generatePerson } from './person';

export const generateCompany = async (): Promise<Company> => {
  return await CompanyDB.create({ ...companies[0], director: await generatePerson() });
};
