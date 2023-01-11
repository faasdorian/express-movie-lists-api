
import { NextFunction, Request, Response } from 'express'
import ApiException from '../helpers/exceptions'
import { logger } from '../helpers/logger'

export default (
  error: ApiException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.statusCode == 500) logger.error(error.source?.stack);

  return res.status(error.statusCode).json({
    status: 'error',
    statusCode: error.statusCode,
    message: error.message,
  });
}