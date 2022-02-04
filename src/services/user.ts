import { Person } from '@autonomo/common';
import PersonDB from '../models/person';
import { getUserFromAuthorizationHeader } from '../util/user';

export const getUser = async (authorizationHeader: string): Promise<Person> => {
  return await getUserFromAuthorizationHeader(authorizationHeader, true);
};

export const getUserById = async (userId: string): Promise<Person> => {
  return await PersonDB.findById(userId);
};
