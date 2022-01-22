import * as express from 'express';
import registerCompanyRoutes from './company';
import registerInvoiceRoutes from './invoice';
import registerPersonRoutes from './person';
import registerShareholdingRoutes from './shareholding';
import registerTaxPaymentRoutes from './taxPayment';
import registerUserRoutes from './user';

const registerRoutes = (router: express.Router): void => {
  registerCompanyRoutes(router);
  registerInvoiceRoutes(router);
  registerPersonRoutes(router);
  registerUserRoutes(router);
  registerShareholdingRoutes(router);
  registerTaxPaymentRoutes(router);
};

export default registerRoutes;
