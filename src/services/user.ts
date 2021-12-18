import { Person } from '@autonomo/common';
import { auth0Client } from '../httpClient';
import PersonDB from '../models/person';

export const getUser = async (authorizationHeader: string): Promise<Person> => {
  const response = await auth0Client(authorizationHeader).get('/userinfo');
  if (response.data) {
    const person = await PersonDB.findOne({ auth0UserId: response.data.sub });
    if (person) {
      return person;
    } else {
      const newPerson = new PersonDB({
        auth0UserId: response.data.sub,
        firstName: response.data.given_name,
        lastName: response.data.family_name,
        email: response.data.email,
        picture: response.data.picture
      });
      await newPerson.save();
      return newPerson;
    }
  }
  return null;
};
