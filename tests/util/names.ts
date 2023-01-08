export const endpointName = (method: string, endpoint: string): string => {
  return `${method.toUpperCase()} ${endpoint.toLowerCase()}`;
};

export const testName = (httpCode: number, description: string): string => {
  return `${httpCode} ==> ${description}`;
};
