import { TaxPayment } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import routePaths from '../constants/routePaths';
import { HttpError } from '../httpError/httpErrors';
import transformGenericError from '../httpError/transformGenericError';
import {
  addTaxPayment,
  deleteTaxPayment,
  getTaxPayment,
  getTaxPayments,
  updateTaxPayment
} from '../services/taxPayment';
import httpCode from './httpCode';

const registerTaxPaymentRoutes = (router: express.Router): void => {
  router.post(`/:userId${routePaths.TAX_PAYMENT}`, (req: Request, res: Response) => {
    getTaxPayments(req.headers.authorization, req.params.userId, req.body)
      .then((result: TaxPayment[]) => res.status(httpCode.GET).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.get(`${routePaths.TAX_PAYMENT}/:id`, (req: Request, res: Response) => {
    getTaxPayment(req.headers.authorization, req.params.id)
      .then((result: TaxPayment) => res.status(httpCode.GET).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.post(routePaths.TAX_PAYMENT, (req: Request, res: Response) => {
    addTaxPayment(req.headers.authorization, req.body)
      .then((result: TaxPayment) => res.status(httpCode.POST).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.put(`${routePaths.TAX_PAYMENT}/:id`, (req: Request, res: Response) => {
    updateTaxPayment(req.headers.authorization, req.params.id, req.body)
      .then((result: TaxPayment) => res.status(httpCode.PUT).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.delete(`${routePaths.TAX_PAYMENT}/:id`, (req: Request, res: Response) => {
    deleteTaxPayment(req.headers.authorization, req.params.id)
      .then((result: TaxPayment) => res.status(httpCode.DELETE).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });
};

export default registerTaxPaymentRoutes;
