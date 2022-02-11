import { File, HttpCodes, Invoice, InvoiceSearchResult, Routes } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import { HttpError } from '../httpError/httpErrors';
import transformHttpErrorCode from '../httpError/transformHttpErrorCode';
import RequestWithFiles from '../interfaces/RequestWithFiles';
import {
  addInvoice,
  addInvoiceFile,
  deleteInvoice,
  deleteInvoiceFile,
  getInvoice,
  searchInvoices,
  updateInvoice
} from '../services/invoice';

const registerInvoiceRoutes = (router: express.Router): void => {
  router.post(Routes.SEARCH_INVOICES, (req: Request, res: Response) => {
    searchInvoices(req.headers.authorization, req.params.businessId, req.body)
      .then((result: InvoiceSearchResult) => res.status(HttpCodes.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.get(Routes.GET_INVOICE, (req: Request, res: Response) => {
    getInvoice(req.headers.authorization, req.params.businessId, req.params.id)
      .then((result: Invoice) => res.status(HttpCodes.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.post(Routes.ADD_INVOICE, (req: Request, res: Response) => {
    addInvoice(req.headers.authorization, req.params.businessId, req.body)
      .then((result: Invoice) => res.status(HttpCodes.POST).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.put(Routes.UPDATE_INVOICE, (req: Request, res: Response) => {
    updateInvoice(req.headers.authorization, req.params.businessId, req.params.id, req.body)
      .then((result: Invoice) => res.status(HttpCodes.PUT).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.delete(Routes.DELETE_INVOICE, (req: Request, res: Response) => {
    deleteInvoice(req.headers.authorization, req.params.businessId, req.params.id)
      .then((result: Invoice) => res.status(HttpCodes.DELETE).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.post(Routes.ADD_FILE_TO_INVOICE, (req: RequestWithFiles, res: Response) => {
    addInvoiceFile(req.headers.authorization, req.params.businessId, req.params.id, req.files?.invoice)
      .then((result: File) => res.status(HttpCodes.POST).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });

  router.delete(Routes.DELETE_FILE_FROM_INVOICE, (req: RequestWithFiles, res: Response) => {
    deleteInvoiceFile(req.headers.authorization, req.params.businessId, req.params.id)
      .then((result: Invoice) => res.status(HttpCodes.DELETE).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });
};

export default registerInvoiceRoutes;
