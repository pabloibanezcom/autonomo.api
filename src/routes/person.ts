import { Person } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import routePaths from '../constants/routePaths';
import { HttpError } from '../httpError/httpErrors';
import transformGenericError from '../httpError/transformGenericError';
import { addPerson, deletePerson, getPeople, getPerson, updatePerson } from '../services/person';
import httpCode from './httpCode';

const registerPersonRoutes = (router: express.Router): void => {
  router.get(routePaths.PERSON, (req: Request, res: Response) => {
    getPeople()
      .then((result: Person[]) => res.status(httpCode.GET).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.get(`${routePaths.PERSON}/:id`, (req: Request, res: Response) => {
    getPerson(req.params.id)
      .then((result: Person) => res.status(httpCode.GET).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.post(routePaths.PERSON, (req: Request, res: Response) => {
    addPerson(req.body)
      .then((result: Person) => res.status(httpCode.POST).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.put(`${routePaths.PERSON}/:id`, (req: Request, res: Response) => {
    updatePerson(req.params.id, req.body)
      .then((result: Person) => res.status(httpCode.PUT).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.delete(`${routePaths.PERSON}/:id`, (req: Request, res: Response) => {
    deletePerson(req.params.id)
      .then(() => res.status(httpCode.DELETE).send({}))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });
};

export default registerPersonRoutes;
