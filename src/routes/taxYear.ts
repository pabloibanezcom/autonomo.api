import { TaxYear } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import routePaths from '../constants/routePaths';
import { HttpError } from '../httpError/httpErrors';
import transformGenericError from '../httpError/transformGenericError';
import { addTaxYear, deleteTaxYear, getTaxYear, getTaxYears, updateTaxYear } from '../services/taxYear';
import httpCode from './httpCode';

const registerTaxYearRoutes = (router: express.Router): void => {
  router.get(routePaths.TAX_YEAR, (req: Request, res: Response) => {
    getTaxYears()
      .then((result: TaxYear[]) => res.status(httpCode.GET).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.get(`${routePaths.TAX_YEAR}/:id`, (req: Request, res: Response) => {
    getTaxYear(req.params.id)
      .then((result: TaxYear) => res.status(httpCode.GET).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.post(routePaths.TAX_YEAR, (req: Request, res: Response) => {
    addTaxYear(req.body)
      .then((result: TaxYear) => res.status(httpCode.POST).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.put(`${routePaths.TAX_YEAR}/:id`, (req: Request, res: Response) => {
    updateTaxYear(req.params.id, req.body)
      .then((result: TaxYear) => res.status(httpCode.PUT).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.delete(`${routePaths.TAX_YEAR}/:id`, (req: Request, res: Response) => {
    deleteTaxYear(req.params.id)
      .then((result: TaxYear) => res.status(httpCode.DELETE).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });
};

export default registerTaxYearRoutes;
