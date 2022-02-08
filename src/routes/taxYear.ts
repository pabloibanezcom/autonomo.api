import { TaxYear, TaxYearSearchResult } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import routePaths from '../constants/routePaths';
import { HttpError } from '../httpError/httpErrors';
import transformHttpErrorCode from '../httpError/transformHttpErrorCode';
import { addTaxYear, deleteTaxYear, getTaxYear, searchTaxYears, updateTaxYear } from '../services/taxYear';
import httpCode from './httpCode';

const registerTaxYearRoutes = (router: express.Router): void => {
  router.post(`/${routePaths.TAX_YEAR}/${routePaths.SEARCH}`, (req: Request, res: Response) => {
    searchTaxYears(req.body)
      .then((result: TaxYearSearchResult) => res.status(httpCode.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.get(`/${routePaths.TAX_YEAR}/:id`, (req: Request, res: Response) => {
    getTaxYear(req.params.id)
      .then((result: TaxYear) => res.status(httpCode.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.post(`/${routePaths.TAX_YEAR}`, (req: Request, res: Response) => {
    addTaxYear(req.headers.authorization, req.body)
      .then((result: TaxYear) => res.status(httpCode.POST).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.put(`/${routePaths.TAX_YEAR}/:id`, (req: Request, res: Response) => {
    updateTaxYear(req.headers.authorization, req.params.id, req.body)
      .then((result: TaxYear) => res.status(httpCode.PUT).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.delete(`/${routePaths.TAX_YEAR}/:id`, (req: Request, res: Response) => {
    deleteTaxYear(req.headers.authorization, req.params.id)
      .then((result: TaxYear) => res.status(httpCode.DELETE).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });
};

export default registerTaxYearRoutes;
