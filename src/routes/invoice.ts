import { File, Invoice } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import routePaths from '../constants/routePaths';
import { HttpError } from '../httpError/httpErrors';
import transformGenericError from '../httpError/transformGenericError';
import RequestWithFiles from '../interfaces/RequestWithFiles';
import {
  addInvoice,
  addInvoiceFile,
  deleteInvoice,
  deleteInvoiceFile,
  getInvoice,
  getInvoices,
  updateInvoice
} from '../services/invoice';
import httpCode from './httpCode';

const registerInvoiceRoutes = (router: express.Router): void => {
  router.post(
    `/${routePaths.BUSINESS_ID}/${routePaths.INVOICE}/${routePaths.SEARCH}`,
    (req: Request, res: Response) => {
      getInvoices(req.headers.authorization, req.params.businessId, req.body)
        .then((result: Invoice[]) => res.status(httpCode.GET).send(result))
        .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
    }
  );

  router.get(`/${routePaths.BUSINESS_ID}/${routePaths.INVOICE}/:id`, (req: Request, res: Response) => {
    getInvoice(req.headers.authorization, req.params.businessId, req.params.id)
      .then((result: Invoice) => res.status(httpCode.GET).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.post(`/${routePaths.BUSINESS_ID}/${routePaths.INVOICE}`, (req: Request, res: Response) => {
    addInvoice(req.headers.authorization, req.params.businessId, req.body)
      .then((result: Invoice) => res.status(httpCode.POST).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.put(`/${routePaths.BUSINESS_ID}/${routePaths.INVOICE}/:id`, (req: Request, res: Response) => {
    updateInvoice(req.headers.authorization, req.params.businessId, req.params.id, req.body)
      .then((result: Invoice) => res.status(httpCode.PUT).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.delete(`/${routePaths.BUSINESS_ID}/${routePaths.INVOICE}/:id`, (req: Request, res: Response) => {
    deleteInvoice(req.headers.authorization, req.params.businessId, req.params.id)
      .then((result: Invoice) => res.status(httpCode.DELETE).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.post(`/${routePaths.BUSINESS_ID}/${routePaths.INVOICE}/:id/file`, (req: RequestWithFiles, res: Response) => {
    addInvoiceFile(req.headers.authorization, req.params.businessId, req.params.id, req.files?.invoice)
      .then((result: File) => res.status(httpCode.POST).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.delete(`/${routePaths.BUSINESS_ID}/${routePaths.INVOICE}/:id/file`, (req: RequestWithFiles, res: Response) => {
    deleteInvoiceFile(req.headers.authorization, req.params.businessId, req.params.id)
      .then((result: Invoice) => res.status(httpCode.DELETE).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });
};

export default registerInvoiceRoutes;
