import { Company, CompanySearchResult, HttpCodes, Routes } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import { HttpError } from '../httpError/httpErrors';
import transformHttpErrorCode from '../httpError/transformHttpErrorCode';
import { addCompany, deleteCompany, getCompany, searchCompanies, updateCompany } from '../services/company';

const registerCompanyRoutes = (router: express.Router): void => {
  router.post(Routes.SEARCH_COMPANIES, (req: Request, res: Response) => {
    searchCompanies(req.headers.authorization, req.params.businessId, req.body)
      .then((result: CompanySearchResult) => res.status(HttpCodes.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.get(Routes.GET_COMPANY, (req: Request, res: Response) => {
    getCompany(req.headers.authorization, req.params.businessId, req.params.id)
      .then((result: Company) => res.status(HttpCodes.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.post(Routes.ADD_COMPANY, (req: Request, res: Response) => {
    addCompany(req.headers.authorization, req.params.businessId, req.body)
      .then((result: Company) => res.status(HttpCodes.POST).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.put(Routes.UPDATE_COMPANY, (req: Request, res: Response) => {
    updateCompany(req.headers.authorization, req.params.businessId, req.params.id, req.body)
      .then((result: Company) => res.status(HttpCodes.PUT).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.delete(Routes.DELETE_COMPANY, (req: Request, res: Response) => {
    deleteCompany(req.headers.authorization, req.params.businessId, req.params.id)
      .then(() => res.status(HttpCodes.DELETE).send({}))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });
};

export default registerCompanyRoutes;
