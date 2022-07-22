/* eslint-disable @typescript-eslint/no-explicit-any */
import { Gender, generateRandomColor, Person } from '@autonomo/common';
import PersonDB from '../../src/models/person';
import UserDB from '../../src/models/user';
import { log } from './log';

type MockPersonData = {
  firstName: string;
  lastName: string;
  email: string;
  nif: string;
  gender: string;
  picture: string;
};

const getPersonByEmail = async (personEmail: string): Promise<Person | undefined> => {
  return !personEmail ? undefined : ((await PersonDB.findOne({ email: personEmail })) as Person);
};

const generatePeople = async (people: MockPersonData[]): Promise<void> => {
  const newPeople = await Promise.all(
    people.map(async (person): Promise<Person> => {
      const p = await PersonDB.create({ ...person, gender: person.gender as Gender, color: generateRandomColor() });
      const user = await UserDB.findOne({ email: person.email });
      if (user) {
        user.person = p.id;
        await user.save();
      }
      return p;
    })
  );
  log('People generated', newPeople.length);
};

export { getPersonByEmail, generatePeople };
