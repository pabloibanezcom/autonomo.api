import { Company } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import routePaths from '../constants/routePaths';
import { HttpError } from '../httpError/httpErrors';
import transformGenericError from '../httpError/transformGenericError';
import { addCompany, deleteCompany, getCompanies, getCompany, updateCompany } from '../services/company';
import httpCode from './httpCode';

const registerCompanyRoutes = (router: express.Router): void => {
  router.post(
    `/${routePaths.BUSINESS_ID}/${routePaths.COMPANY}/${routePaths.SEARCH}`,
    (req: Request, res: Response) => {
      getCompanies(req.headers.authorization, req.params.businessId)
        .then((result: Company[]) => res.status(httpCode.GET).send(result))
        .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
    }
  );

  router.get(`/${routePaths.BUSINESS_ID}/${routePaths.COMPANY}/:id`, (req: Request, res: Response) => {
    getCompany(req.headers.authorization, req.params.businessId, req.params.id)
      .then((result: Company) => res.status(httpCode.GET).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.post(`/${routePaths.BUSINESS_ID}/${routePaths.COMPANY}`, (req: Request, res: Response) => {
    addCompany(req.headers.authorization, req.params.businessId, req.body)
      .then((result: Company) => res.status(httpCode.POST).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.put(`/${routePaths.BUSINESS_ID}/${routePaths.COMPANY}/:id`, (req: Request, res: Response) => {
    updateCompany(req.headers.authorization, req.params.businessId, req.params.id, req.body)
      .then((result: Company) => res.status(httpCode.PUT).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.delete(`/${routePaths.BUSINESS_ID}/${routePaths.COMPANY}/:id`, (req: Request, res: Response) => {
    deleteCompany(req.headers.authorization, req.params.businessId, req.params.id)
      .then(() => res.status(httpCode.DELETE).send({}))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });
};

export default registerCompanyRoutes;
