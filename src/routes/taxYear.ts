import { HttpCodes, Routes, TaxYear, TaxYearSearchResult } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import { HttpError } from '../httpError/httpErrors';
import transformHttpErrorCode from '../httpError/transformHttpErrorCode';
import {
  addTaxYear,
  deleteTaxYear,
  getBusinessTaxYear,
  getTaxYear,
  searchTaxYears,
  updateTaxYear
} from '../services/taxYear';

const registerTaxYearRoutes = (router: express.Router): void => {
  router.post(Routes.SEARCH_TAX_YEARS, (req: Request, res: Response) => {
    searchTaxYears(req.body)
      .then((result: TaxYearSearchResult) => res.status(HttpCodes.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.get(Routes.GET_TAX_YEAR, (req: Request, res: Response) => {
    getTaxYear(req.params.id)
      .then((result: TaxYear) => res.status(HttpCodes.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.get(Routes.GET_BUSINESS_TAX_YEAR, (req: Request, res: Response) => {
    getBusinessTaxYear(req.params.businessId)
      .then((result: TaxYear) => res.status(HttpCodes.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.post(Routes.ADD_TAX_YEAR, (req: Request, res: Response) => {
    addTaxYear(req.headers.authorization, req.body)
      .then((result: TaxYear) => res.status(HttpCodes.POST).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.put(Routes.UPDATE_TAX_YEAR, (req: Request, res: Response) => {
    updateTaxYear(req.headers.authorization, req.params.id, req.body)
      .then((result: TaxYear) => res.status(HttpCodes.PUT).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.delete(Routes.DELETE_TAX_YEAR, (req: Request, res: Response) => {
    deleteTaxYear(req.headers.authorization, req.params.id)
      .then((result: TaxYear) => res.status(HttpCodes.DELETE).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });
};

export default registerTaxYearRoutes;
