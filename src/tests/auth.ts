import { auth0Client } from '../httpClient';

const loginBody = {
  client_id: process.env.AUTH0_CLIENT_ID,
  audience: process.env.AUTH0_AUDIENCE,
  scope: 'openid',
  grant_type: 'password'
};

interface Users {
  [key: string]:
    | {
        username: string;
        password: string;
      }
    | undefined;
}

const users: Users = {
  testUser1: {
    username: 'testuser1@autonomo.com',
    password: 'Autonomo1234'
  },
  testUser2: {
    username: 'testuser2@autonomo.com',
    password: 'Autonomo1234'
  }
};

export const login = async (user = 'testUser1'): Promise<string> => {
  const response = await auth0Client().post('/oauth/token', {
    ...loginBody,
    username: users[user].username,
    password: users[user].password
  });
  return response?.data['access_token'];
};
