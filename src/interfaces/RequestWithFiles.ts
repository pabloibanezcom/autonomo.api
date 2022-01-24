import { Request } from 'express';

export default interface RequestWithFiles extends Request {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  files: any;
}
