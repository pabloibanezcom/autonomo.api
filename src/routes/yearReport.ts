import { YearReport } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import routePaths from '../constants/routePaths';
import { HttpError } from '../httpError/httpErrors';
import transformHttpErrorCode from '../httpError/transformHttpErrorCode';
import { getYearReport } from '../services/yearReport';
import httpCode from './httpCode';

const registerYearReportRoutes = (router: express.Router): void => {
  router.get(`/${routePaths.BUSINESS_ID}/${routePaths.YEAR_REPORT}/:taxYearId`, (req: Request, res: Response) => {
    getYearReport(req.headers.authorization, req.params.businessId, req.params.taxYearId)
      .then((result: YearReport) => res.status(httpCode.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });
};

export default registerYearReportRoutes;
