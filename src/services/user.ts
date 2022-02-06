import { User } from '@autonomo/common';
import { getUserOrCreateIt } from '../util/user';

export const getUser = async (authorizationHeader: string): Promise<User> => {
  return await getUserOrCreateIt(authorizationHeader);
};
