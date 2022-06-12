import { Business, BusinessSearchResult, HttpCode, Routes } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import { HttpError } from '../httpError/httpErrors';
import transformHttpErrorCode from '../httpError/transformHttpErrorCode';
import { addBusiness, getBusiness, searchBusinesses } from '../services/business';

const registerBusinessRoutes = (router: express.Router): void => {
  router.post(Routes.SEARCH_BUSINESSES, (req: Request, res: Response) => {
    searchBusinesses(req.headers.authorization, req.body)
      .then((result: BusinessSearchResult) => res.status(HttpCode.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.get(Routes.GET_BUSINESS, (req: Request, res: Response) => {
    getBusiness(req.headers.authorization, req.params.id)
      .then((result: Business) => res.status(HttpCode.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.post(Routes.ADD_BUSINESS, (req: Request, res: Response) => {
    addBusiness(req.headers.authorization, req.body)
      .then((result: Business) => res.status(HttpCode.POST).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });
};

export default registerBusinessRoutes;
