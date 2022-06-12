import { File, HttpCode, Income, IncomeSearchResult, Routes } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import { HttpError } from '../httpError/httpErrors';
import transformHttpErrorCode from '../httpError/transformHttpErrorCode';
import RequestWithFiles from '../interfaces/RequestWithFiles';
import {
  addIncome,
  addIncomeFile,
  deleteIncome,
  deleteIncomeFile,
  getIncome,
  searchIncomes,
  updateIncome
} from '../services/income';

const registerIncomeRoutes = (router: express.Router): void => {
  router.post(Routes.SEARCH_INCOMES, (req: Request, res: Response) => {
    searchIncomes(req.headers.authorization, req.params.businessId, req.body)
      .then((result: IncomeSearchResult) => res.status(HttpCode.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.get(Routes.GET_INCOME, (req: Request, res: Response) => {
    getIncome(req.headers.authorization, req.params.businessId, req.params.id)
      .then((result: Income) => res.status(HttpCode.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.post(Routes.ADD_INCOME, (req: Request, res: Response) => {
    addIncome(req.headers.authorization, req.params.businessId, req.body)
      .then((result: Income) => res.status(HttpCode.POST).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.put(Routes.UPDATE_INCOME, (req: Request, res: Response) => {
    updateIncome(req.headers.authorization, req.params.businessId, req.params.id, req.body)
      .then((result: Income) => res.status(HttpCode.PUT).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.delete(Routes.DELETE_INCOME, (req: Request, res: Response) => {
    deleteIncome(req.headers.authorization, req.params.businessId, req.params.id)
      .then((result: Income) => res.status(HttpCode.DELETE).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.post(Routes.ADD_FILE_TO_INCOME, (req: RequestWithFiles, res: Response) => {
    addIncomeFile(req.headers.authorization, req.params.businessId, req.params.id, req.files?.income)
      .then((result: File) => res.status(HttpCode.POST).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.delete(Routes.DELETE_FILE_FROM_INCOME, (req: RequestWithFiles, res: Response) => {
    deleteIncomeFile(req.headers.authorization, req.params.businessId, req.params.id)
      .then((result: Income) => res.status(HttpCode.DELETE).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });
};

export default registerIncomeRoutes;
