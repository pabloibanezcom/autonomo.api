import { Person } from '@autonomo/common';
import { auth0Client } from '../httpClient';
import { UnauthorizedError } from '../httpError/httpErrors';
import PersonDB from '../models/person';

interface Auth0UserData {
  sub: string;
  given_name: string;
  family_name: string;
  email: string;
  picture: string;
}

const createUser = async (personData: Auth0UserData): Promise<Person> => {
  const newPerson = new PersonDB({
    auth0UserId: personData.sub,
    firstName: personData.given_name,
    lastName: personData.family_name,
    email: personData.email,
    picture: personData.picture
  });
  await newPerson.save();
  return newPerson;
};

export const getUserFromAuthorizationHeader = async (
  authorizationHeader: string,
  createIfNoExist = false
): Promise<Person> => {
  const response = await auth0Client(authorizationHeader).get('/userinfo');
  if (response.data) {
    const person = await PersonDB.findOne({ auth0UserId: response.data.sub });
    if (person) {
      return person;
    } else {
      return createIfNoExist ? await createUser(response.data) : null;
    }
  }
  return null;
};

export const getValidatedUser = async (
  authorizationHeader: string,
  idsToValidate: string[] = null,
  createIfNoExist = false
): Promise<Person> => {
  const user = await getUserFromAuthorizationHeader(authorizationHeader, createIfNoExist);
  if (idsToValidate && !idsToValidate.includes(user._id.toString())) {
    throw new UnauthorizedError();
  }
  return user;
};
