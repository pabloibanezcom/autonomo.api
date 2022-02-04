import { YearReport } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import routePaths from '../constants/routePaths';
import { HttpError } from '../httpError/httpErrors';
import transformGenericError from '../httpError/transformGenericError';
import { getYearReport } from '../services/yearReport';
import httpCode from './httpCode';

const registerYearReportRoutes = (router: express.Router): void => {
  router.get(`/:userId${routePaths.YEAR_REPORT}/:taxYearId`, (req: Request, res: Response) => {
    getYearReport(req.headers.authorization, req.params.userId, req.params.taxYearId)
      .then((result: YearReport) => res.status(httpCode.GET).send(result))
      .catch((err: HttpError) => res.status(err.code || transformGenericError(err).code).send(err.message));
  });
};

export default registerYearReportRoutes;
