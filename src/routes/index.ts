import * as express from 'express';
import registerBusinessRoutes from './business';
import registerCategoryRoutes from './category';
import registerCompanyRoutes from './company';
import registerInvoiceRoutes from './income';
import registerNationalInsurancePaymentRoutes from './nationalInsurancePayment';
import registerPersonRoutes from './person';
import registerTaxPaymentRoutes from './taxPayment';
import registerTaxYearRoutes from './taxYear';
import registerUserRoutes from './user';
import registerYearReportRoutes from './yearReport';

const registerRoutes = (router: express.Router): void => {
  registerBusinessRoutes(router);
  registerCategoryRoutes(router);
  registerCompanyRoutes(router);
  registerInvoiceRoutes(router);
  registerPersonRoutes(router);
  registerNationalInsurancePaymentRoutes(router);
  registerTaxPaymentRoutes(router);
  registerTaxYearRoutes(router);
  registerUserRoutes(router);
  registerYearReportRoutes(router);
};

export default registerRoutes;
