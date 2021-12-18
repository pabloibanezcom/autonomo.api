import { Company } from '@autonomo/common';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../server';
import { login } from './auth';
import { generateCompany } from './data/company';
import { endpointName, testName } from './util/names';

let token: string;
let companyA: Company;
beforeAll(async () => {
  await mongoose.connect(`${process.env.MONGODB_TEST_URI}-company`);
  token = await login();
  companyA = await generateCompany();
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe(endpointName('GET', '/company'), () => {
  test(testName(401, 'No token provided'), async () => {
    await supertest(app).get('/v1/company').expect(401);
  });
  test(testName(200, 'It retrieves list of companies'), async () => {
    await supertest(app)
      .get('/v1/company')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(response => {
        expect(response.body.length).toEqual(1);
        expect(response.body[0].name).toBe(companyA.name);
      });
  });
});
