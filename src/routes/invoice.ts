import { Invoice } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import routePaths from '../constants/routePaths';
import { HttpError } from '../httpError/httpErrors';
import transformGenericError from '../httpError/transformGenericError';
import { addInvoice, getInvoices } from '../services/invoice';

const registerInvoiceRoutes = (router: express.Router): void => {
  router.get(routePaths.INVOICE_GET_ALL, (req: Request, res: Response) => {
    getInvoices()
      .then((result: Invoice[]) => res.status(200).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });

  router.post(routePaths.INVOICE_ADD, (req: Request, res: Response) => {
    addInvoice(req.body)
      .then((result: Invoice) => res.status(201).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });
};

export default registerInvoiceRoutes;
