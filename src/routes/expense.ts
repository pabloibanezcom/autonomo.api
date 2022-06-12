import { Expense, ExpenseSearchResult, File, HttpCode, Routes } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import { HttpError } from '../httpError/httpErrors';
import transformHttpErrorCode from '../httpError/transformHttpErrorCode';
import RequestWithFiles from '../interfaces/RequestWithFiles';
import {
  addExpense,
  addExpenseFile,
  deleteExpense,
  deleteExpenseFile,
  getExpense,
  searchExpenses,
  updateExpense
} from '../services/expense';

const registerExpenseRoutes = (router: express.Router): void => {
  router.post(Routes.SEARCH_EXPENSES, (req: Request, res: Response) => {
    searchExpenses(req.headers.authorization, req.params.businessId, req.body)
      .then((result: ExpenseSearchResult) => res.status(HttpCode.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.get(Routes.GET_EXPENSE, (req: Request, res: Response) => {
    getExpense(req.headers.authorization, req.params.businessId, req.params.id)
      .then((result: Expense) => res.status(HttpCode.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.post(Routes.ADD_EXPENSE, (req: Request, res: Response) => {
    addExpense(req.headers.authorization, req.params.businessId, req.body)
      .then((result: Expense) => res.status(HttpCode.POST).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.put(Routes.UPDATE_EXPENSE, (req: Request, res: Response) => {
    updateExpense(req.headers.authorization, req.params.businessId, req.params.id, req.body)
      .then((result: Expense) => res.status(HttpCode.PUT).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.delete(Routes.DELETE_EXPENSE, (req: Request, res: Response) => {
    deleteExpense(req.headers.authorization, req.params.businessId, req.params.id)
      .then((result: Expense) => res.status(HttpCode.DELETE).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.post(Routes.ADD_FILE_TO_EXPENSE, (req: RequestWithFiles, res: Response) => {
    addExpenseFile(req.headers.authorization, req.params.businessId, req.params.id, req.files?.expense)
      .then((result: File) => res.status(HttpCode.POST).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.delete(Routes.DELETE_FILE_FROM_EXPENSE, (req: RequestWithFiles, res: Response) => {
    deleteExpenseFile(req.headers.authorization, req.params.businessId, req.params.id)
      .then((result: Expense) => res.status(HttpCode.DELETE).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });
};

export default registerExpenseRoutes;
