import {
  Business,
  BusinessPerson,
  Category,
  Company,
  generateAltColor,
  generateRandomColor,
  GrantTypes,
  Person,
  TaxYear,
  User
} from '@autonomo/common';
import dotenv from 'dotenv';
import businesses from '../../mockData/businesses.json';
import categories from '../../mockData/categories.json';
import companies from '../../mockData/companies.json';
import expenses from '../../mockData/expenses.json';
import incomes from '../../mockData/incomes.json';
import nationalInsurancePayments from '../../mockData/national_insurance_payments.json';
import people from '../../mockData/people.json';
import taxPayments from '../../mockData/tax_payments.json';
import taxYears from '../../mockData/tax_years.json';
import connect from '../../src/connect';
import BusinessDB from '../../src/models/business';
import CategoryDB from '../../src/models/category';
import CompanyDB from '../../src/models/company';
import ExpenseDB from '../../src/models/expense';
import IncomeDB from '../../src/models/income';
import NationalInsurancePaymentDB from '../../src/models/nationalInsurancePayment';
import PersonDB from '../../src/models/person';
import TaxPaymentDB from '../../src/models/taxPayment';
import TaxYearDB from '../../src/models/taxYear';
import UserDB from '../../src/models/user';

const generateDB = async (): Promise<boolean> => {
  const awsS3BucketLocation = process.env.AWS_S3_BUCKET_LOCATION;
  let mainUser: User;
  let mainPerson: Person;
  let business: Business;

  let generatedTaxYears: TaxYear[];

  const clearExistingData = async (): Promise<void> => {
    await TaxPaymentDB.deleteMany({});
    await NationalInsurancePaymentDB.deleteMany({});
    await ExpenseDB.deleteMany({});
    await IncomeDB.deleteMany({});
    await CategoryDB.deleteMany({});
    await PersonDB.deleteMany({});
    await CompanyDB.deleteMany({});
    await TaxYearDB.deleteMany({});
    await BusinessDB.deleteMany({});
  };

  const getUsers = async (): Promise<void> => {
    mainUser = (await UserDB.findOne({ email: 'pabloiveron@gmail.com' })) as User;
    mainUser.businesses = [];
  };

  const setUserBusinesses = async (): Promise<void> => {
    mainUser.defaultBusiness = business._id;
    await UserDB.findByIdAndUpdate(mainUser._id, { ...mainUser, defaultBusiness: business._id });
  };

  const getMainPerson = async (): Promise<void> => {
    mainPerson = (await PersonDB.findOne({ email: 'pabloiveron@gmail.com' })) as Person;
  };

  const getCompanyOrCreate = async (companyName: string): Promise<Company> => {
    const company = await CompanyDB.findOne({ business: business._id, name: companyName });
    if (company) {
      return company;
    }
    return await CompanyDB.create({ business: business._id, name: companyName, color: generateRandomColor() });
  };

  const getPersonByEmail = async (personEmail: string): Promise<Person> => {
    return !personEmail ? undefined : ((await PersonDB.findOne({ email: personEmail })) as Person);
  };

  const setBusinessCompanies = async (): Promise<void> => {
    let count = 0;
    for (const b of businesses) {
      for (const c of companies) {
        if (b.name === c.name) {
          const companyDoc = await CompanyDB.findOne({ name: c.name });
          await BusinessDB.findOneAndUpdate({ name: b.name }, { company: companyDoc?.id });
          count++;
        }
      }
    }
    console.log(`Business companies set: ${count}`);
  };

  const generateBusiness = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformBusinessPerson = async (people: any[]): Promise<BusinessPerson[]> => {
      const result = [];
      for (const p of people) {
        const person = await PersonDB.findOne({ email: p.email });
        result.push({
          ...p,
          person: person.id
        });
      }

      return result;
    };

    await Promise.all(
      businesses.map(async (b): Promise<Business> => {
        const businessPeople = await transformBusinessPerson(b.people);
        const aux = {
          ...b,
          soleTrader: b.type === 'sole-trader' ? mainPerson._id : undefined,
          people: businessPeople
        };
        const newBusiness = await BusinessDB.create(aux);
        if (newBusiness.name === 'Pablo Ibanez') {
          business = newBusiness;
        }
        businessPeople.forEach(bP => {
          if (mainPerson._id.toString().includes(bP.person.toString())) {
            mainUser.businesses.push({
              business: newBusiness.id,
              grantType: GrantTypes.Write,
              role: bP.role
            });
          }
        });
        return newBusiness;
      })
    );

    await UserDB.findByIdAndUpdate(mainUser._id, { ...mainUser });
  };

  const generateTaxYears = async (): Promise<void> => {
    generatedTaxYears = await Promise.all(
      taxYears.map(async (taxYear): Promise<TaxYear> => {
        return await TaxYearDB.create(taxYear);
      })
    );
  };

  const generatePeople = async (): Promise<void> => {
    let count = 0;
    await Promise.all(
      people.map(async (person): Promise<Person> => {
        const p = await PersonDB.create({ ...person, color: generateRandomColor() });
        count++;
        return p;
      })
    );
    console.log(`People generated: ${count}`);
  };

  const generateCompanies = async (): Promise<void> => {
    let count = 0;
    await Promise.all(
      companies.map(async (company): Promise<Company> => {
        const c = await CompanyDB.create({
          ...company,
          business: business._id,
          director: await getPersonByEmail(company.director),
          color: generateRandomColor()
        });
        count++;
        return c;
      })
    );
    console.log(`Companies generated: ${count}`);
  };

  const generateCategories = async (): Promise<void> => {
    let count = 0;
    const generateInvoiceCategories = async (): Promise<void> => {
      await Promise.all(
        categories.invoice.map(async (category): Promise<Category> => {
          const color = generateRandomColor();
          const c = await CategoryDB.create({
            business: business._id,
            name: category,
            color,
            altColor: generateAltColor(color),
            type: 'invoice'
          });
          count++;
          return c;
        })
      );
    };

    await generateInvoiceCategories();
    console.log(`Categories generated: ${count}`);
  };

  const generateIncomes = async (): Promise<void> => {
    let count = 0;
    const categories = await CategoryDB.find({ business: business._id, type: 'invoice' });
    for (const income of incomes) {
      await IncomeDB.create({
        ...income,
        business: business._id,
        baseCurrency: income.totalBaseCurrency?.currency || income.total.currency,
        client: await getCompanyOrCreate(income.client),
        categories: income.categories.map(catName => categories.find(cat => cat.name === catName)._id),
        file: {
          key: income.file,
          location: `${awsS3BucketLocation}${income.file}`
        }
      });
      count++;
    }
    console.log(`Incomes generated: ${count}`);
  };

  const generateExpenses = async (): Promise<void> => {
    let count = 0;
    const categories = await CategoryDB.find({ business: business._id, type: 'invoice' });
    for (const expense of expenses) {
      await ExpenseDB.create({
        ...expense,
        business: business._id,
        baseCurrency: expense.totalBaseCurrency?.currency || expense.total.currency,
        issuer: await getCompanyOrCreate(expense.issuer),
        categories: expense.categories.map(catName => categories.find(cat => cat.name === catName)._id),
        file: {
          key: expense.file,
          location: `${awsS3BucketLocation}${expense.file}`
        }
      });
      count++;
    }
    console.log(`Expenses generated: ${count}`);
  };

  const generateNationalInsurancePayments = async (): Promise<void> => {
    let count = 0;
    await Promise.all(
      nationalInsurancePayments.map(async (niPayment): Promise<void> => {
        await NationalInsurancePaymentDB.create({ ...niPayment, business: business._id, person: mainPerson._id });
        count++;
      })
    );
    console.log(`National Insurance Payments generated: ${count}`);
  };

  const generateTaxPayments = async (): Promise<void> => {
    let count = 0;
    await Promise.all(
      taxPayments.map(async (taxPayment): Promise<void> => {
        await TaxPaymentDB.create({
          ...taxPayment,
          business: business._id,
          taxYear: generatedTaxYears.find(year => year.name === taxPayment.taxYearName)._id
        });
        count++;
      })
    );
    console.log(`Tax Payments generated: ${count}`);
  };

  await connect({ db: process.env.MONGODB_URI || '' });
  await clearExistingData();
  await getUsers();
  await generatePeople();
  await getMainPerson();
  await generateBusiness();
  await setUserBusinesses();
  await generateTaxYears();
  await generateCompanies();
  await setBusinessCompanies();
  await generateCategories();
  // await generateIncomes();
  console.log(`Skipping generateIncomes: ${!!generateIncomes}`);
  await generateExpenses();
  await generateNationalInsurancePayments();
  await generateTaxPayments();
  console.log('DB Populate job completed');
  return true;
};

dotenv.config();
generateDB();
