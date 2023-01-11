
import { NextFunction, Request, Response } from 'express'
import ApiException from '../helpers/exceptions'

export default (
  error: ApiException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.source) console.error(error.source);

  return res.status(error.statusCode).json({
    status: 'error',
    statusCode: error.statusCode,
    message: error.message,
  });
}