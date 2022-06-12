import { HttpCode, Person, PersonSearchResult, Routes } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import { HttpError } from '../httpError/httpErrors';
import transformHttpErrorCode from '../httpError/transformHttpErrorCode';
import { addPerson, deletePerson, getPerson, searchPeople, updatePerson } from '../services/person';

const registerPersonRoutes = (router: express.Router): void => {
  router.post(Routes.SEARCH_PEOPLE, (req: Request, res: Response) => {
    searchPeople(req.headers.authorization, req.params.businessId, req.body)
      .then((result: PersonSearchResult) => res.status(HttpCode.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.get(Routes.GET_PERSON, (req: Request, res: Response) => {
    getPerson(req.headers.authorization, req.params.businessId, req.params.id)
      .then((result: Person) => res.status(HttpCode.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.post(Routes.ADD_PERSON, (req: Request, res: Response) => {
    addPerson(req.headers.authorization, req.params.businessId, req.body)
      .then((result: Person) => res.status(HttpCode.POST).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.put(Routes.UPDATE_PERSON, (req: Request, res: Response) => {
    updatePerson(req.headers.authorization, req.params.businessId, req.params.id, req.body)
      .then((result: Person) => res.status(HttpCode.PUT).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.delete(Routes.DELETE_PERSON, (req: Request, res: Response) => {
    deletePerson(req.headers.authorization, req.params.businessId, req.params.id)
      .then(() => res.status(HttpCode.DELETE).send({}))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });
};

export default registerPersonRoutes;
