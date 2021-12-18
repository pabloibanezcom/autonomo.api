import { BadRequestError, HttpError } from './httpErrors';

const transformGenericError = (error: Error): HttpError => {
  if (error.message.includes('validation failed')) {
    return new BadRequestError();
  }
  return error;
};

export default transformGenericError;
