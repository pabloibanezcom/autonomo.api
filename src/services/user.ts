import { Person } from '@autonomo/common';
import { getUserFromAuthorizationHeader } from '../util/user';

export const getUser = async (authorizationHeader: string): Promise<Person> => {
  return await getUserFromAuthorizationHeader(authorizationHeader, true);
};
