import { Person } from '@autonomo/common';
import mongoose from 'mongoose';
import supertest from 'supertest';
import people from '../../mockData/people.json';
import app from '../server';
import { login } from './auth';
import { generatePerson } from './data/person';
import { endpointName, testName } from './util/names';

let token: string;
let personA: Person;
beforeAll(async () => {
  await mongoose.connect(`${process.env.MONGODB_TEST_URI}-person`);
  token = await login();
  console.log('token', token);
  personA = await generatePerson();
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe(endpointName('GET', '/person'), () => {
  test(testName(401, 'No token provided'), async () => {
    await supertest(app).get('/v1/person').expect(401);
  });
  test(testName(200, 'It retrieves list of people'), async () => {
    await supertest(app)
      .get('/v1/person')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(response => {
        expect(response.body.length).toEqual(1);
        expect(response.body[0].firstName).toBe(personA.firstName);
        expect(response.body[0].lastName).toBe(personA.lastName);
      });
  });
});

describe(endpointName('GET', '/person/:id'), () => {
  test(testName(401, 'No token provided'), async () => {
    await supertest(app).get('/v1/person/61ab83da084a3d0e9aa278a5').expect(401);
  });
  test(testName(404, 'No person found'), async () => {
    await supertest(app).get('/v1/person/61ab83da084a3d0e9aa278a5').set('Authorization', `Bearer ${token}`).expect(404);
  });
  test(testName(200, 'Returns person if exists'), async () => {
    await supertest(app)
      .get(`/v1/person/${personA._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(response => {
        expect(response.body.email).toBe(personA.email);
        expect(response.body.firstName).toBe(personA.firstName);
        expect(response.body.lastName).toBe(personA.lastName);
      });
  });
});

describe(endpointName('POST', '/person'), () => {
  test(testName(401, 'No token provided'), async () => {
    await supertest(app).post('/v1/person').expect(401);
  });
  test(testName(400, 'Wrong payload posted (no email)'), async () => {
    await supertest(app)
      .post('/v1/person')
      .send({ ...personA, email: undefined })
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });
  test(testName(201, 'Person added successfully'), async () => {
    let newPerson;
    await supertest(app)
      .post('/v1/person')
      .send(people[1])
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .then(response => {
        expect(response.body.email).toBe(people[1].email);
        expect(response.body.firstName).toBe(people[1].firstName);
        expect(response.body.lastName).toBe(people[1].lastName);
        newPerson = response.body;
      });
    await supertest(app)
      .get(`/v1/person/${newPerson._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(response => {
        expect(response.body.email).toBe(newPerson.email);
        expect(response.body.firstName).toBe(newPerson.firstName);
        expect(response.body.lastName).toBe(newPerson.lastName);
      });
  });
});

describe(endpointName('PUT', '/person/:id'), () => {
  test(testName(401, 'No token provided'), async () => {
    await supertest(app).post('/v1/person/61ab83da084a3d0e9aa278a5').expect(401);
  });
});

describe(endpointName('DELETE', '/person/:id'), () => {
  test(testName(401, 'No token provided'), async () => {
    await supertest(app).post('/v1/person/11111111').expect(401);
  });
});
