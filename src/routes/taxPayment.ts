import { HttpCode, Routes, TaxPayment, TaxPaymentSearchResult } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import { HttpError } from '../httpError/httpErrors';
import transformHttpErrorCode from '../httpError/transformHttpErrorCode';
import {
  addTaxPayment,
  deleteTaxPayment,
  getTaxPayment,
  searchTaxPayments,
  updateTaxPayment
} from '../services/taxPayment';

const registerTaxPaymentRoutes = (router: express.Router): void => {
  router.post(Routes.SEARCH_TAX_PAYMENTS, (req: Request, res: Response) => {
    searchTaxPayments(req.headers.authorization, req.params.businessId, req.body)
      .then((result: TaxPaymentSearchResult) => res.status(HttpCode.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.get(Routes.GET_TAX_PAYMENT, (req: Request, res: Response) => {
    getTaxPayment(req.headers.authorization, req.params.businessId, req.params.id)
      .then((result: TaxPayment) => res.status(HttpCode.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.post(Routes.ADD_TAX_PAYMENT, (req: Request, res: Response) => {
    addTaxPayment(req.headers.authorization, req.params.businessId, req.body)
      .then((result: TaxPayment) => res.status(HttpCode.POST).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.put(Routes.UPDATE_TAX_PAYMENT, (req: Request, res: Response) => {
    updateTaxPayment(req.headers.authorization, req.params.businessId, req.params.id, req.body)
      .then((result: TaxPayment) => res.status(HttpCode.PUT).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.delete(Routes.DELETE_TAX_PAYMENT, (req: Request, res: Response) => {
    deleteTaxPayment(req.headers.authorization, req.params.businessId, req.params.id)
      .then((result: TaxPayment) => res.status(HttpCode.DELETE).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });
};

export default registerTaxPaymentRoutes;
