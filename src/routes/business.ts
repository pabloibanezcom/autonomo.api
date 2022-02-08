import { Business, BusinessSearchResult } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import routePaths from '../constants/routePaths';
import { HttpError } from '../httpError/httpErrors';
import transformHttpErrorCode from '../httpError/transformHttpErrorCode';
import { addBusiness, getBusiness, searchBusinesses } from '../services/business';
import httpCode from './httpCode';

const registerBusinessRoutes = (router: express.Router): void => {
  router.post(`/${routePaths.BUSINESS}/${routePaths.SEARCH}`, (req: Request, res: Response) => {
    searchBusinesses(req.headers.authorization, req.body)
      .then((result: BusinessSearchResult) => res.status(httpCode.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.get(`/${routePaths.BUSINESS}/:id`, (req: Request, res: Response) => {
    getBusiness(req.headers.authorization, req.params.id)
      .then((result: Business) => res.status(httpCode.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.post(`/${routePaths.BUSINESS}`, (req: Request, res: Response) => {
    addBusiness(req.headers.authorization, req.body)
      .then((result: Business) => res.status(httpCode.POST).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });
};

export default registerBusinessRoutes;
