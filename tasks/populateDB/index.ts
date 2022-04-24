import { Business, Category, Company, generateRandomColor, InvoiceType, Person, TaxYear, User } from '@autonomo/common';
import dotenv from 'dotenv';
import businesses from '../../mockData/businesses.json';
import categories from '../../mockData/categories.json';
import companies from '../../mockData/companies.json';
import invoicesExpenses from '../../mockData/invoices_expenses.json';
import invoicesIncomes from '../../mockData/invoices_incomes.json';
import nationalInsurancePayments from '../../mockData/national_insurance_payments.json';
import people from '../../mockData/people.json';
import taxPayments from '../../mockData/tax_payments.json';
import taxYears from '../../mockData/tax_years.json';
import connect from '../../src/connect';
import BusinessDB from '../../src/models/business';
import CategoryDB from '../../src/models/category';
import CompanyDB from '../../src/models/company';
import InvoiceDB from '../../src/models/invoice';
import NationalInsurancePaymentDB from '../../src/models/nationalInsurancePayment';
import PersonDB from '../../src/models/person';
import TaxPaymentDB from '../../src/models/taxPayment';
import TaxYearDB from '../../src/models/taxYear';
import UserDB from '../../src/models/user';

const generateDB = async (): Promise<boolean> => {
  const awsS3BucketLocation = process.env.AWS_S3_BUCKET_LOCATION;
  let user: User;
  let accountant: User;
  let mainPerson: Person;
  let business: Business;

  let generatedTaxYears: TaxYear[];

  const clearExistingData = async (): Promise<void> => {
    await TaxPaymentDB.deleteMany({});
    await NationalInsurancePaymentDB.deleteMany({});
    await InvoiceDB.deleteMany({});
    await CategoryDB.deleteMany({});
    await PersonDB.deleteMany({});
    await CompanyDB.deleteMany({});
    await TaxYearDB.deleteMany({});
    await BusinessDB.deleteMany({});
  };

  const getUsers = async (): Promise<void> => {
    user = await UserDB.findOne({ email: 'pabloiveron@gmail.com' });
    accountant = await UserDB.findOne({ email: 'accountant@gmail.com' });
  };

  const setUserMainBusiness = async (): Promise<void> => {
    user.defaultBusiness = business._id;
    await UserDB.findByIdAndUpdate(user._id, { ...user, defaultBusiness: business._id });
  };

  const getMainPerson = async (): Promise<void> => {
    mainPerson = await PersonDB.findOne({ email: 'pabloiveron@gmail.com' });
  };

  const getCompanyOrCreate = async (companyName: string): Promise<Company> => {
    const company = await CompanyDB.findOne({ business: business._id, name: companyName });
    if (company) {
      return company;
    }
    return await CompanyDB.create({ business: business._id, name: companyName });
  };

  const getPersonByEmail = async (personEmail: string): Promise<Person> => {
    return !personEmail ? undefined : await PersonDB.findOne({ email: personEmail });
  };

  const generateBusiness = async (): Promise<void> => {
    await Promise.all(
      businesses.map(async (b): Promise<Business> => {
        const newBusiness = await BusinessDB.create({
          ...b,
          soleTrader: mainPerson._id,
          authorisedPeople:
            b.name === 'Pablo Ibanez (Autonomo)'
              ? [
                  { user: user._id, grantType: 'Write' },
                  { user: accountant._id, grantType: 'View' }
                ]
              : []
        });
        if (newBusiness.name === 'Pablo Ibanez (Autonomo)') {
          business = newBusiness;
        }
        return newBusiness;
      })
    );
  };

  const generateTaxYears = async (): Promise<void> => {
    generatedTaxYears = await Promise.all(
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
        return await CompanyDB.create({
          ...company,
          business: business._id,
          director: await getPersonByEmail(company.director)
        });
      })
    );
  };

  const generateCategories = async (): Promise<void> => {
    const generateInvoiceCategories = async (): Promise<void> => {
      await Promise.all(
        categories.invoice.map(async (category): Promise<Category> => {
          return await CategoryDB.create({
            business: business._id,
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
    const categories = await CategoryDB.find({ business: business._id, type: 'invoice' });

    const generateInvoicesByType = async (type: InvoiceType): Promise<void> => {
      const invoices = type === 'income' ? invoicesIncomes : invoicesExpenses;
      for (const invoice of invoices) {
        await InvoiceDB.create({
          ...invoice,
          business: business._id,
          type: type,
          baseCurrency: invoice.totalBaseCurrency?.currency || invoice.total.currency,
          issuerOrClient: await getCompanyOrCreate(invoice.issuerOrClient),
          categories: invoice.categories.map(catName => categories.find(cat => cat.name === catName)._id),
          file: {
            key: invoice.file,
            location: `${awsS3BucketLocation}${invoice.file}`
          }
        });
      }
    };

    await generateInvoicesByType('income');
    await generateInvoicesByType('expense');
  };

  const generateNationalInsurancePayments = async (): Promise<void> => {
    await Promise.all(
      nationalInsurancePayments.map(async (niPayment): Promise<void> => {
        await NationalInsurancePaymentDB.create({ ...niPayment, business: business._id, person: mainPerson._id });
      })
    );
  };

  const generateTaxPayments = async (): Promise<void> => {
    await Promise.all(
      taxPayments.map(async (taxPayment): Promise<void> => {
        await TaxPaymentDB.create({
          ...taxPayment,
          business: business._id,
          taxYear: generatedTaxYears.find(year => year.name === taxPayment.taxYearName)._id
        });
      })
    );
  };

  await connect({ db: process.env.MONGODB_URI || '' });
  await clearExistingData();
  await getUsers();
  await generatePeople();
  await getMainPerson();
  await generateBusiness();
  await setUserMainBusiness();
  await generateTaxYears();
  await generateCompanies();
  await generateCategories();
  await generateInvoices();
  await generateNationalInsurancePayments();
  await generateTaxPayments();
  console.log('DB Populate job completed');
  return true;
};

dotenv.config();
generateDB();
