import { BadRequestError, HttpError } from './httpErrors';

const transformGenericError = (error: Error): HttpError => {
  if (['validation failed', 'Cast to ObjectId failed'].some(msg => error.message.includes(msg))) {
    return new BadRequestError();
  }
  return error;
};

export default transformGenericError;
