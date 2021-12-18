import axios, { AxiosInstance } from 'axios';

export const auth0Client = (authorizationHeader: string = null): AxiosInstance => {
  const httpClient = axios.create({
    baseURL: process.env.AUTH0_DOMAIN
  });
  if (authorizationHeader) {
    httpClient.defaults.headers.Authorization = authorizationHeader;
  }
  return httpClient;
};
