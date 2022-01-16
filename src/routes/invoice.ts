import { Invoice } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import routePaths from '../constants/routePaths';
import { HttpError } from '../httpError/httpErrors';
import transformGenericError from '../httpError/transformGenericError';
import { addInvoice, deleteInvoice, getInvoices, updateInvoice } from '../services/invoice';
import httpCode from './httpCode';

const registerInvoiceRoutes = (router: express.Router): void => {
  router.get(`/:userId${routePaths.INCOMES}`, (req: Request, res: Response) => {
    getInvoices(req.headers.authorization, req.params.userId, 'incomes')
      .then((result: Invoice[]) => res.status(httpCode.GET).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.get(`/:userId${routePaths.EXPENSES}`, (req: Request, res: Response) => {
    getInvoices(req.headers.authorization, req.params.userId, 'expenses')
      .then((result: Invoice[]) => res.status(httpCode.GET).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.post(routePaths.INVOICE, (req: Request, res: Response) => {
    addInvoice(req.headers.authorization, req.body)
      .then((result: Invoice) => res.status(httpCode.POST).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.put(`${routePaths.INVOICE}/:id`, (req: Request, res: Response) => {
    updateInvoice(req.headers.authorization, req.params.id, req.body)
      .then((result: Invoice) => res.status(httpCode.PUT).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.delete(`${routePaths.INVOICE}/:id`, (req: Request, res: Response) => {
    deleteInvoice(req.headers.authorization, req.params.id)
      .then((result: Invoice) => res.status(httpCode.DELETE).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });
};

export default registerInvoiceRoutes;
