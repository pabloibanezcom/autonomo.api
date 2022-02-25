import { HttpCodes, LoginResponse, Person, Routes } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import { HttpError } from '../httpError/httpErrors';
import transformHttpErrorCode from '../httpError/transformHttpErrorCode';
import { changePassword, getUser, login, registerUser } from '../services/user';

const registerUserRoutes = (router: express.Router): void => {
  router.post(Routes.LOGIN, (req: Request, res: Response) => {
    login(req.body)
      .then((result: LoginResponse) => res.status(HttpCodes.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.post(Routes.REGISTER, (req: Request, res: Response) => {
    registerUser(req.body)
      .then((result: boolean) => res.status(HttpCodes.POST).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.post(Routes.CHANGE_PASSWORD, (req: Request, res: Response) => {
    changePassword(req.body)
      .then((result: boolean) => res.status(HttpCodes.POST).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.get(Routes.GET_USER, (req: Request, res: Response) => {
    getUser(req.headers.authorization)
      .then((result: Person) => res.status(HttpCodes.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });
};

export default registerUserRoutes;
