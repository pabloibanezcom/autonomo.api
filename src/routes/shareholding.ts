import { Shareholding } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import routePaths from '../constants/routePaths';
import { HttpError } from '../httpError/httpErrors';
import transformGenericError from '../httpError/transformGenericError';
import {
  addShareholding,
  deleteShareholding,
  getShareholding,
  getShareholdingsByCompany,
  getShareholdingsByShareholder,
  updateShareholding
} from '../services/shareholding';
import httpCode from './httpCode';

const registerShareholdingRoutes = (router: express.Router): void => {
  router.get(`${routePaths.SHAREHOLDING}/company/:companyId`, (req: Request, res: Response) => {
    getShareholdingsByCompany(req.params.companyId)
      .then((result: Shareholding[]) => res.status(httpCode.GET).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.get(`${routePaths.SHAREHOLDING}/shareholder/:shareholderId`, (req: Request, res: Response) => {
    getShareholdingsByShareholder(req.params.shareholderId)
      .then((result: Shareholding[]) => res.status(httpCode.GET).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.get(`${routePaths.SHAREHOLDING}/:id`, (req: Request, res: Response) => {
    getShareholding(req.params.id)
      .then((result: Shareholding) => res.status(httpCode.GET).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.post(routePaths.SHAREHOLDING, (req: Request, res: Response) => {
    addShareholding(req.body)
      .then((result: Shareholding) => res.status(httpCode.POST).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.put(`${routePaths.SHAREHOLDING}/:id`, (req: Request, res: Response) => {
    updateShareholding(req.params.id, req.body)
      .then((result: Shareholding) => res.status(httpCode.PUT).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.delete(`${routePaths.SHAREHOLDING}/:id`, (req: Request, res: Response) => {
    deleteShareholding(req.params.id)
      .then(() => res.status(httpCode.DELETE).send({}))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });
};

export default registerShareholdingRoutes;
