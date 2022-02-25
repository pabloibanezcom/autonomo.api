import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED, USER_ALREADY_EXISTS } from './errorMessages';

export class HttpError extends Error {
  code?: number;

  constructor(code = 500, name = '', message = '') {
    super(message);
    this.code = code;
    this.name = name;
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = BAD_REQUEST) {
    super(400, 'Bad request error', message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = UNAUTHORIZED) {
    super(401, 'Unauthorized error', message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = NOT_FOUND) {
    super(404, 'Not found error', message);
  }
}

export class UserAlreadyExistsError extends HttpError {
  constructor(message: string = USER_ALREADY_EXISTS) {
    super(409, 'User already exists error', message);
  }
}
