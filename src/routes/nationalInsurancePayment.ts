import { HttpCode, NationalInsurancePayment, NationalInsurancePaymentSearchResult, Routes } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import { HttpError } from '../httpError/httpErrors';
import transformHttpErrorCode from '../httpError/transformHttpErrorCode';
import {
  addNationalInsurancePayment,
  deleteNationalInsurancePayment,
  getNationalInsurancePayment,
  searchNationalInsurancePayments,
  updateNationalInsurancePayment
} from '../services/nationalInsurancePayment';

const registerNationalInsurancePaymentRoutes = (router: express.Router): void => {
  router.post(Routes.SEARCH_NATIONAL_INSURANCE_PAYMENTS, (req: Request, res: Response) => {
    searchNationalInsurancePayments(req.headers.authorization, req.params.businessId, req.body)
      .then((result: NationalInsurancePaymentSearchResult) => res.status(HttpCode.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.get(Routes.GET_NATIONAL_INSURANCE_PAYMENT, (req: Request, res: Response) => {
    getNationalInsurancePayment(req.headers.authorization, req.params.businessId, req.params.id)
      .then((result: NationalInsurancePayment) => res.status(HttpCode.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.post(Routes.ADD_NATIONAL_INSURANCE_PAYMENT, (req: Request, res: Response) => {
    addNationalInsurancePayment(req.headers.authorization, req.params.businessId, req.body)
      .then((result: NationalInsurancePayment) => res.status(HttpCode.POST).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.put(Routes.UPDATE_NATIONAL_INSURANCE_PAYMENT, (req: Request, res: Response) => {
    updateNationalInsurancePayment(req.headers.authorization, req.params.businessId, req.params.id, req.body)
      .then((result: NationalInsurancePayment) => res.status(HttpCode.PUT).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.delete(Routes.DELETE_NATIONAL_INSURANCE_PAYMENT, (req: Request, res: Response) => {
    deleteNationalInsurancePayment(req.headers.authorization, req.params.businessId, req.params.id)
      .then((result: NationalInsurancePayment) => res.status(HttpCode.DELETE).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });
};

export default registerNationalInsurancePaymentRoutes;
