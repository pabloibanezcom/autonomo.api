import { NationalInsurancePayment } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import routePaths from '../constants/routePaths';
import { HttpError } from '../httpError/httpErrors';
import transformGenericError from '../httpError/transformGenericError';
import {
  addNationalInsurancePayment,
  deleteNationalInsurancePayment,
  getNationalInsurancePayment,
  getNationalInsurancePayments,
  updateNationalInsurancePayment
} from '../services/nationalInsurancePayment';
import httpCode from './httpCode';

const registerNationalInsurancePaymentRoutes = (router: express.Router): void => {
  router.get(`/:userId${routePaths.NATIONAL_INSURANCE_PAYMENT}`, (req: Request, res: Response) => {
    getNationalInsurancePayments(req.headers.authorization, req.params.userId)
      .then((result: NationalInsurancePayment[]) => res.status(httpCode.GET).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.get(`${routePaths.NATIONAL_INSURANCE_PAYMENT}/:id`, (req: Request, res: Response) => {
    getNationalInsurancePayment(req.headers.authorization, req.params.id)
      .then((result: NationalInsurancePayment) => res.status(httpCode.GET).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.post(routePaths.NATIONAL_INSURANCE_PAYMENT, (req: Request, res: Response) => {
    addNationalInsurancePayment(req.headers.authorization, req.body)
      .then((result: NationalInsurancePayment) => res.status(httpCode.POST).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.put(`${routePaths.NATIONAL_INSURANCE_PAYMENT}/:id`, (req: Request, res: Response) => {
    updateNationalInsurancePayment(req.headers.authorization, req.params.id, req.body)
      .then((result: NationalInsurancePayment) => res.status(httpCode.PUT).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.delete(`${routePaths.NATIONAL_INSURANCE_PAYMENT}/:id`, (req: Request, res: Response) => {
    deleteNationalInsurancePayment(req.headers.authorization, req.params.id)
      .then((result: NationalInsurancePayment) => res.status(httpCode.DELETE).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });
};

export default registerNationalInsurancePaymentRoutes;
