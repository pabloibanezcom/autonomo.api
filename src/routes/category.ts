import { Category } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import routePaths from '../constants/routePaths';
import { HttpError } from '../httpError/httpErrors';
import transformGenericError from '../httpError/transformGenericError';
import { addCategory, deleteCategory, getCategoriesByType, updateCategory } from '../services/category';
import httpCode from './httpCode';

const registerCategoryRoutes = (router: express.Router): void => {
  router.get(`${routePaths.CATEGORY}/:type`, (req: Request, res: Response) => {
    getCategoriesByType(req.headers.authorization, req.params.type)
      .then((result: Category[]) => res.status(httpCode.GET).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.post(routePaths.CATEGORY, (req: Request, res: Response) => {
    addCategory(req.headers.authorization, req.body)
      .then((result: Category) => res.status(httpCode.POST).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.put(`${routePaths.CATEGORY}/:id`, (req: Request, res: Response) => {
    updateCategory(req.headers.authorization, req.params.id, req.body)
      .then((result: Category) => res.status(httpCode.PUT).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.delete(`${routePaths.CATEGORY}/:id`, (req: Request, res: Response) => {
    deleteCategory(req.headers.authorization, req.params.id)
      .then((result: Category) => res.status(httpCode.DELETE).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });
};

export default registerCategoryRoutes;
