import { Category, CategorySearchResult, HttpCodes, Routes } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import { HttpError } from '../httpError/httpErrors';
import transformHttpErrorCode from '../httpError/transformHttpErrorCode';
import { addCategory, deleteCategory, searchCategories, updateCategory } from '../services/category';

const registerCategoryRoutes = (router: express.Router): void => {
  router.post(Routes.SEARCH_CATEGORIES, (req: Request, res: Response) => {
    searchCategories(req.headers.authorization, req.params.businessId, req.body)
      .then((result: CategorySearchResult) => res.status(HttpCodes.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.post(Routes.ADD_CATEGORY, (req: Request, res: Response) => {
    addCategory(req.headers.authorization, req.params.businessId, req.body)
      .then((result: Category) => res.status(HttpCodes.POST).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.put(Routes.UPDATE_CATEGORY, (req: Request, res: Response) => {
    updateCategory(req.headers.authorization, req.params.businessId, req.params.id, req.body)
      .then((result: Category) => res.status(HttpCodes.PUT).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.delete(Routes.DELETE_CATEGORY, (req: Request, res: Response) => {
    deleteCategory(req.headers.authorization, req.params.businessId, req.params.id)
      .then((result: Category) => res.status(HttpCodes.DELETE).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });
};

export default registerCategoryRoutes;
