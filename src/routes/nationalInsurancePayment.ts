import { NationalInsurancePayment, NationalInsurancePaymentSearchResult } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import routePaths from '../constants/routePaths';
import { HttpError } from '../httpError/httpErrors';
import transformHttpErrorCode from '../httpError/transformHttpErrorCode';
import {
  addNationalInsurancePayment,
  deleteNationalInsurancePayment,
  getNationalInsurancePayment,
  searchNationalInsurancePayments,
  updateNationalInsurancePayment
} from '../services/nationalInsurancePayment';
import httpCode from './httpCode';

const registerNationalInsurancePaymentRoutes = (router: express.Router): void => {
  router.post(
    `/${routePaths.BUSINESS_ID}/${routePaths.NATIONAL_INSURANCE_PAYMENT}/${routePaths.SEARCH}`,
    (req: Request, res: Response) => {
      searchNationalInsurancePayments(req.headers.authorization, req.params.businessId, req.body)
        .then((result: NationalInsurancePaymentSearchResult) => res.status(httpCode.GET).send(result))
        .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
    }
  );

  router.get(
    `/${routePaths.BUSINESS_ID}/${routePaths.NATIONAL_INSURANCE_PAYMENT}/:id`,
    (req: Request, res: Response) => {
      getNationalInsurancePayment(req.headers.authorization, req.params.businessId, req.params.id)
        .then((result: NationalInsurancePayment) => res.status(httpCode.GET).send(result))
        .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
    }
  );

  router.post(`/${routePaths.BUSINESS_ID}/${routePaths.NATIONAL_INSURANCE_PAYMENT}`, (req: Request, res: Response) => {
    addNationalInsurancePayment(req.headers.authorization, req.params.businessId, req.body)
      .then((result: NationalInsurancePayment) => res.status(httpCode.POST).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.put(
    `/${routePaths.BUSINESS_ID}/${routePaths.NATIONAL_INSURANCE_PAYMENT}/:id`,
    (req: Request, res: Response) => {
      updateNationalInsurancePayment(req.headers.authorization, req.params.businessId, req.params.id, req.body)
        .then((result: NationalInsurancePayment) => res.status(httpCode.PUT).send(result))
        .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
    }
  );

  router.delete(
    `/${routePaths.BUSINESS_ID}/${routePaths.NATIONAL_INSURANCE_PAYMENT}/:id`,
    (req: Request, res: Response) => {
      deleteNationalInsurancePayment(req.headers.authorization, req.params.businessId, req.params.id)
        .then((result: NationalInsurancePayment) => res.status(httpCode.DELETE).send(result))
        .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
    }
  );
};

export default registerNationalInsurancePaymentRoutes;
