import { Company, Invoice, Person, TaxYear } from '@autonomo/common';
import dotenv from 'dotenv';
import companies from '../../mockData/companies.json';
import invoicesExpenses from '../../mockData/invoices_expenses.json';
import invoicesIncomes from '../../mockData/invoices_incomes.json';
import people from '../../mockData/people.json';
import taxYears from '../../mockData/tax_years.json';
import connect from '../../src/connect';
import CompanyDB from '../../src/models/company';
import InvoiceDB from '../../src/models/invoice';
import PersonDB from '../../src/models/person';
import TaxYearDB from '../../src/models/taxYear';

const generateDB = async (): Promise<boolean> => {
  const clearExistingData = async (): Promise<void> => {
    await InvoiceDB.deleteMany({});
    await PersonDB.deleteMany({ auth0UserId: null });
    await CompanyDB.deleteMany({});
    await TaxYearDB.deleteMany({});
  };

  const getPersonOrCompany = async (str: string): Promise<{ objType: string; personOrCompany: Person | Company }> => {
    let personOrCompany;
    let objType;
    if (str.includes('@')) {
      personOrCompany = await PersonDB.findOne({ email: str });
      objType = 'Person';
    } else {
      personOrCompany = await CompanyDB.findOne({ name: str });
      objType = 'Company';
    }
    return {
      objType,
      personOrCompany
    };
  };

  const generateTaxYears = async (): Promise<void> => {
    await Promise.all(
      taxYears.map(async (taxYear): Promise<TaxYear> => {
        return await TaxYearDB.create(taxYear);
      })
    );
  };

  const generatePeople = async (): Promise<void> => {
    await Promise.all(
      people.map(async (person): Promise<Person> => {
        return await PersonDB.create(person);
      })
    );
  };

  const generateCompanies = async (): Promise<void> => {
    await Promise.all(
      companies.map(async (company): Promise<Company> => {
        return await CompanyDB.create(company);
      })
    );
  };

  const generateInvoices = async (): Promise<void> => {
    await Promise.all(
      [...invoicesIncomes, ...invoicesExpenses].map(async (invoice): Promise<Invoice> => {
        const issuer = await getPersonOrCompany(invoice.issuer);
        const client = await getPersonOrCompany(invoice.client);
        if (!issuer || !client) {
          return;
        }
        return await InvoiceDB.create({
          ...invoice,
          issuer: issuer.personOrCompany._id,
          issuerType: issuer.objType,
          client: client.personOrCompany._id,
          clientType: client.objType
        });
      })
    );
  };

  await connect({ db: process.env.MONGODB_URI || '' });
  await clearExistingData();
  await generateTaxYears();
  await generatePeople();
  await generateCompanies();
  await generateInvoices();
  console.log('DB Populate job completed');
  return true;
};

dotenv.config();
generateDB();
