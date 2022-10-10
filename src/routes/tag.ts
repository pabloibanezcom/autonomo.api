import { HttpCode, Routes, Tag, TagSearchResult } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import { HttpError } from '../httpError/httpErrors';
import transformHttpErrorCode from '../httpError/transformHttpErrorCode';
import { addTag, deleteTag, searchCategories, updateTag } from '../services/tag';

const registerTagRoutes = (router: express.Router): void => {
  router.post(Routes.SEARCH_TAGS, (req: Request, res: Response) => {
    searchCategories(req.headers.authorization, req.params.businessId, req.body)
      .then((result: TagSearchResult) => res.status(HttpCode.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.post(Routes.ADD_TAG, (req: Request, res: Response) => {
    addTag(req.headers.authorization, req.params.businessId, req.body)
      .then((result: Tag) => res.status(HttpCode.POST).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.put(Routes.UPDATE_TAG, (req: Request, res: Response) => {
    updateTag(req.headers.authorization, req.params.businessId, req.params.id, req.body)
      .then((result: Tag) => res.status(HttpCode.PUT).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.delete(Routes.DELETE_TAG, (req: Request, res: Response) => {
    deleteTag(req.headers.authorization, req.params.businessId, req.params.id)
      .then((result: Tag) => res.status(HttpCode.DELETE).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });
};

export default registerTagRoutes;
