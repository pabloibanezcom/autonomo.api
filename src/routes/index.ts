import * as express from 'express';
import registerCategoryRoutes from './category';
import registerCompanyRoutes from './company';
import registerInvoiceRoutes from './invoice';
import registerNationalInsurancePaymentRoutes from './nationalInsurancePayment';
import registerPersonRoutes from './person';
import registerShareholdingRoutes from './shareholding';
import registerTaxPaymentRoutes from './taxPayment';
import registerTaxYearRoutes from './taxYear';
import registerUserRoutes from './user';
import registerYearReportRoutes from './yearReport';

const registerRoutes = (router: express.Router): void => {
  registerCategoryRoutes(router);
  registerCompanyRoutes(router);
  registerInvoiceRoutes(router);
  registerPersonRoutes(router);
  registerNationalInsurancePaymentRoutes(router);
  registerShareholdingRoutes(router);
  registerTaxPaymentRoutes(router);
  registerTaxYearRoutes(router);
  registerUserRoutes(router);
  registerYearReportRoutes(router);
};

export default registerRoutes;
