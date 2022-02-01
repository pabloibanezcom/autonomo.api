import { Category, Company, Person, TaxYear } from '@autonomo/common';
import dotenv from 'dotenv';
import categories from '../../mockData/categories.json';
import companies from '../../mockData/companies.json';
import invoicesExpenses from '../../mockData/invoices_expenses.json';
import invoicesIncomes from '../../mockData/invoices_incomes.json';
import people from '../../mockData/people.json';
import taxYears from '../../mockData/tax_years.json';
import connect from '../../src/connect';
import CategoryDB from '../../src/models/category';
import CompanyDB from '../../src/models/company';
import InvoiceDB from '../../src/models/invoice';
import PersonDB from '../../src/models/person';
import TaxYearDB from '../../src/models/taxYear';
import { generateRandomColor } from '../../src/util/color';

const generateDB = async (): Promise<boolean> => {
  const awsS3BucketLocation = process.env.AWS_S3_BUCKET_LOCATION;
  console.log(awsS3BucketLocation);
  let user: Person;

  const clearExistingData = async (): Promise<void> => {
    await InvoiceDB.deleteMany({});
    await CategoryDB.deleteMany({});
    await PersonDB.deleteMany({ auth0UserId: null });
    await CompanyDB.deleteMany({});
    await TaxYearDB.deleteMany({});
  };

  const getUser = async (): Promise<void> => {
    user = await PersonDB.findOne({ email: 'pabloiveron@gmail.com' });
  };

  const getCompanyOrCreate = async (companyName: string): Promise<Company> => {
    const company = await CompanyDB.findOne({ name: companyName });
    console.log(company);
    if (company) {
      return company;
    }
    return await CompanyDB.create({ name: companyName });
  };

  const getPersonByEmail = async (personEmail: string): Promise<Person> => {
    return !personEmail ? undefined : await PersonDB.findOne({ email: personEmail });
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
        return await CompanyDB.create({ ...company, director: await getPersonByEmail(company.director) });
      })
    );
  };

  const generateCategories = async (): Promise<void> => {
    const generateInvoiceCategories = async (): Promise<void> => {
      await Promise.all(
        categories.invoice.map(async (category): Promise<Category> => {
          return await CategoryDB.create({
            user: user._id,
            name: category,
            color: generateRandomColor(),
            type: 'invoice'
          });
        })
      );
    };

    await generateInvoiceCategories();
  };

  const generateInvoices = async (): Promise<void> => {
    const categories = await CategoryDB.find({ type: 'invoice' });
    const generateInvoicesByType = async (isIncomes: boolean): Promise<void> => {
      const invoices = isIncomes
        ? invoicesIncomes.map(inv => {
            return { ...inv, issuer: null };
          })
        : invoicesExpenses.map(inv => {
            return { ...inv, client: null };
          });
      for (const invoice of invoices) {
        const issuer = isIncomes ? user : await getCompanyOrCreate(invoice.issuer);
        const client = !isIncomes ? user : await getCompanyOrCreate(invoice.client);
        await InvoiceDB.create({
          ...invoice,
          issuer: issuer._id,
          issuerType: isIncomes ? 'Person' : 'Company',
          client: client._id,
          clientType: !isIncomes ? 'Person' : 'Company',
          categories: invoice.categories.map(catName => categories.find(cat => cat.name === catName)._id),
          file: {
            key: invoice.file,
            location: `${awsS3BucketLocation}${invoice.file}`
          }
        });
      }
    };

    await generateInvoicesByType(true);
    await generateInvoicesByType(false);
  };

  await connect({ db: process.env.MONGODB_URI || '' });
  await clearExistingData();
  await getUser();
  await generateTaxYears();
  await generatePeople();
  await generateCompanies();
  await generateCategories();
  await generateInvoices();
  console.log('DB Populate job completed');
  return true;
};

dotenv.config();
generateDB();
