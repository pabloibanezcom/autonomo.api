import { HttpCodes, Routes, YearReport } from '@autonomo/common';
import * as express from 'express';
import { Request, Response } from 'express';
import { HttpError } from '../httpError/httpErrors';
import transformHttpErrorCode from '../httpError/transformHttpErrorCode';
import { getYearReport } from '../services/yearReport';

const registerYearReportRoutes = (router: express.Router): void => {
  router.get(Routes.GET_YEAR_REPORT, (req: Request, res: Response) => {
    getYearReport(req.headers.authorization, req.params.businessId, req.params.id)
      .then((result: YearReport) => res.status(HttpCodes.GET).send(result))
      .catch((err: HttpError) => res.status(transformHttpErrorCode(err.code)).send(err.message));
  });
};

export default registerYearReportRoutes;
