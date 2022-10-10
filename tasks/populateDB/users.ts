import { User } from '@autonomo/common';
import PersonDB from '../../src/models/person';
import UserDB from '../../src/models/user';
import { hashPassword } from '../../src/util/user';
import { log } from './log';

type MockUserData = {
  email: string;
  password: string;
  isAdmin: boolean;
};

const generateUsers = async (users: MockUserData[]): Promise<void> => {
  const newUsers = await Promise.all(
    users.map(async (user): Promise<User> => {
      // add user
      const person = await PersonDB.findOne({ email: user.email });
      const u = await UserDB.create({ ...user, password: await hashPassword(user.password), person: person?.id });
      return u;
    })
  );
  log('Users generated', newUsers.length);
};

export { generateUsers };
