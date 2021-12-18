import * as express from 'express';
import registerCompanyRoutes from './company';
import registerInvoiceRoutes from './invoice';
import registerPersonRoutes from './person';
import registerShareholdingRoutes from './shareholding';
import registerUserRoutes from './user';

const registerRoutes = (router: express.Router): void => {
  registerCompanyRoutes(router);
  registerInvoiceRoutes(router);
  registerPersonRoutes(router);
  registerUserRoutes(router);
  registerShareholdingRoutes(router);
};

export default registerRoutes;
