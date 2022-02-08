import { Person } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import routePaths from '../constants/routePaths';
import { HttpError } from '../httpError/httpErrors';
import transformHttpErrorCode from '../httpError/transformHttpErrorCode';
import { getUser } from '../services/user';

const registerUserRoutes = (router: express.Router): void => {
  router.get(`/${routePaths.USER}`, (req: Request, res: Response) => {
    getUser(req.headers.authorization)
      .then((result: Person) => res.status(200).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });
};

export default registerUserRoutes;
